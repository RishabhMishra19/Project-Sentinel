package com.sentinel.api.monitor.service.impl;

import com.sentinel.api.monitor.KafkaMonitorProperties;
import com.sentinel.api.monitor.dto.KafkaMonitor;
import com.sentinel.api.monitor.service.KafkaMonitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.TopicDescription;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaMonitorServiceImpl implements KafkaMonitorService {

    private final KafkaMonitorProperties properties;

    @Override
    public KafkaMonitor.MonitorResponse getKafkaMonitors() {
        try (AdminClient adminClient = AdminClient.create(Map.of(
                AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG,
                properties.bootstrapServers()
        ))) {
            Set<String> topicNames = adminClient.listTopics()
                    .names()
                    .get();
            Map<String, TopicDescription> descriptions = adminClient.describeTopics(topicNames)
                    .allTopicNames()
                    .get();
            List<KafkaMonitor.Topic> topics = topicNames.stream()
                    .map(name -> new KafkaMonitor.Topic(
                            name,
                            descriptions.get(name)
                                    .partitions()
                                    .size()
                    ))
                    .toList();
            return new KafkaMonitor.MonitorResponse(
                    "UP",
                    adminClient.describeCluster()
                            .nodes()
                            .get()
                            .size(),
                    topics
            );
        } catch (InterruptedException e) {
            Thread.currentThread()
                    .interrupt();
            log.error("Kafka monitoring interrupted", e);
            return new KafkaMonitor.MonitorResponse("DOWN", 0, List.of());
        } catch (Exception e) {
            log.error("Failed to monitor Kafka", e);
            return new KafkaMonitor.MonitorResponse("DOWN", 0, List.of());
        }
    }

}
