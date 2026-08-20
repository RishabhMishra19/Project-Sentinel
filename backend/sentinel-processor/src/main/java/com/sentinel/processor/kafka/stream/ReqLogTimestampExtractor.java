package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class ReqLogTimestampExtractor implements TimestampExtractor {
    private final ObjectMapper objectMapper;

    @Override
    public long extract(ConsumerRecord<Object, Object> record, long partitionTime) {
        KafkaMessage.ReqLog reqLog = objectMapper.readValue((String) record.value(), KafkaMessage.ReqLog.class);
        return reqLog.occurredAt().toEpochMilli();
    }
}