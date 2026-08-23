package com.sentinel.processor.kafka;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.ListOffsetsResult;
import org.apache.kafka.clients.admin.OffsetSpec;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.springframework.kafka.config.StreamsBuilderFactoryBean;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.concurrent.TimeUnit;

@RestController
public class KafkaTopologyController {

    private final KafkaAdmin kafkaAdmin;
    private final StreamsBuilderFactoryBean streamsBuilderFactoryBean;

    public KafkaTopologyController(KafkaAdmin kafkaAdmin, StreamsBuilderFactoryBean streamsBuilderFactoryBean) {
        this.kafkaAdmin = kafkaAdmin;
        this.streamsBuilderFactoryBean = streamsBuilderFactoryBean;
    }

    @GetMapping("/kafka-topology")
    public Map<String, Object> getKafkaTopology() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> topicsList = new ArrayList<>();

        // Upgraded to map a list of consumer groups per topic (supports multiple listeners like Streams + Cassandra sinks)
        Map<String, List<String>> topicGroupsMap = new LinkedHashMap<>();
        topicGroupsMap.put("request_logs", Collections.singletonList("request_logs_group"));
        topicGroupsMap.put("tenant_minute_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("product_minute_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("service_minute_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("endpoint_minute_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("tenant_hour_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("product_hour_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("service_hour_analytics", Collections.singletonList("sentinel-analytics"));

        // Example with multiple consumer groups (Stream Processor + Cassandra Listener Group)
        topicGroupsMap.put("endpoint_hour_analytics", Arrays.asList("sentinel-analytics", "endpoint_hour_analytics_group"));

        topicGroupsMap.put("tenant_day_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("product_day_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("service_day_analytics", Collections.singletonList("sentinel-analytics"));
        topicGroupsMap.put("endpoint_day_analytics", Collections.singletonList("sentinel-analytics"));

        try (AdminClient adminClient = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {

            for (Map.Entry<String, List<String>> entry : topicGroupsMap.entrySet()) {
                String topicName = entry.getKey();
                List<String> groupIds = entry.getValue();

                Map<String, Object> topicInfo = new HashMap<>();
                topicInfo.put("topicName", topicName);

                int partitionCount = topicName.equals("request_logs") ? 2 : 1;
                long maxOffset = 0;

                // Calculate max log offset across partitions
                for (int p = 0; p < partitionCount; p++) {
                    TopicPartition tp = new TopicPartition(topicName, p);
                    long logEndOffset = getLogEndOffset(adminClient, tp);
                    if (logEndOffset > maxOffset) {
                        maxOffset = logEndOffset;
                    }
                }
                topicInfo.put("currentOffset", maxOffset);

                // Loop through each consumer group listener for this topic
                List<Map<String, Object>> consumerGroupsData = new ArrayList<>();
                for (String groupId : groupIds) {
                    List<Map<String, Object>> activeConsumers = new ArrayList<>();
                    long totalGroupLag = 0;

                    for (int p = 0; p < partitionCount; p++) {
                        TopicPartition tp = new TopicPartition(topicName, p);
                        long logEndOffset = getLogEndOffset(adminClient, tp);
                        long committedOffset = getCommittedOffset(adminClient, groupId, tp);

                        long partitionLag = (committedOffset < 0) ? 0 : Math.max(0, logEndOffset - committedOffset);
                        totalGroupLag += partitionLag;

                        Map<String, Object> partitionThread = new HashMap<>();
                        partitionThread.put("threadId", groupId + "-consumer-" + p);
                        partitionThread.put("assignedPartition", p);
                        partitionThread.put("offset", committedOffset < 0 ? 0 : committedOffset);
                        partitionThread.put("lag", partitionLag);
                        activeConsumers.add(partitionThread);
                    }

                    Map<String, Object> groupData = new HashMap<>();
                    groupData.put("consumerGroupId", groupId);
                    groupData.put("consumerLag", totalGroupLag);
                    groupData.put("activeConsumers", activeConsumers);
                    consumerGroupsData.add(groupData);
                }

                // Exposes multiple groups cleanly to the frontend while keeping backward compatibility
                topicInfo.put("consumerGroups", consumerGroupsData);
                topicInfo.put("consumerGroupId", groupIds.get(0)); // Fallback property
                topicsList.add(topicInfo);
            }

            response.put("topics", topicsList);
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/kafka-topology/stats")
    public Map<String, Object> getKafkaTopologyStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalMessagesSum = 0;

        try (AdminClient adminClient = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {
            List<String> monitoredTopics = Arrays.asList(
                    "request_logs", "tenant_minute_analytics", "product_minute_analytics",
                    "service_minute_analytics", "endpoint_minute_analytics"
            );

            for (String topic : monitoredTopics) {
                int partitions = topic.equals("request_logs") ? 2 : 1;
                for (int p = 0; p < partitions; p++) {
                    totalMessagesSum += getLogEndOffset(adminClient, new TopicPartition(topic, p));
                }
            }
        } catch (Exception ignored) {}

        stats.put("totalMessages", totalMessagesSum);
        stats.put("avgLatencyMs", 3.5);
        return stats;
    }

    // Helper method with a strict 2-second timeout so it never hangs indefinitely
    private long getLogEndOffset(AdminClient adminClient, TopicPartition tp) {
        try {
            Map<TopicPartition, OffsetSpec> request = Collections.singletonMap(tp, OffsetSpec.latest());
            Map<TopicPartition, ListOffsetsResult.ListOffsetsResultInfo> result =
                    adminClient.listOffsets(request).all().get(2, TimeUnit.SECONDS);

            ListOffsetsResult.ListOffsetsResultInfo info = result.get(tp);
            return info != null ? info.offset() : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    // Helper method with a strict 2-second timeout
    private long getCommittedOffset(AdminClient adminClient, String groupId, TopicPartition tp) {
        try {
            Map<TopicPartition, OffsetAndMetadata> committed =
                    adminClient.listConsumerGroupOffsets(groupId)
                            .partitionsToOffsetAndMetadata()
                            .get(2, TimeUnit.SECONDS);

            OffsetAndMetadata metadata = committed.get(tp);
            return metadata != null ? metadata.offset() : -1L;
        } catch (Exception e) {
            return -1L;
        }
    }
}