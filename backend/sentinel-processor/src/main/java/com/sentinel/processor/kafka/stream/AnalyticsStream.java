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
import java.util.UUID;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AnalyticsStream {

    private static final TimeWindows minuteWindow = TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10));
    private static final TimeWindows hourWindow = TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1));
    private static final TimeWindows dayWindow = TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(5));
    private final Serde<KafkaMessage.ReqLog> reqLogSerde;
    private final Serde<KafkaMessage.Analytics> analyticsSerde;

    @Bean
    KStream<String, KafkaMessage.ReqLog> kafkaStream(
            StreamsBuilder builder,
            @Qualifier("reqLogTimestampExtractor") TimestampExtractor timestampExtractor
    ) {
        //-------------------------------MINUTE BUCKET------------------------------------
        // 1.
        //Endpoint Minute Bucket
        KStream<String, KafkaMessage.ReqLog> rawRequests = builder.stream(
                KafkaTopics.request_logs,
                Consumed.with(Serdes.String(), reqLogSerde).withTimestampExtractor(timestampExtractor)
        );
        KGroupedStream<String, KafkaMessage.ReqLog> groupedStreamEndpoint1M = rawRequests.selectKey((key, value) -> String.format(
                "%s|%s|%s|%s",
                value.tenantId(),
                value.productId(),
                value.serviceId(),
                value.endpointId()
        )).groupByKey(Grouped.with(Serdes.String(), reqLogSerde));
        TimeWindowedKStream<String, KafkaMessage.ReqLog> minuteWindowedStreamEndpoint1M = groupedStreamEndpoint1M.windowedBy(minuteWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamEndpoint1M = minuteWindowedStreamEndpoint1M.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[3])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("endpoint_minute_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("endpoint_minute_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamEndpoint1M, KafkaTopics.endpoint_minute_analytics);
        // 2.
        //Service Minute Bucket
        KStream<String, KafkaMessage.Analytics> endpoint1M = builder.stream(
                KafkaTopics.endpoint_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamService1M = endpoint1M.selectKey((compositeKey, value) -> {
            String[] ids = compositeKey.split("\\|");
            return String.format("%s|%s|%s", ids[0], ids[1], ids[2]);
        }).groupByKey(Grouped.with(Serdes.String(), analyticsSerde));
        TimeWindowedKStream<String, KafkaMessage.Analytics> minuteWindowedStreamService1M = groupedStreamService1M.windowedBy(minuteWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamService1M = minuteWindowedStreamService1M.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[2])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("service_minute_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("service_minute_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamService1M, KafkaTopics.service_minute_analytics);
        // 3.
        //Product Minute Bucket
        KStream<String, KafkaMessage.Analytics> service1M = builder.stream(
                KafkaTopics.service_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamProduct1M = service1M.selectKey((compositeKey, value) -> {
            String[] ids = compositeKey.split("\\|");
            return String.format("%s|%s", ids[0], ids[1]);
        }).groupByKey(Grouped.with(Serdes.String(), analyticsSerde));
        TimeWindowedKStream<String, KafkaMessage.Analytics> minuteWindowedStreamProduct1M = groupedStreamProduct1M.windowedBy(minuteWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamProduct1M = minuteWindowedStreamProduct1M.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[1])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("product_minute_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("product_minute_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamProduct1M, KafkaTopics.product_minute_analytics);
        // 4.
        //Tenant Minute Bucket
        KStream<String, KafkaMessage.Analytics> product1M = builder.stream(
                KafkaTopics.product_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamTenant1M = product1M.selectKey((compositeKey, value) -> {
            String[] ids = compositeKey.split("\\|");
            return String.format("%s", ids[0]);
        }).groupByKey(Grouped.with(Serdes.String(), analyticsSerde));
        TimeWindowedKStream<String, KafkaMessage.Analytics> minuteWindowedStreamTenant1M = groupedStreamTenant1M.windowedBy(minuteWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamTenant1M = minuteWindowedStreamTenant1M.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[0])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("tenant_minute_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("tenant_minute_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamTenant1M, KafkaTopics.tenant_minute_analytics);
        //-------------------------------HOUR BUCKET------------------------------------
        // 5.
        //Endpoint Hour Bucket
        KStream<String, KafkaMessage.Analytics> endpointMinuteAnalytics = builder.stream(
                KafkaTopics.endpoint_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamEndpoint1H = endpointMinuteAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> hourWindowedStreamEndpoint1H = groupedStreamEndpoint1H.windowedBy(hourWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamEndpoint1H = hourWindowedStreamEndpoint1H.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[3])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("endpoint_hour_window_point")
                            .withKeySerde(Serdes.String()).withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("endpoint_hour_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamEndpoint1H, KafkaTopics.endpoint_hour_analytics);
        // 6.
        //Service Hour Bucket
        KStream<String, KafkaMessage.Analytics> serviceMinuteAnalytics = builder.stream(
                KafkaTopics.service_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamService1H = serviceMinuteAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> hourWindowedStreamService1H = groupedStreamService1H.windowedBy(hourWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamService1H = hourWindowedStreamService1H.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[2])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("service_hour_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("service_hour_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamService1H, KafkaTopics.service_hour_analytics);
        // 7.
        //Product Hour Bucket
        KStream<String, KafkaMessage.Analytics> productMinuteAnalytics = builder.stream(
                KafkaTopics.product_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamProduct1H = productMinuteAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> hourWindowedStreamProduct1H = groupedStreamProduct1H.windowedBy(hourWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamProduct1H = hourWindowedStreamProduct1H.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[1])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("product_hour_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("product_hour_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamProduct1H, KafkaTopics.product_hour_analytics);
        // 8.
        //Tenant Hour Bucket
        KStream<String, KafkaMessage.Analytics> tenantMinuteAnalytics = builder.stream(
                KafkaTopics.tenant_minute_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamTenant1H = tenantMinuteAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> hourWindowedStreamTenant1H = groupedStreamTenant1H.windowedBy(hourWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamTenant1H = hourWindowedStreamTenant1H.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[0])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("tenant_hour_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("tenant_hour_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamTenant1H, KafkaTopics.tenant_hour_analytics);
        //-------------------------------DAY BUCKET------------------------------------
        // 9.
        //Endpoint Day Bucket
        KStream<String, KafkaMessage.Analytics> endpointHourAnalytics = builder.stream(
                KafkaTopics.endpoint_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamEndpoint1D = endpointHourAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> dayWindowedStreamEndpoint1D = groupedStreamEndpoint1D.windowedBy(dayWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamEndpoint1D = dayWindowedStreamEndpoint1D.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[3])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("endpoint_day_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("endpoint_day_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamEndpoint1D, KafkaTopics.endpoint_day_analytics);
        // 10.
        //Service Day Bucket
        KStream<String, KafkaMessage.Analytics> serviceHourAnalytics = builder.stream(
                KafkaTopics.service_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamService1D = serviceHourAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> dayWindowedStreamService1D = groupedStreamService1D.windowedBy(dayWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamService1D = dayWindowedStreamService1D.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[2])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("service_day_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("service_day_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamService1D, KafkaTopics.service_day_analytics);
        // 11.
        //Product Day Bucket
        KStream<String, KafkaMessage.Analytics> productHourAnalytics = builder.stream(
                KafkaTopics.product_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamProduct1D = productHourAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> dayWindowedStreamProduct1D = groupedStreamProduct1D.windowedBy(dayWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamProduct1D = dayWindowedStreamProduct1D.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[1])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("product_day_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("product_day_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamProduct1D, KafkaTopics.product_day_analytics);
        // 12.
        //Tenant Day Bucket
        KStream<String, KafkaMessage.Analytics> tenantHourAnalytics = builder.stream(
                KafkaTopics.tenant_hour_analytics,
                Consumed.with(Serdes.String(), analyticsSerde)
        );
        KGroupedStream<String, KafkaMessage.Analytics> groupedStreamTenant1D = tenantHourAnalytics.groupByKey(Grouped.with(
                Serdes.String(),
                analyticsSerde
        ));
        TimeWindowedKStream<String, KafkaMessage.Analytics> dayWindowedStreamTenant1D = groupedStreamTenant1D.windowedBy(dayWindow);
        KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStreamTenant1D = dayWindowedStreamTenant1D.aggregate(
                KafkaMessage.Analytics::new,
                (curKey, curValue, aggregatedState) -> aggregatedState.accumulate(curValue, UUID.fromString(curKey.split("\\|")[0])),
                Materialized.<String, KafkaMessage.Analytics, WindowStore<Bytes, byte[]>>as("tenant_day_window_point").withKeySerde(Serdes.String())
                            .withValueSerde(analyticsSerde)
        ).suppress(Suppressed.untilWindowCloses(Suppressed.BufferConfig.unbounded()).withName("tenant_day_window_suppress")).toStream();
        this.flushToDatabaseTopic(aggregatedKStreamTenant1D, KafkaTopics.tenant_day_analytics);
        return rawRequests;
    }

    public void flushToDatabaseTopic(KStream<Windowed<String>, KafkaMessage.Analytics> aggregatedKStream, String targetTopic) {
        aggregatedKStream.map((windowedKey, val) -> KeyValue.pair(windowedKey.key(), val)).to(
                targetTopic,
                Produced.with(Serdes.String(), analyticsSerde)
        );
    }

}
