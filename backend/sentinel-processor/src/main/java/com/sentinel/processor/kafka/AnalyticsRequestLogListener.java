package com.sentinel.processor.kafka;

import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.processor.analytics.AnalyticsProcessor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AnalyticsRequestLogListener {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsRequestLogListener.class);

    private final ObjectMapper objectMapper;
    private final AnalyticsProcessor analyticsProcessor;

    @KafkaListener(topics = "${sentinel.kafka.request-logs-topic}", groupId = "sentinel-analytics")
    public void onBatch(List<String> payloads) {
        if (payloads == null || payloads.isEmpty()) {
            return;
        } try {
            for (String payload : payloads) {
                RequestLogKafkaMessage message = objectMapper.readValue(payload, RequestLogKafkaMessage.class);
                analyticsProcessor.process(message.requestLogKafkaMessageItems());
            }

        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e); throw e; // IMPORTANT
        }
    }
}
