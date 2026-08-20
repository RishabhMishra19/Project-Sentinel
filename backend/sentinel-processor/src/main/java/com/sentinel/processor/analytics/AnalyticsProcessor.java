package com.sentinel.processor.analytics;

import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.processor.analytics.dto.AnalyticsAccumulatorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsProcessor {

    private final CassandraTemplate cassandraTemplate;
    private final MinutesAnalyticsAccumulator minutesAnalyticsAccumulator;
    private final ConcurrentHashMap<Long, ConcurrentLinkedQueue<RequestLogKafkaMessage.RequestLogKafkaMessageItem>> map = new ConcurrentHashMap<>();

    public void process(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> requestLogKafkaMessageItems) {
        for (RequestLogKafkaMessage.RequestLogKafkaMessageItem item : requestLogKafkaMessageItems) {
            Long minuteBucket = item.occurredAt().truncatedTo(ChronoUnit.MINUTES).toEpochMilli();
            map.putIfAbsent(minuteBucket, new ConcurrentLinkedQueue<>()); map.get(minuteBucket).add(item);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void flush() {
        for (Long minuteBucket : map.keySet()) {
            if (minuteBucket < Instant.now().truncatedTo(ChronoUnit.MINUTES).toEpochMilli()) {
                ConcurrentLinkedQueue<RequestLogKafkaMessage.RequestLogKafkaMessageItem> queue = map.remove(minuteBucket);
                List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items = new ArrayList<>(queue);
                AnalyticsAccumulatorResponse response = minutesAnalyticsAccumulator.accumulate(items,
                                                                                               Instant.ofEpochMilli(
                                                                                                       minuteBucket));
                try {
                    response.getTenantMinuteStats().forEach(cassandraTemplate::insert);
                    response.getProductMinuteStats().forEach(cassandraTemplate::insert);
                    response.getServiceMinuteStats().forEach(cassandraTemplate::insert);
                    response.getEndpointMinuteStats().forEach(cassandraTemplate::insert);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                    map.computeIfAbsent(minuteBucket, k -> new ConcurrentLinkedQueue<>()).addAll(items);
                }
            }
        }
    }
}
