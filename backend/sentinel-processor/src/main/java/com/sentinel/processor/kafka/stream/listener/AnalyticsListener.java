package com.sentinel.processor.kafka.stream.listener;

import com.sentinel.common.cassandra.CassandraBatchInsertUtil;
import com.sentinel.common.cassandra.CassandraTables;
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
import com.sentinel.processor.monitor.ListenerMetrics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class AnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(AnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraBatchInsertUtil cassandraBatchInsertUtil;
    private final ListenerMetrics listenerMetrics;

    @KafkaListener(topics = KafkaTopics.endpoint_minute_analytics, groupId = KafkaTopics.endpoint_minute_analytics + "_group")
    public void onEndpointMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.endpoint_minute_analytics, CassandraTables.analytics_endpoint_stats_minute, records,
            AnalyticsEndpointStatsMinute::new);
    }

    @KafkaListener(topics = KafkaTopics.endpoint_hour_analytics, groupId = KafkaTopics.endpoint_hour_analytics + "_group")
    public void onEndpointHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.endpoint_hour_analytics, CassandraTables.analytics_endpoint_stats_hour, records,
            AnalyticsEndpointStatsHour::new);
    }

    @KafkaListener(topics = KafkaTopics.endpoint_day_analytics, groupId = KafkaTopics.endpoint_day_analytics + "_group")
    public void onEndpointDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.endpoint_day_analytics, CassandraTables.analytics_endpoint_stats_day, records,
            AnalyticsEndpointStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.service_minute_analytics, groupId = KafkaTopics.service_minute_analytics + "_group")
    public void onServiceMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.service_minute_analytics, CassandraTables.analytics_service_stats_minute, records,
            AnalyticsServiceStatsMinute::new);
    }

    @KafkaListener(topics = KafkaTopics.service_hour_analytics, groupId = KafkaTopics.service_hour_analytics + "_group")
    public void onServiceHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.service_hour_analytics, CassandraTables.analytics_service_stats_hour, records,
            AnalyticsServiceStatsHour::new);
    }

    @KafkaListener(topics = KafkaTopics.service_day_analytics, groupId = KafkaTopics.service_day_analytics + "_group")
    public void onServiceDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.service_day_analytics, CassandraTables.analytics_service_stats_day, records,
            AnalyticsServiceStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.product_minute_analytics, groupId = KafkaTopics.product_minute_analytics + "_group")
    public void onProductMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.product_minute_analytics, CassandraTables.analytics_product_stats_minute, records,
            AnalyticsProductStatsMinute::new);
    }

    @KafkaListener(topics = KafkaTopics.product_hour_analytics, groupId = KafkaTopics.product_hour_analytics + "_group")
    public void onProductHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.product_hour_analytics, CassandraTables.analytics_product_stats_hour, records,
            AnalyticsProductStatsHour::new);
    }

    @KafkaListener(topics = KafkaTopics.product_day_analytics, groupId = KafkaTopics.product_day_analytics + "_group")
    public void onProductDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.product_day_analytics, CassandraTables.analytics_product_stats_day, records,
            AnalyticsProductStatsDay::new);
    }

    @KafkaListener(topics = KafkaTopics.tenant_minute_analytics, groupId = KafkaTopics.tenant_minute_analytics + "_group")
    public void onTenantMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.tenant_minute_analytics, CassandraTables.analytics_tenant_stats_minute, records,
            AnalyticsTenantStatsMinute::new);
    }

    @KafkaListener(topics = KafkaTopics.tenant_hour_analytics, groupId = KafkaTopics.tenant_hour_analytics + "_group")
    public void onTenantHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.tenant_hour_analytics, CassandraTables.analytics_tenant_stats_hour, records,
            AnalyticsTenantStatsHour::new);
    }

    @KafkaListener(topics = KafkaTopics.tenant_day_analytics, groupId = KafkaTopics.tenant_day_analytics + "_group")
    public void onTenantDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(KafkaTopics.tenant_day_analytics, CassandraTables.analytics_tenant_stats_day, records,
            AnalyticsTenantStatsDay::new);
    }

    private <T> void storeInCassandra(String topic, String tableName, List<ConsumerRecord<String, String>> records,
        Function<KafkaMessage.AnalyticsMetrics, T> mapper) {
        if (records == null || records.isEmpty()) {
            return;
        }

        listenerMetrics.recordProcessing(topic, records.size(), () -> {
            List<T> analyticsStats = new ArrayList<>(records.size());
            for (ConsumerRecord<String, String> record : records) {
                KafkaMessage.AnalyticsMetrics analytics = objectMapper.readValue(record.value(), KafkaMessage.AnalyticsMetrics.class);
                analyticsStats.add(mapper.apply(analytics));
            }
            // 1. Trigger the async insert and hold onto the future
            CompletableFuture<CassandraBatchInsertUtil.BatchInsertResult> insertFuture =
                cassandraBatchInsertUtil.insertAsync(analyticsStats);
            // 2. Block the Kafka consumer thread until the Cassandra write completes successfully
            CassandraBatchInsertUtil.BatchInsertResult analyticsResult = insertFuture.join();
            listenerMetrics.recordCassandra(tableName, analyticsResult);
        });

    }

}
