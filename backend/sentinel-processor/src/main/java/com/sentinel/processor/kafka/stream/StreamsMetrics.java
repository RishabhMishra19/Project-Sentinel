package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaTopics;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
public class StreamsMetrics {

    private static class MetricParams {
        private final AtomicLong totalIncomingEvents = new AtomicLong(0L);
        private final AtomicLong totalOutgoingEvents = new AtomicLong(0L);
    }

    public StreamsMetrics() {
        bucketToWindowsMap.put(KafkaTopics.endpoint_minute_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.endpoint_hour_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.endpoint_day_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.service_minute_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.service_hour_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.service_day_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.product_minute_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.product_hour_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.product_day_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.tenant_minute_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.tenant_hour_analytics, new MetricParams());
        bucketToWindowsMap.put(KafkaTopics.tenant_day_analytics, new MetricParams());
    }

    private final ConcurrentHashMap<String, MetricParams> bucketToWindowsMap = new ConcurrentHashMap<>();

    public void recordIncoming(String kafkaTopic) {
        bucketToWindowsMap.get(kafkaTopic).totalIncomingEvents.addAndGet(1L);
    }

    public void recordOutgoing(String kafkaTopic) {
        bucketToWindowsMap.get(kafkaTopic).totalOutgoingEvents.addAndGet(1L);
        log.info(this.getLog(kafkaTopic));
    }

    public String getLog(String kafkaTopic) {
        return String.format("Streams: topic=%s, totalIncomingCount=%s, totalOutgoingCount=%s", kafkaTopic,
            bucketToWindowsMap.get(kafkaTopic).totalIncomingEvents.get(), bucketToWindowsMap.get(kafkaTopic).totalOutgoingEvents.get());
    }

}
