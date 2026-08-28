package com.sentinel.processor.kafka.stream;

import com.sentinel.common.kafka.KafkaTopics;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
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

    public void recordOutgoing(String kafkaTopic, Instant windowStartTime, UUID entityId) {
        bucketToWindowsMap.get(kafkaTopic).totalOutgoingEvents.addAndGet(1L);
        log.info(this.getLog(kafkaTopic, windowStartTime, entityId));
    }

    public String getLog(String kafkaTopic, Instant windowStartTime, UUID entityId) {
        DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(ZoneOffset.UTC);

        return String.format("Streams: topic=%s, windowStartTime=%s, entityId=%s, totalIncomingCount=%s, totalOutgoingCount=%s", kafkaTopic,
            formatter.format(windowStartTime), entityId, bucketToWindowsMap.get(kafkaTopic).totalIncomingEvents.get(),
            bucketToWindowsMap.get(kafkaTopic).totalOutgoingEvents.get());
    }

}
