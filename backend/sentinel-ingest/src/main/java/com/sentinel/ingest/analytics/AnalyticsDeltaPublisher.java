package com.sentinel.ingest.analytics;

import com.sentinel.common.kafka.AnalyticsDeltaBatchMessage;
import com.sentinel.common.kafka.AnalyticsDeltaMessage;
import com.sentinel.ingest.metrics.IngestPipelineMetrics;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class AnalyticsDeltaPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;
    private final IngestPipelineMetrics metrics;

    public AnalyticsDeltaPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${sentinel.kafka.analytics-deltas-topic}") String topic,
            IngestPipelineMetrics metrics) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
        this.metrics = metrics;
    }

    /** Groups by serviceId and publishes one batch envelope per service (partition key = serviceId). */
    public void publish(List<AnalyticsDeltaMessage> deltas) {
        if (deltas.isEmpty()) {
            return;
        }
        Map<UUID, List<AnalyticsDeltaMessage>> byService = new HashMap<>();
        for (AnalyticsDeltaMessage delta : deltas) {
            byService.computeIfAbsent(delta.serviceId(), ignored -> new ArrayList<>()).add(delta);
        }
        int batches = 0;
        int deltaCount = 0;
        for (Map.Entry<UUID, List<AnalyticsDeltaMessage>> entry : byService.entrySet()) {
            AnalyticsDeltaBatchMessage batch = new AnalyticsDeltaBatchMessage(entry.getValue());
            String json = objectMapper.writeValueAsString(batch);
            kafkaTemplate.send(topic, entry.getKey().toString(), json);
            batches++;
            deltaCount += entry.getValue().size();
        }
        metrics.recordAnalyticsBatchesPublished(batches, deltaCount);
    }
}
