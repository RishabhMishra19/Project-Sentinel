package com.sentinel.processor.kafka.listener.product;

import com.sentinel.common.analytics.entity.product.AnalyticsProductStatsHour;
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
public class ProductHourAnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(ProductHourAnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;

    @KafkaListener(topics = KafkaTopics.product_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.product_hour_analytics+"_group")
    public void onProductHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<AnalyticsProductStatsHour> stats = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.Analytics analytics = objectMapper.readValue(record.value(), KafkaMessage.Analytics.class);
            analytics.calculateAndUpdateLatencyPercentiles(); stats.add(toProductStatsHour(analytics));
        }

        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            stats.forEach(batchOperations::insert);
            batchOperations.execute();
        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e); throw e;
        }
    }

    private AnalyticsProductStatsHour toProductStatsHour(KafkaMessage.Analytics analytics) {
        return new AnalyticsProductStatsHour(analytics.getMetrics(), analytics.getId(), analytics.getStartBucket());
    }
}