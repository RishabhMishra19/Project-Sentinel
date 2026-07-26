package com.sentinel.worker.kafka;

import com.sentinel.common.kafka.AnalyticsDeltaBatchMessage;
import com.sentinel.common.kafka.AnalyticsDeltaMessage;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class AnalyticsDeltaListener {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsDeltaListener.class);

    private final ObjectMapper objectMapper;
    private final AnalyticsDeltaProcessor analyticsDeltaProcessor;
    private final String topic;

    public AnalyticsDeltaListener(
            ObjectMapper objectMapper,
            AnalyticsDeltaProcessor analyticsDeltaProcessor,
            @Value("${sentinel.kafka.analytics-deltas-topic}") String topic) {
        this.objectMapper = objectMapper;
        this.analyticsDeltaProcessor = analyticsDeltaProcessor;
        this.topic = topic;
    }

    @KafkaListener(
            topics = "${sentinel.kafka.analytics-deltas-topic}",
            groupId = "sentinel-analytics",
            concurrency = "1")
    public void onBatch(List<String> payloads) {
        if (payloads == null || payloads.isEmpty()) {
            return;
        }

        List<AnalyticsDeltaMessage> deltas = new ArrayList<>();
        for (String payload : payloads) {
            AnalyticsDeltaBatchMessage batch =
                    objectMapper.readValue(payload, AnalyticsDeltaBatchMessage.class);
            if (batch.deltas() != null && !batch.deltas().isEmpty()) {
                deltas.addAll(batch.deltas());
            }
        }

        if (deltas.isEmpty()) {
            return;
        }

        log.debug(
                "Consumed {} analytics batch envelope(s) ({} deltas) from {}",
                payloads.size(),
                deltas.size(),
                topic);
        analyticsDeltaProcessor.process(deltas);
    }
}
