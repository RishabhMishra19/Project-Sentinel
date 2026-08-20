package com.sentinel.processor.kafka.listener.tenant;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsDay;
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
public class TenantDayAnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(TenantDayAnalyticsListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;


    @KafkaListener(topics = KafkaTopics.tenant_day_analytics, containerFactory = "requestLogKafkaListenerContainerFactory")
    public void onTenantDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<AnalyticsTenantStatsDay> analyticsTenantStatsDays = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.Analytics analytics = objectMapper.readValue(record.value(), KafkaMessage.Analytics.class);
            analytics.calculateAndUpdateLatencyPercentiles();
            analyticsTenantStatsDays.add(this.toTenantStatsDay(analytics));
        }
        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            analyticsTenantStatsDays.forEach(batchOperations::insert);
            batchOperations.execute();
        }catch (Exception e) {
            log.error("Failed processing Kafka batch", e);
            throw e;
        }
    }

    private AnalyticsTenantStatsDay toTenantStatsDay(KafkaMessage.Analytics analytics) {
        return new  AnalyticsTenantStatsDay(analytics.getMetrics(), analytics.getId(), analytics.getStartBucket());
    }
}
