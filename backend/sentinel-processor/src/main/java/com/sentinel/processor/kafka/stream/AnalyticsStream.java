package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.*;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.apache.kafka.streams.state.WindowStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AnalyticsStream {

    private static final TimeWindows minuteWindow = TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10));
    private static final TimeWindows hourWindow = TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1));
    private static final TimeWindows dayWindow = TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(5));
    private final Serde<KafkaMessage.ReqLog> reqLogSerde;
    private final Serde<KafkaMessage.AnalyticsMetrics> analyticsSerde;

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> endpointMinuteStream(
            StreamsBuilder builder,
            @Qualifier("reqLogTimestampExtractor") TimestampExtractor timestampExtractor
    ) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.request_logs,
                Consumed.with(Serdes.String(), reqLogSerde).withTimestampExtractor(timestampExtractor)
        ).mapValues(KafkaMessage.AnalyticsMetrics::from);
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.endpoint_minute_analytics, minuteWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> serviceMinuteStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.endpoint_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        ).mapValues(v -> {
            v.removeLastIdFromCompositeId();
            return v;
        });
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.service_minute_analytics, minuteWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> productMinuteStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.service_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        ).mapValues(v -> {
            v.removeLastIdFromCompositeId();
            return v;
        });
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.product_minute_analytics, minuteWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> tenantMinuteStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.product_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        ).mapValues(v -> {
            v.removeLastIdFromCompositeId();
            return v;
        });
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.tenant_minute_analytics, minuteWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> endpointHourStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.endpoint_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.endpoint_hour_analytics, hourWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> serviceHourStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.service_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.service_hour_analytics, hourWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> productHourStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.product_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.product_hour_analytics, hourWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> tenantHourStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.tenant_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.tenant_hour_analytics, hourWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> endpointDayStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.endpoint_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.endpoint_day_analytics, dayWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> serviceDayStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.service_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.service_day_analytics, dayWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> productDayStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.product_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.product_day_analytics, dayWindow);
        return metricsKStream;
    }

    @Bean
    KStream<String, KafkaMessage.AnalyticsMetrics> tenantDayStream(StreamsBuilder builder) {
        KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream = builder.stream(
                KafkaTopics.tenant_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        this.flushToDatabaseTopic(metricsKStream, KafkaTopics.tenant_day_analytics, dayWindow);
        return metricsKStream;
    }

    public void flushToDatabaseTopic(KStream<String, KafkaMessage.AnalyticsMetrics> metricsKStream, String targetTopic, TimeWindows minuteWindow) {
        KGroupedStream<String, KafkaMessage.AnalyticsMetrics> groupedStream = metricsKStream.selectKey((key, value) -> value.getCompositeIds())
                                                                                            .groupByKey(Grouped.with(
                                                                                                    Serdes.String(),
                                                                                                    analyticsSerde
                                                                                            ));
        TimeWindowedKStream<String, KafkaMessage.AnalyticsMetrics> minuteWindowedStream = groupedStream.windowedBy(minuteWindow);
        KStream<Windowed<String>, KafkaMessage.AnalyticsMetrics> aggregatedKStream = minuteWindowedStream.aggregate(
                KafkaMessage.AnalyticsMetrics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.aggregate(curValue),
                Materialized.<String, KafkaMessage.AnalyticsMetrics, WindowStore<Bytes, byte[]>>as(targetTopic + "_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName(targetTopic + "_window_suppress")).toStream();
        aggregatedKStream.map((windowedKey, val) -> {
            val.setBucketStart(windowedKey.window().startTime());
            return KeyValue.pair(windowedKey.key(), val);
        }).to(targetTopic, Produced.with(Serdes.String(), analyticsSerde));
    }

}
