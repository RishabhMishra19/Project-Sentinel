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
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.kstream.Suppressed;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.kstream.Windowed;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.apache.kafka.streams.state.WindowStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AnalyticsStreamUtils {

    private final Logger log = LoggerFactory.getLogger(AnalyticsStreamUtils.class);
    private final ObjectMapper objectMapper;
    private final StreamsMetrics streamsMetrics = new StreamsMetrics();

    private final Map<AnalyticsBucket, TimeWindows> bucketToWindowMap = Map.ofEntries(
        Map.entry(AnalyticsBucket.MINUTE, TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1))),
        Map.entry(AnalyticsBucket.HOUR, TimeWindows.ofSizeWithNoGrace(Duration.ofHours(1))),
        Map.entry(AnalyticsBucket.DAY, TimeWindows.ofSizeWithNoGrace(Duration.ofDays(1)))
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
        );
    }

    public KStream<String, KafkaMessage.AnalyticsMetrics> getAnalyticsInputStream(StreamsBuilder streamsBuilder, String inputTopic) {
        return streamsBuilder.stream(
            inputTopic,
            Consumed.with(Serdes.String(), analyticsMetricSerde).withTimestampExtractor(analyticsTimestampExtractor)
        );
    }

    public void groupByKeyAndSendTimeWindowedAggregationToTopic(
        KStream<String, KafkaMessage.AnalyticsMetrics> stream,
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        String outputTopic,
        Boolean withChangedScope
    ) {
        KTable<Windowed<String>, KafkaMessage.AnalyticsMetrics> kTable = stream
            .mapValues((key, val) -> {
                if (withChangedScope) {
                    val.setScope(scope);
                    val.setEntityId(KafkaMessage.AnalyticsKey.fromKey(key, objectMapper).getEntityId(scope));
                }

                val.setBucket(bucket);
                streamsMetrics.recordIncoming(outputTopic);
                return val;
            })
            .groupByKey(Grouped.with(Serdes.String(), analyticsMetricSerde))
            .windowedBy(bucketToWindowMap.get(bucket))
            .reduce(KafkaMessage.AnalyticsMetrics::aggregate,
                Materialized.<String, KafkaMessage.AnalyticsMetrics, WindowStore<Bytes, byte[]>>as(outputTopic + "_reduced_state_store")
                    .withKeySerde(Serdes.String())
                    .withValueSerde(this.analyticsMetricSerde));

        if (!withChangedScope) {
            kTable =
                kTable.suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName(outputTopic + "_suppression"));
        }

        kTable
            .toStream()
            .map((windowedKey, val) -> {
                val.setTimestamp(windowedKey.window().startTime());
                streamsMetrics.recordOutgoing(outputTopic, windowedKey.window().startTime(), val.getEntityId());
                String newKey = KafkaMessage.AnalyticsKey.fromKey(windowedKey.key(), objectMapper)
                    .removeIdForScope(scope).getBase64Str(objectMapper);
                return KeyValue.pair(newKey, val);
            })
            .to(outputTopic, Produced.with(Serdes.String(), analyticsMetricSerde));
    }

}
