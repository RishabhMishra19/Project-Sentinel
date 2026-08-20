package com.sentinel.processor.kafka;

import com.sentinel.common.kafka.RequestLogKafkaMessage;
import java.util.ArrayList;
import java.util.List;

import com.sentinel.processor.logs.RequestLogWriteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class RequestLogListener {
    private static final Logger log = LoggerFactory.getLogger(RequestLogListener.class);

    private final ObjectMapper objectMapper;
    private final RequestLogWriteService  requestLogWriteService;

    @KafkaListener(topics = "${sentinel.kafka.request-logs-topic}", groupId = "sentinel-processor")
    public void onBatch(List<String> payloads) {
        if (payloads == null || payloads.isEmpty()) {
            return;
        }
        log.info("START batch: {}", payloads.size());
        List<RequestLogKafkaMessage> messages = new ArrayList<>();
        for (String payload : payloads) {
            messages.add(objectMapper.readValue(payload, RequestLogKafkaMessage.class));
        }
        try {
            requestLogWriteService.saveAll(messages);
        }catch (Exception e) {
            log.error("Failed processing Kafka batch", e);
            throw e; // IMPORTANT
        }
        log.info("END batch: {}", payloads.size());
    }
}
