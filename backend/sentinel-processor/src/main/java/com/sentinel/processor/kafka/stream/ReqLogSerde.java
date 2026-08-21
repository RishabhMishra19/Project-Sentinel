package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serializer;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@RequiredArgsConstructor
@Component
public class ReqLogSerde implements Serde<KafkaMessage.ReqLog> {

    private final ObjectMapper objectMapper;

    @Override
    public Serializer<KafkaMessage.ReqLog> serializer() {
        return (topic, data) -> objectMapper.writeValueAsBytes(data);
    }

    @Override
    public Deserializer<KafkaMessage.ReqLog> deserializer() {
        return (topic, data) ->
                objectMapper.readValue(data, KafkaMessage.ReqLog.class);
    }
}
