package com.sentinel.processor.kafka.listener.service;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsMinute;
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
public class ServiceMinuteAnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(ServiceMinuteAnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;

    @KafkaListener(topics = KafkaTopics.service_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.service_minute_analytics+"_group")
    public void onServiceMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<AnalyticsServiceStatsMinute> stats = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.Analytics analytics = objectMapper.readValue(record.value(), KafkaMessage.Analytics.class);
            analytics.calculateAndUpdateLatencyPercentiles(); stats.add(toServiceStatsMinute(analytics));
        }
        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            stats.forEach(batchOperations::insert);
            batchOperations.execute();
        } catch (Exception e) {
            log.error("Failed processing Kafka batch", e); throw e;
        }
    }

    private AnalyticsServiceStatsMinute toServiceStatsMinute(KafkaMessage.Analytics analytics) {
        return new AnalyticsServiceStatsMinute(analytics.getMetrics(), analytics.getId(), analytics.getStartBucket());
    }
}