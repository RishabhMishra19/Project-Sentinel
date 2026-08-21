package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Grouped;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class MinuteAnalyticsStreamTopology {
    private final ObjectMapper objectMapper;
    private final ReqLogSerde reqLogSerde;
    private final AnalyticsSerde analyticsSerde;

    @Bean
    public KStream<String, String> tenantMinuteAnalyticsStream(StreamsBuilder builder, ReqLogTimestampExtractor reqLogTimestampExtractor) {
        KStream<String, String> input = builder.stream(KafkaTopics.request_logs,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(reqLogTimestampExtractor));
        KStream<String, KafkaMessage.ReqLog> requests = input.mapValues(value -> objectMapper.readValue(value,
                                                                                                        KafkaMessage.ReqLog.class));
        requests
                .selectKey((key, item) -> item.tenantId().toString())
                .groupByKey(
                        Grouped.with(
                                Serdes.String(),
                                reqLogSerde
                        )
                )
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                }, Materialized.with(
                        Serdes.String(),
                        analyticsSerde
                ))
                .toStream()
                .map((windowedKey, analytics) ->{
                    analytics.setId(UUID.fromString(windowedKey.key()));
                    analytics.setStartBucket(windowedKey.window().startTime());
                    return KeyValue.pair(
                            windowedKey.key(),
                            analytics
                    );
                 }
                )
                .mapValues(objectMapper::writeValueAsString)
                .to(KafkaTopics.tenant_minute_analytics);
        return input;
    }

    @Bean
    public KStream<String, String> productMinuteAnalyticsStream(StreamsBuilder builder, ReqLogTimestampExtractor reqLogTimestampExtractor) {
        KStream<String, String> input = builder.stream(KafkaTopics.request_logs,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(reqLogTimestampExtractor));
        KStream<String, KafkaMessage.ReqLog> requests = input.mapValues(value -> objectMapper.readValue(value,
                                                                                                        KafkaMessage.ReqLog.class));
        requests
                .selectKey((key, item) -> item.productId().toString())
                .groupByKey(
                        Grouped.with(
                                Serdes.String(),
                                reqLogSerde
                        )
                )
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                }, Materialized.with(
                        Serdes.String(),
                        analyticsSerde
                ))
                .toStream()
                .map((windowedKey, analytics) ->{
                         analytics.setId(UUID.fromString(windowedKey.key()));
                         analytics.setStartBucket(windowedKey.window().startTime());
                         return KeyValue.pair(
                                 windowedKey.key(),
                                 analytics
                         );
                     }
                ).mapValues(objectMapper::writeValueAsString)
                .to(KafkaTopics.product_minute_analytics);
        return input;
    }

    @Bean
    public KStream<String, String> serviceMinuteAnalyticsStream(StreamsBuilder builder, ReqLogTimestampExtractor reqLogTimestampExtractor) {
        KStream<String, String> input = builder.stream(KafkaTopics.request_logs,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(reqLogTimestampExtractor));
        KStream<String, KafkaMessage.ReqLog> requests = input.mapValues(value -> objectMapper.readValue(value,
                                                                                                        KafkaMessage.ReqLog.class));
        requests
                .selectKey((key, item) -> item.serviceId().toString())
                .groupByKey(
                        Grouped.with(
                                Serdes.String(),
                                reqLogSerde
                        )
                )
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                }, Materialized.with(
                        Serdes.String(),
                        analyticsSerde
                ))
                .toStream()
                .map((windowedKey, analytics) ->{
                         analytics.setId(UUID.fromString(windowedKey.key()));
                         analytics.setStartBucket(windowedKey.window().startTime());
                         return KeyValue.pair(
                                 windowedKey.key(),
                                 analytics
                         );
                     }
                ).mapValues(objectMapper::writeValueAsString)
                .to(KafkaTopics.service_minute_analytics);
        return input;
    }

    @Bean
    public KStream<String, String> endpointMinuteAnalyticsStream(StreamsBuilder builder, ReqLogTimestampExtractor reqLogTimestampExtractor) {
        KStream<String, String> input = builder.stream(KafkaTopics.request_logs,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(reqLogTimestampExtractor));
        KStream<String, KafkaMessage.ReqLog> requests = input.mapValues(value -> objectMapper.readValue(value,
                                                                                                        KafkaMessage.ReqLog.class));
        requests
                .selectKey((key, item) -> item.endpointId().toString())
                .groupByKey(
                        Grouped.with(
                                Serdes.String(),
                                reqLogSerde
                        )
                )
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                }, Materialized.with(
                        Serdes.String(),
                        analyticsSerde
                ))
                .toStream()
                .map((windowedKey, analytics) ->{
                         analytics.setId(UUID.fromString(windowedKey.key()));
                         analytics.setStartBucket(windowedKey.window().startTime());
                         return KeyValue.pair(
                                 windowedKey.key(),
                                 analytics
                         );
                     }
                ).mapValues(objectMapper::writeValueAsString)
                .to(KafkaTopics.endpoint_minute_analytics);
        return input;
    }
}