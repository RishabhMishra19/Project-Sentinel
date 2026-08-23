package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaProperties;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafkaStreams
@RequiredArgsConstructor
public class KafkaStreamsConfig {

    private final KafkaProperties kafkaProperties;

    @Bean
    public KafkaStreamsConfiguration defaultKafkaStreamsConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.bootstrapServers());
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "sentinel-analytics");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.ENSURE_EXPLICIT_INTERNAL_RESOURCE_NAMING_CONFIG, true);
        props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);
        props.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 3000);
        return new KafkaStreamsConfiguration(props);
    }

    private <T> Serde<T> customSerde(ObjectMapper objectMapper, Class<T> clazz) {
        Serializer<T> serializer = (topic, data) -> {
            if (data == null) return null;
            try {return objectMapper.writeValueAsBytes(data);} catch (Exception e) {throw new RuntimeException(e);}
        };
        Deserializer<T> deserializer = (topic, data) -> {
            if (data == null || data.length == 0) return null;
            try {return objectMapper.readerFor(clazz).readValue(data);} catch (Exception e) {throw new RuntimeException(e);}
        };
        return Serdes.serdeFrom(serializer, deserializer);
    }

    @Bean
    public Serde<KafkaMessage.ReqLog> reqLogSerde(ObjectMapper objectMapper) {
        return customSerde(objectMapper, KafkaMessage.ReqLog.class);
    }

    @Bean
    public Serde<KafkaMessage.AnalyticsMetrics> analyticsSerde(ObjectMapper objectMapper) {
        return customSerde(objectMapper, KafkaMessage.AnalyticsMetrics.class);
    }

    @Bean
    public TimestampExtractor reqLogTimestampExtractor() {
        return (record, previousTimeStamp) -> {
            KafkaMessage.ReqLog log = (KafkaMessage.ReqLog) record.value();
            if (log != null && log.occurredAt() != null) {
                return log.occurredAt().toEpochMilli();
            }
            if (previousTimeStamp >= 0) {
                return previousTimeStamp;
            }
            return record.timestamp();
        };
    }

}