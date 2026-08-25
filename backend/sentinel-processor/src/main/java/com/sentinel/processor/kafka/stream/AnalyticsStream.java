package com.sentinel.processor.kafka.stream;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AnalyticsStream {

    private final AnalyticsStreamUtils analyticsStreamUtils;

    @Bean
    public KStream<String, KafkaMessage.AnalyticsMetrics> analyticsStreams(StreamsBuilder builder) {
        return buildTopology(builder);
    }

    public KStream<String, KafkaMessage.AnalyticsMetrics> buildTopology(StreamsBuilder builder) {
        //---------------------------------------------------------------------------------------
        //--------------------------------Minute Analytics Streams-------------------------------
        //---------------------------------------------------------------------------------------
        //1. reqLog to endpointMinuteAnalytics stream
        KStream<String, KafkaMessage.AnalyticsMetrics> rawEndpointAnalyticsStream = analyticsStreamUtils
                .getReqLogInputStream(builder)
                .map((key, val) -> KeyValue.pair(
                        analyticsStreamUtils.getCompositeKey(val),
                        new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.MINUTE, AnalyticsScope.ENDPOINT, val.endpointId()).initialize(val)
                ));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                rawEndpointAnalyticsStream,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.ENDPOINT,
                KafkaTopics.endpoint_minute_analytics
        );

        //2. endpointMinuteAnalytics to serviceMinuteAnalytics stream
        KStream<String, KafkaMessage.AnalyticsMetrics> serviceMinuteStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.endpoint_minute_analytics
        ).map((key, val) -> {
            String newCompositeKey = analyticsStreamUtils.removeLastIdFromCompositeKey(key);
            UUID newEntityId = analyticsStreamUtils.extractUUIDAtLastFromCompositeKey(newCompositeKey);
            return KeyValue.pair(newCompositeKey, new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.MINUTE, AnalyticsScope.SERVICE, newEntityId).initialize(val));
        });
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                serviceMinuteStream,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.SERVICE,
                KafkaTopics.service_minute_analytics
        );

        //3. serviceMinuteAnalytics to productMinuteAnalytics stream
        KStream<String, KafkaMessage.AnalyticsMetrics> productMinuteStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.service_minute_analytics
        ).map((key, val) -> {
            String newCompositeKey = analyticsStreamUtils.removeLastIdFromCompositeKey(key);
            UUID newEntityId = analyticsStreamUtils.extractUUIDAtLastFromCompositeKey(newCompositeKey);
            return KeyValue.pair(newCompositeKey, new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.MINUTE, AnalyticsScope.PRODUCT, newEntityId).initialize(val));
        });
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                productMinuteStream,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.PRODUCT,
                KafkaTopics.product_minute_analytics
        );

        //4. productMinuteAnalytics to tenantMinuteAnalytics stream
        KStream<String, KafkaMessage.AnalyticsMetrics> tenantMinuteStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.product_minute_analytics
        ).map((key, val) -> {
            String newCompositeKey = analyticsStreamUtils.removeLastIdFromCompositeKey(key);
            UUID newEntityId = analyticsStreamUtils.extractUUIDAtLastFromCompositeKey(newCompositeKey);
            return KeyValue.pair(newCompositeKey, new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.MINUTE, AnalyticsScope.TENANT, newEntityId).initialize(val));
        });
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                tenantMinuteStream,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.TENANT,
                KafkaTopics.tenant_minute_analytics
        );

        //---------------------------------------------------------------------------------------
        //--------------------------------Hour Analytics Streams-------------------------------
        //---------------------------------------------------------------------------------------
        //5. endpointMinuteAnalytics  to endpointHourAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> endpointHourStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.endpoint_minute_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.HOUR, AnalyticsScope.ENDPOINT, val.getEntityId()).initialize(val));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                endpointHourStream,
                AnalyticsBucket.HOUR,
                AnalyticsScope.ENDPOINT,
                KafkaTopics.endpoint_hour_analytics
        );

        //6. serviceMinuteAnalytics  to serviceHourAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> serviceHourStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.service_minute_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.HOUR, AnalyticsScope.SERVICE, val.getEntityId()).initialize(val));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                serviceHourStream,
                AnalyticsBucket.HOUR,
                AnalyticsScope.SERVICE,
                KafkaTopics.service_hour_analytics
        );

        //7. productMinuteAnalytics  to productHourAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> productHourStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.product_minute_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.HOUR, AnalyticsScope.PRODUCT, val.getEntityId()).initialize(val));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                productHourStream,
                AnalyticsBucket.HOUR,
                AnalyticsScope.PRODUCT,
                KafkaTopics.product_hour_analytics
        );

        //8. tenantMinuteAnalytics  to tenantHourAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> tenantHourStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.tenant_minute_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.HOUR, AnalyticsScope.TENANT, val.getEntityId()).initialize(val));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                tenantHourStream,
                AnalyticsBucket.HOUR,
                AnalyticsScope.TENANT,
                KafkaTopics.tenant_hour_analytics
        );

        //---------------------------------------------------------------------------------------
        //--------------------------------Day Analytics Streams-------------------------------
        //---------------------------------------------------------------------------------------
        //9. endpointHourAnalytics  to endpointDayAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> endpointDayStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.endpoint_hour_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.DAY, AnalyticsScope.ENDPOINT, val.getEntityId()).initialize(val));
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                endpointDayStream,
                AnalyticsBucket.DAY,
                AnalyticsScope.ENDPOINT,
                KafkaTopics.endpoint_day_analytics
        );

        //10. serviceHourAnalytics  to serviceDayAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> serviceDayStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.service_hour_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.DAY, AnalyticsScope.SERVICE, val.getEntityId()).initialize(val));;
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                serviceDayStream,
                AnalyticsBucket.DAY,
                AnalyticsScope.SERVICE,
                KafkaTopics.service_day_analytics
        );

        //11. productHourAnalytics  to productDayAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> productDayStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.product_hour_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.DAY, AnalyticsScope.PRODUCT, val.getEntityId()).initialize(val));;
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                productDayStream,
                AnalyticsBucket.DAY,
                AnalyticsScope.PRODUCT,
                KafkaTopics.product_day_analytics
        );

        //12. tenantHourAnalytics  to tenantDayAnalytics
        KStream<String, KafkaMessage.AnalyticsMetrics> tenantDayStream = analyticsStreamUtils.getAnalyticsInputStream(
                builder,
                KafkaTopics.tenant_hour_analytics
        ).mapValues(val-> new KafkaMessage.AnalyticsMetrics(AnalyticsBucket.DAY, AnalyticsScope.TENANT, val.getEntityId()).initialize(val));;
        analyticsStreamUtils.groupByKeyAndSendTimeWindowedAggregationToTopic(
                tenantDayStream,
                AnalyticsBucket.DAY,
                AnalyticsScope.TENANT,
                KafkaTopics.tenant_day_analytics
        );

        return rawEndpointAnalyticsStream;
    }

}
