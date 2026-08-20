package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class AnalyticsTimestampExtractor implements TimestampExtractor {
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public long extract(ConsumerRecord<Object, Object> record, long partitionTime) {
        KafkaMessage.Analytics analytics = objectMapper.readValue((String) record.value(), KafkaMessage.Analytics.class);
        return analytics.getStartBucket().toEpochMilli();
    }
}