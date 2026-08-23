package com.sentinel.processor.kafka;

import lombok.AllArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.ConsumerGroupDescription;
import org.apache.kafka.clients.admin.ListOffsetsResult;
import org.apache.kafka.clients.admin.OffsetSpec;
import org.apache.kafka.clients.admin.TopicListing;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.springframework.kafka.config.StreamsBuilderFactoryBean;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/kafka-topology")
@AllArgsConstructor
public class KafkaTopologyController {

    private final KafkaAdmin kafkaAdmin;
    private final StreamsBuilderFactoryBean streamsBuilderFactoryBean;
    private final StreamMetricsCollector metricsCollector;
    // TODO: Change this to match your actual Spring Kafka Streams application.id
    private static final String CONSUMER_GROUP_ID = "sentinel-analytics";


    @GetMapping("/stats")
    public Map<String, Object> getStreamStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMessages", metricsCollector.getCount());
        stats.put("avgLatencyMs", metricsCollector.getAverageLatency());
        return stats;
    }

    @GetMapping
    public Map<String, Object> getTopology() throws Exception {
        Map<String, Object> topologyMap = new HashMap<>();
        List<Map<String, Object>> pipelines = new ArrayList<>();
        Map<String, Long> topicLag = new HashMap<>();
        Map<String, Long> topicOffsets = new HashMap<>();
        try (AdminClient client = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {
            Set<String> activeBrokerTopics = new HashSet<>();
            Collection<TopicListing> topics = client.listTopics()
                    .listings()
                    .get();
            for (TopicListing topic : topics) {
                activeBrokerTopics.add(topic.name());
            }
            // 1. Fetch latest end offsets for all active topics
            List<TopicPartition> partitions = new ArrayList<>();
            Map<String, org.apache.kafka.clients.admin.TopicDescription> descriptions = client.describeTopics(
                            activeBrokerTopics)
                    .allTopicNames()
                    .get();
            for (var entry : descriptions.entrySet()) {
                String topicName = entry.getKey();
                for (var partition : entry.getValue()
                        .partitions()) {
                    partitions.add(new TopicPartition(topicName, partition.partition()));
                }
            }
            if (!partitions.isEmpty()) {
                Map<TopicPartition, OffsetSpec> request = partitions.stream()
                        .collect(Collectors.toMap(tp -> tp, tp -> OffsetSpec.latest()));
                Map<TopicPartition, ListOffsetsResult.ListOffsetsResultInfo> endOffsets = client.listOffsets(request)
                        .all()
                        .get();
                Map<TopicPartition, Long> endOffsetMap = new HashMap<>();
                for (var entry : endOffsets.entrySet()) {
                    endOffsetMap.put(entry.getKey(),
                            entry.getValue()
                                    .offset()
                    );
                    String topic = entry.getKey()
                            .topic();
                    topicOffsets.put(topic,
                            topicOffsets.getOrDefault(topic, 0L) + entry.getValue()
                                    .offset()
                    );
                }
                // 2. Fetch consumer group committed offsets to compute actual lag
                try {
                    Map<String, ConsumerGroupDescription> groupDesc = client.describeConsumerGroups(List.of(
                                    CONSUMER_GROUP_ID))
                            .all()
                            .get();
                    if (groupDesc.containsKey(CONSUMER_GROUP_ID)) {
                        Map<TopicPartition, OffsetAndMetadata> committedOffsets = client.listConsumerGroupOffsets(
                                        CONSUMER_GROUP_ID)
                                .partitionsToOffsetAndMetadata()
                                .get();
                        for (var tp : partitions) {
                            long endOffset = endOffsetMap.getOrDefault(tp, 0L);
                            OffsetAndMetadata committed = committedOffsets.get(tp);
                            long committedOffset = (committed != null) ? committed.offset() : 0L;
                            long lag = Math.max(0, endOffset - committedOffset);
                            String topic = tp.topic();
                            topicLag.put(topic, topicLag.getOrDefault(topic, 0L) + lag);
                        }
                    }
                } catch (Exception e) {
                    // Consumer group might not be active yet, lag defaults to 0 or total offset
                }
            }
        } catch (Exception e) {
            // Fallback gracefully if Kafka cluster is unreachable
        }
        if (streamsBuilderFactoryBean != null && streamsBuilderFactoryBean.getTopology() != null) {
            org.apache.kafka.streams.Topology topology = streamsBuilderFactoryBean.getTopology();
            org.apache.kafka.streams.TopologyDescription description = topology.describe();
            for (org.apache.kafka.streams.TopologyDescription.Subtopology subtopology : description.subtopologies()) {
                for (org.apache.kafka.streams.TopologyDescription.Node node : subtopology.nodes()) {
                    if (node instanceof org.apache.kafka.streams.TopologyDescription.Source) {
                        org.apache.kafka.streams.TopologyDescription.Source sourceNode = (org.apache.kafka.streams.TopologyDescription.Source) node;
                        for (String topicName : sourceNode.topicSet()) {
                            if (topicName.startsWith("__") || topicName.contains("-changelog") || topicName.contains(
                                    "-repartition")) {
                                continue;
                            }
                            Map<String, Object> topicNode = new HashMap<>();
                            topicNode.put("topicName", topicName);
                            topicNode.put("currentOffset", topicOffsets.getOrDefault(topicName, 0L));
                            topicNode.put("consumerLag", topicLag.getOrDefault(topicName, 0L));
                            List<Map<String, Object>> childStreams = new ArrayList<>();
                            for (org.apache.kafka.streams.TopologyDescription.Node successor : sourceNode.successors()) {
                                childStreams.add(parseNodeRecursive(successor));
                            }
                            topicNode.put("childrenStreams", childStreams);
                            pipelines.add(topicNode);
                        }
                    }
                }
            }
        }
        topologyMap.put("topics", pipelines);
        return topologyMap;
    }

    private Map<String, Object> parseNodeRecursive(org.apache.kafka.streams.TopologyDescription.Node node) {
        Map<String, Object> nodeInfo = new HashMap<>();
        nodeInfo.put("streamName", node.name());
        List<Map<String, Object>> nextChildren = new ArrayList<>();
        for (org.apache.kafka.streams.TopologyDescription.Node successor : node.successors()) {
            nextChildren.add(parseNodeRecursive(successor));
        }
        nodeInfo.put("nextStreams", nextChildren);
        return nodeInfo;
    }

}