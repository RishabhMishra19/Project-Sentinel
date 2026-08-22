package com.sentinel.processor.kafka.listener.product;

import com.sentinel.common.cassandra.analytics.entity.product.AnalyticsProductStatsMinute;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.cassandra.core.CassandraBatchOperations;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMinuteAnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(ProductMinuteAnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;

    @KafkaListener(topics = KafkaTopics.product_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.product_minute_analytics+"_group")
    public void onProductMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<AnalyticsProductStatsMinute> stats = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.Analytics analytics = objectMapper.readValue(record.value(), KafkaMessage.Analytics.class);
            analytics.calculateAndUpdateLatencyPercentiles(); stats.add(toProductStatsMinute(analytics));
        }
        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            stats.forEach(batchOperations::insert);
            batchOperations.execute();
        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e); throw e;
        }
    }

    private AnalyticsProductStatsMinute toProductStatsMinute(KafkaMessage.Analytics analytics) {
        return new AnalyticsProductStatsMinute(analytics.getMetrics(), analytics.getId(), analytics.getStartBucket());
    }
}