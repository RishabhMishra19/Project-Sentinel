package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serializer;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class AnalyticsSerde implements Serde<KafkaMessage.Analytics> {

    private final ObjectMapper objectMapper;

    @Override
    public Serializer<KafkaMessage.Analytics> serializer() {
        return (topic, data) ->
                objectMapper.writeValueAsBytes(data);
    }

    @Override
    public Deserializer<KafkaMessage.Analytics> deserializer() {
        return (topic, data) ->
                objectMapper.readValue(data, KafkaMessage.Analytics.class);
    }
}