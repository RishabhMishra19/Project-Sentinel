package com.sentinel.worker.kafka;

import com.sentinel.common.kafka.RequestEventMessage;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class RequestEventListener {

    private static final Logger log = LoggerFactory.getLogger(RequestEventListener.class);

    private final ObjectMapper objectMapper;
    private final RequestEventProcessor requestEventProcessor;
    private final String topic;

    public RequestEventListener(
            ObjectMapper objectMapper,
            RequestEventProcessor requestEventProcessor,
            @Value("${sentinel.kafka.request-events-topic}") String topic) {
        this.objectMapper = objectMapper;
        this.requestEventProcessor = requestEventProcessor;
        this.topic = topic;
    }

    @KafkaListener(topics = "${sentinel.kafka.request-events-topic}", groupId = "sentinel-worker")
    public void onBatch(List<String> payloads) {
        if (payloads == null || payloads.isEmpty()) {
            return;
        }

        List<RequestEventMessage> messages = new ArrayList<>(payloads.size());
        for (String payload : payloads) {
            messages.add(objectMapper.readValue(payload, RequestEventMessage.class));
        }

        log.debug("Consumed {} messages from {}", messages.size(), topic);
        requestEventProcessor.process(messages);
    }
}
