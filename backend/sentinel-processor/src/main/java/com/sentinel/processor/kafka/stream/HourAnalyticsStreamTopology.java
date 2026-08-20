package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class HourAnalyticsStreamTopology {
    private final ObjectMapper objectMapper;

    @Bean
    public KStream<String, String> tenantHourAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.tenant_minute_analytics,
                                                       Consumed
                                                               .with(Serdes.String(), Serdes.String())
                                                               .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantHourAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantHourAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1)))
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
                .to(KafkaTopics.tenant_hour_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> productHourAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.product_minute_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantHourAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantHourAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1)))
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
                .to(KafkaTopics.product_hour_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> serviceHourAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.service_minute_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantHourAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantHourAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1)))
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
                .to(KafkaTopics.service_hour_analytics);

        return tenantInput;
    }

    @Bean
    public KStream<String, String> endpointHourAnalyticsStream(StreamsBuilder builder, AnalyticsTimestampExtractor analyticsTimestampExtractor){
        KStream<String, String> tenantInput = builder.stream(KafkaTopics.endpoint_minute_analytics,
                                                             Consumed
                                                                     .with(Serdes.String(), Serdes.String())
                                                                     .withTimestampExtractor(analyticsTimestampExtractor));
        KStream<String, KafkaMessage.Analytics> tenantHourAnalyticsStream = tenantInput.mapValues(value -> objectMapper.readValue(
                value,
                KafkaMessage.Analytics.class));

        tenantHourAnalyticsStream
                .selectKey((key, item) -> item.getId().toString())
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofHours(1), Duration.ofMinutes(1)))
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
                .to(KafkaTopics.endpoint_hour_analytics);

        return tenantInput;
    }

}
