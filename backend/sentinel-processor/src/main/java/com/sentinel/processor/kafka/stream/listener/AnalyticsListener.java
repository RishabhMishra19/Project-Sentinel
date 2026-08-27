package com.sentinel.processor.kafka.stream.listener;

import com.sentinel.common.cassandra.CassandraBatchInsertUtil;
import com.sentinel.common.cassandra.analytics.entity.endpoint.AnalyticsEndpointStatsDay;
import com.sentinel.common.cassandra.analytics.entity.endpoint.AnalyticsEndpointStatsHour;
import com.sentinel.common.cassandra.analytics.entity.endpoint.AnalyticsEndpointStatsMinute;
import com.sentinel.common.cassandra.analytics.entity.product.AnalyticsProductStatsDay;
import com.sentinel.common.cassandra.analytics.entity.product.AnalyticsProductStatsHour;
import com.sentinel.common.cassandra.analytics.entity.product.AnalyticsProductStatsMinute;
import com.sentinel.common.cassandra.analytics.entity.service.AnalyticsServiceStatsDay;
import com.sentinel.common.cassandra.analytics.entity.service.AnalyticsServiceStatsHour;
import com.sentinel.common.cassandra.analytics.entity.service.AnalyticsServiceStatsMinute;
import com.sentinel.common.cassandra.analytics.entity.tenant.AnalyticsTenantStatsDay;
import com.sentinel.common.cassandra.analytics.entity.tenant.AnalyticsTenantStatsHour;
import com.sentinel.common.cassandra.analytics.entity.tenant.AnalyticsTenantStatsMinute;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class AnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(AnalyticsListener.class);
    private final ObjectMapper objectMapper;
    private final CassandraBatchInsertUtil cassandraBatchInsertUtil;

    @KafkaListener(topics = KafkaTopics.endpoint_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.endpoint_minute_analytics + "_group")
    public void onEndpointMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsMinute::new);
    }

        @KafkaListener(topics = KafkaTopics.endpoint_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.endpoint_hour_analytics + "_group")
    public void onEndpointHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsHour::new);
    }

        @KafkaListener(topics = KafkaTopics.endpoint_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.endpoint_day_analytics + "_group")
    public void onEndpointDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.service_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.service_minute_analytics + "_group")
    public void onServiceMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsMinute::new);
    }

        @KafkaListener(topics = KafkaTopics.service_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.service_hour_analytics + "_group")
    public void onServiceHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsHour::new);
    }

        @KafkaListener(topics = KafkaTopics.service_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.service_day_analytics + "_group")
    public void onServiceDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.product_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.product_minute_analytics + "_group")
    public void onProductMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsMinute::new);
    }

        @KafkaListener(topics = KafkaTopics.product_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.product_hour_analytics + "_group")
    public void onProductHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsHour::new);
    }

        @KafkaListener(topics = KafkaTopics.product_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.product_day_analytics + "_group")
    public void onProductDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.tenant_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.tenant_minute_analytics + "_group")
    public void onTenantMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsMinute::new);
    }

        @KafkaListener(topics = KafkaTopics.tenant_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.tenant_hour_analytics + "_group")
    public void onTenantHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsHour::new);
    }

        @KafkaListener(topics = KafkaTopics.tenant_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.tenant_day_analytics + "_group")
    public void onTenantDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsDay::new);
    }

    private <T> void storeInCassandra(List<ConsumerRecord<String, String>> records, Function<KafkaMessage.AnalyticsMetrics, T> mapper) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<T> analyticsTenantStats = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.AnalyticsMetrics analytics = objectMapper.readValue(record.value(), KafkaMessage.AnalyticsMetrics.class);
            analyticsTenantStats.add(mapper.apply(analytics));
        }
        try {
            cassandraBatchInsertUtil.insert(analyticsTenantStats);
        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e);
            throw e;
        }
    }

}
