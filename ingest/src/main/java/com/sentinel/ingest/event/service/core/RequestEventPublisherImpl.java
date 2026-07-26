package com.sentinel.ingest.event.service.core;

import com.sentinel.common.kafka.RequestEventMessage;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class RequestEventPublisherImpl implements RequestEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public RequestEventPublisherImpl(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${sentinel.kafka.request-events-topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    @Override
    public void publish(List<RequestEventMessage> messages) {
        for (RequestEventMessage message : messages) {
            String json = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, message.serviceId().toString(), json);
        }
    }
}
