package com.sentinel.processor.kafka.stream;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Grouped;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.kstream.Suppressed;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AnalyticsStreamUtils {

    private static final String SENTINEL_LOGS_PREFIX = "SENTINEL_LOGS_PREFIX: ";
    private static final String KEY_SEPARATOR = "|";
    private static final String KEY_SEPARATOR_REGEX = "\\|";
    private final Logger log = LoggerFactory.getLogger(AnalyticsStreamUtils.class);
    private final ObjectMapper objectMapper;

    private final Map<AnalyticsBucket, TimeWindows> bucketToWindowMap = Map.ofEntries(
        Map.entry(AnalyticsBucket.MINUTE, TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofMinutes(1))),
        Map.entry(AnalyticsBucket.HOUR, TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1))),
        Map.entry(AnalyticsBucket.DAY, TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(1)))
    );
    private final TimestampExtractor reqLogTimestampExtractor = (record, previousTimeStamp) -> {
        KafkaMessage.ReqLog log = (KafkaMessage.ReqLog) record.value();
        if (log != null && log.occurredAt() != null) {
            return log.occurredAt().toEpochMilli();
        }
        if (previousTimeStamp >= 0) {
            return previousTimeStamp;
        }
        return record.timestamp();
    };
    private final TimestampExtractor analyticsTimestampExtractor = (record, previousTimeStamp) -> {
        KafkaMessage.AnalyticsMetrics metrics = (KafkaMessage.AnalyticsMetrics) record.value();
        if (metrics != null && metrics.getTimestamp() != null) {
            return metrics.getTimestamp().toEpochMilli();
        }
        if (previousTimeStamp >= 0) {
            return previousTimeStamp;
        }
        return record.timestamp();
    };
    public Serde<KafkaMessage.ReqLog> requestLogSerde = customSerde(KafkaMessage.ReqLog.class);
    public Serde<KafkaMessage.AnalyticsMetrics> analyticsMetricSerde = customSerde(KafkaMessage.AnalyticsMetrics.class);

    private <T> Serde<T> customSerde(Class<T> clazz) {
        Serializer<T> serializer = (topic, data) -> {
            if (data == null)
                return null;
            try {
                return objectMapper.writeValueAsBytes(data);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
        Deserializer<T> deserializer = (topic, data) -> {
            if (data == null || data.length == 0)
                return null;
            try {
                return objectMapper.readerFor(clazz).readValue(data);
            } catch (Exception e) {
                log.error(
                    "Kafka deserialization failed. topic={}, bytes={}, payload={}",
                    topic,
                    data.length,
                    new String(data, java.nio.charset.StandardCharsets.UTF_8),
                    e
                );
                throw new RuntimeException(e);
            }
        };
        return Serdes.serdeFrom(serializer, deserializer);
    }

    public KStream<String, KafkaMessage.ReqLog> getReqLogInputStream(StreamsBuilder streamsBuilder) {
        return streamsBuilder.stream(
            KafkaTopics.request_logs,
            Consumed.with(Serdes.String(), requestLogSerde).withTimestampExtractor(reqLogTimestampExtractor)
        ).peek((key, val) -> log.info("{}INPUT: topic={}, timestamp={}, entityId={}, key={}, , val={}, ", SENTINEL_LOGS_PREFIX,
            KafkaTopics.request_logs, val.occurredAt(), val.endpointId(), key, val));
    }

    public KStream<String, KafkaMessage.AnalyticsMetrics> getAnalyticsInputStream(StreamsBuilder streamsBuilder, String inputTopic) {
        return streamsBuilder.stream(inputTopic,
                Consumed.with(Serdes.String(), analyticsMetricSerde).withTimestampExtractor(analyticsTimestampExtractor))
            .peek((key, val) -> log.info("{}INPUT: topic={}, timestamp={}, entityId={}, key={}, val={}", SENTINEL_LOGS_PREFIX, inputTopic,
                val.getTimestamp(), val.getEntityId(), key, val));
    }

    public String getCompositeKey(KafkaMessage.ReqLog reqLog) {
        return reqLog.tenantId().toString() + KEY_SEPARATOR + reqLog.productId().toString() + KEY_SEPARATOR + reqLog.serviceId()
            .toString() + KEY_SEPARATOR + reqLog.endpointId()
            .toString();
    }

    public String removeLastIdFromCompositeKey(String compositeKey) {
        String[] keys = compositeKey.split(KEY_SEPARATOR_REGEX);
        return String.join(KEY_SEPARATOR, Arrays.stream(keys).toList().subList(0, keys.length - 1));
    }

    public UUID extractUUIDAtLastFromCompositeKey(String compositeKey) {
        String[] keys = compositeKey.split(KEY_SEPARATOR_REGEX);
        return UUID.fromString(keys[keys.length - 1]);
    }

    public void groupByKeyAndSendTimeWindowedAggregationToTopic(
        KStream<String, KafkaMessage.AnalyticsMetrics> stream,
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        String outputTopic
    ) {
        stream
            .peek(
                (key, value) -> log.info("{}Repartitioned: , timestamp={}, entityId={}, scope={}, bucket={}, key={}", SENTINEL_LOGS_PREFIX,
                    value.getTimestamp(), value.getEntityId(), value.getScope(), value.getBucket(), key))
            .groupByKey(Grouped.with(Serdes.String(), analyticsMetricSerde))
            .windowedBy(bucketToWindowMap.get(bucket))
            .aggregate(
                () -> new KafkaMessage.AnalyticsMetrics(bucket, scope, null),
                (key, value, aggregatedVal) -> aggregatedVal.aggregate(value),
                Materialized.<String, KafkaMessage.AnalyticsMetrics, WindowStore<Bytes, byte[]>>as(outputTopic + "_aggregated_state_store")
                    .withKeySerde(Serdes.String())
                    .withValueSerde(this.analyticsMetricSerde))
            .suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName(outputTopic + "_suppression"))
            .toStream()
            .peek((key, value) -> log.info("{}Output: topic={}, timestamp={}, entityId={}, key={}, value={}", SENTINEL_LOGS_PREFIX,
                outputTopic, value.getTimestamp(), value.getEntityId(), key, value))
            .map((windowedKey, val) -> KeyValue.pair(windowedKey.key(), val))
            .to(outputTopic, Produced.with(Serdes.String(), analyticsMetricSerde));

    }

}
