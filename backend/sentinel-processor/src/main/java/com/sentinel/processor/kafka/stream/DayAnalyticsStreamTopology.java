package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class DayAnalyticsStreamTopology {
    private final ObjectMapper objectMapper;

    @Bean
    public KStream<String, String> tenantDayAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.tenant_hour_analytics,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantDayAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantDayAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                })
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
                .to(KafkaTopics.tenant_day_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> productDayAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.product_hour_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantDayAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantDayAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                })
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
                .to(KafkaTopics.product_day_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> serviceDayAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.service_hour_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantDayAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantDayAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                })
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
                .to(KafkaTopics.service_day_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> endpointDayAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.endpoint_hour_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantDayAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantDayAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofDays(1), Duration.ofMinutes(10)))
                .aggregate(KafkaMessage.Analytics::new, (tenantId, reqLog, analyticsKafkaMessage) -> {
                    analyticsKafkaMessage.accumulate(reqLog);
                    return analyticsKafkaMessage;
                })
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
                .to(KafkaTopics.endpoint_day_analytics);

        return tenantInput;
    }

}
