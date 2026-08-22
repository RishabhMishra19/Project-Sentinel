package com.sentinel.processor.kafka.listener.service;

import com.sentinel.common.analytics.entity.service.AnalyticsServiceStatsHour;
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
public class ServiceHourAnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(ServiceHourAnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;

    @KafkaListener(topics = KafkaTopics.service_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.service_hour_analytics+"_group")
    public void onServiceHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<AnalyticsServiceStatsHour> stats = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.Analytics analytics = objectMapper.readValue(record.value(), KafkaMessage.Analytics.class);
            analytics.calculateAndUpdateLatencyPercentiles(); stats.add(toServiceStatsHour(analytics));
        }
        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            stats.forEach(batchOperations::insert);
            batchOperations.execute();
        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e); throw e;
        }
    }

    private AnalyticsServiceStatsHour toServiceStatsHour(KafkaMessage.Analytics analytics) {
        return new AnalyticsServiceStatsHour(analytics.getMetrics(), analytics.getId(), analytics.getStartBucket());
    }
}