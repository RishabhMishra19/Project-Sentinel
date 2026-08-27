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
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

@Component
public class AnalyticsListener {
    private static final Logger log = LoggerFactory.getLogger(AnalyticsListener.class);
    private static final long LOG_INTERVAL_NANOS = TimeUnit.SECONDS.toNanos(1);

    private final ObjectMapper objectMapper;
    private final CassandraBatchInsertUtil cassandraBatchInsertUtil;

    private final AnalyticsMetrics endpointMinuteMetrics;
    private final AnalyticsMetrics endpointHourMetrics;
    private final AnalyticsMetrics endpointDayMetrics;
    private final AnalyticsMetrics serviceMinuteMetrics;
    private final AnalyticsMetrics serviceHourMetrics;
    private final AnalyticsMetrics serviceDayMetrics;
    private final AnalyticsMetrics productMinuteMetrics;
    private final AnalyticsMetrics productHourMetrics;
    private final AnalyticsMetrics productDayMetrics;
    private final AnalyticsMetrics tenantMinuteMetrics;
    private final AnalyticsMetrics tenantHourMetrics;
    private final AnalyticsMetrics tenantDayMetrics;

    public AnalyticsListener(
        ObjectMapper objectMapper,
        CassandraBatchInsertUtil cassandraBatchInsertUtil,
        MeterRegistry meterRegistry
    ) {
        this.objectMapper = objectMapper;
        this.cassandraBatchInsertUtil = cassandraBatchInsertUtil;

        this.endpointMinuteMetrics = buildMetrics(meterRegistry, "endpoint-minute");
        this.endpointHourMetrics = buildMetrics(meterRegistry, "endpoint-hour");
        this.endpointDayMetrics = buildMetrics(meterRegistry, "endpoint-day");

        this.serviceMinuteMetrics = buildMetrics(meterRegistry, "service-minute");
        this.serviceHourMetrics = buildMetrics(meterRegistry, "service-hour");
        this.serviceDayMetrics = buildMetrics(meterRegistry, "service-day");

        this.productMinuteMetrics = buildMetrics(meterRegistry, "product-minute");
        this.productHourMetrics = buildMetrics(meterRegistry, "product-hour");
        this.productDayMetrics = buildMetrics(meterRegistry, "product-day");

        this.tenantMinuteMetrics = buildMetrics(meterRegistry, "tenant-minute");
        this.tenantHourMetrics = buildMetrics(meterRegistry, "tenant-hour");
        this.tenantDayMetrics = buildMetrics(meterRegistry, "tenant-day");
    }

    private AnalyticsMetrics buildMetrics(MeterRegistry meterRegistry, String name) {
        return new AnalyticsMetrics(
            new AtomicLong(0),
            new AtomicLong(0),
            new AtomicLong(0),
            new AtomicLong(0),
            new AtomicLong(System.nanoTime()),
            new AtomicLong(0),
            new AtomicLong(0),
            Timer.builder("sentinel.processor.analytics." + name + ".deserialization")
                .publishPercentiles(0.5, 0.95, 0.99)
                .publishPercentileHistogram()
                .register(meterRegistry),
            Timer.builder("sentinel.processor.analytics." + name + ".insert")
                .publishPercentiles(0.5, 0.95, 0.99)
                .publishPercentileHistogram()
                .register(meterRegistry)
        );
    }

    @KafkaListener(topics = KafkaTopics.endpoint_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.endpoint_minute_analytics + "_group")
    public void onEndpointMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsMinute::new, endpointMinuteMetrics);
    }

    @KafkaListener(topics = KafkaTopics.endpoint_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.endpoint_hour_analytics + "_group")
    public void onEndpointHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsHour::new, endpointHourMetrics);
    }

    @KafkaListener(topics = KafkaTopics.endpoint_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.endpoint_day_analytics + "_group")
    public void onEndpointDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsEndpointStatsDay::new, endpointDayMetrics);
    }

    @KafkaListener(topics = KafkaTopics.service_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.service_minute_analytics + "_group")
    public void onServiceMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsMinute::new, serviceMinuteMetrics);
    }

    @KafkaListener(topics = KafkaTopics.service_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.service_hour_analytics + "_group")
    public void onServiceHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsHour::new, serviceHourMetrics);
    }

    @KafkaListener(topics = KafkaTopics.service_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.service_day_analytics + "_group")
    public void onServiceDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsServiceStatsDay::new, serviceDayMetrics);
    }

    @KafkaListener(topics = KafkaTopics.product_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.product_minute_analytics + "_group")
    public void onProductMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsMinute::new, productMinuteMetrics);
    }

    @KafkaListener(topics = KafkaTopics.product_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.product_hour_analytics + "_group")
    public void onProductHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsHour::new, productHourMetrics);
    }

    @KafkaListener(topics = KafkaTopics.product_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.product_day_analytics + "_group")
    public void onProductDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsProductStatsDay::new, productDayMetrics);
    }

    @KafkaListener(topics = KafkaTopics.tenant_minute_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.tenant_minute_analytics + "_group")
    public void onTenantMinuteAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsMinute::new, tenantMinuteMetrics);
    }

    @KafkaListener(topics = KafkaTopics.tenant_hour_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.tenant_hour_analytics + "_group")
    public void onTenantHourAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsHour::new, tenantHourMetrics);
    }

    @KafkaListener(topics = KafkaTopics.tenant_day_analytics, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.tenant_day_analytics + "_group")
    public void onTenantDayAnalyticsBatch(List<ConsumerRecord<String, String>> records) {
        this.storeInCassandra(records, AnalyticsTenantStatsDay::new, tenantDayMetrics);
    }

    private <T> void storeInCassandra(
        List<ConsumerRecord<String, String>> records,
        Function<KafkaMessage.AnalyticsMetrics, T> mapper,
        AnalyticsMetrics metrics
    ) {
        if (records == null || records.isEmpty()) {
            return;
        }

        metrics.totalReceived.addAndGet(records.size());

        List<T> analyticsStats = new ArrayList<>(records.size());

        try {
            metrics.deserializationTimer.record(() -> {
                for (ConsumerRecord<String, String> record : records) {
                    KafkaMessage.AnalyticsMetrics analytics = objectMapper.readValue(
                        record.value(),
                        KafkaMessage.AnalyticsMetrics.class
                    );
                    analyticsStats.add(mapper.apply(analytics));
                }
            });

            long insertStart = System.nanoTime();

            CompletableFuture<Void> insertFuture = cassandraBatchInsertUtil.insertAsync(analyticsStats);

            insertFuture.whenComplete((result, error) ->
                metrics.insertTimer.record(
                    System.nanoTime() - insertStart,
                    TimeUnit.NANOSECONDS
                )
            );

            insertFuture.join();

            metrics.totalProcessed.addAndGet(records.size());
        } catch (Exception e) {
            metrics.totalFailed.addAndGet(records.size());
            log.error("Failed processing Kafka batch", e);
            throw e;
        } finally {
            logStatsIfNeeded(metrics);
        }
    }

    private void logStatsIfNeeded(AnalyticsMetrics metrics) {
        long now = System.nanoTime();
        long lastLog = metrics.lastLogNanos.get();
        long elapsedNanos = now - lastLog;

        if (elapsedNanos < LOG_INTERVAL_NANOS) {
            return;
        }

        if (!metrics.lastLogNanos.compareAndSet(lastLog, now)) {
            return;
        }

        long received = metrics.totalReceived.get();
        long processed = metrics.totalProcessed.get();
        long failed = metrics.totalFailed.get();

        long previousReceived = metrics.lastLoggedReceived.getAndSet(received);
        long intervalReceived = received - previousReceived;

        double elapsedSeconds = elapsedNanos / 1_000_000_000.0;
        double rate = intervalReceived / elapsedSeconds;

        long inFlight = received - processed - failed;

        log.info(
            "Analytics processor stats: received={}, processed={}, failed={}, inFlight={}, rate={} records/s | " +
                "deserialization={}ms, cassandraInsert={}ms",
            received,
            processed,
            failed,
            inFlight,
            Math.round(rate),
            format(getIntervalAverageMs(
                metrics.deserializationTimer,
                metrics.lastDeserializationCount,
                metrics.lastDeserializationTotalNanos
            )),
            format(getIntervalAverageMs(
                metrics.insertTimer,
                metrics.lastInsertCount,
                metrics.lastInsertTotalNanos
            ))
        );
    }

    private double getIntervalAverageMs(
        Timer timer,
        AtomicLong previousCount,
        AtomicLong previousTotalNanos
    ) {
        long currentCount = timer.count();
        long currentTotalNanos = (long) timer.totalTime(TimeUnit.NANOSECONDS);

        long previousCountValue = previousCount.getAndSet(currentCount);
        long previousTotalNanosValue = previousTotalNanos.getAndSet(currentTotalNanos);

        long intervalCount = currentCount - previousCountValue;
        long intervalTotalNanos = currentTotalNanos - previousTotalNanosValue;

        if (intervalCount <= 0) {
            return 0.0;
        }

        return (double) intervalTotalNanos / intervalCount / 1_000_000.0;
    }

    private String format(double value) {
        return String.format("%.2f", value);
    }

    private static class AnalyticsMetrics {
        private final AtomicLong totalReceived;
        private final AtomicLong totalProcessed;
        private final AtomicLong totalFailed;
        private final AtomicLong lastLoggedReceived;
        private final AtomicLong lastLogNanos;
        private final AtomicLong lastDeserializationCount;
        private final AtomicLong lastDeserializationTotalNanos;
        private final AtomicLong lastInsertCount;
        private final AtomicLong lastInsertTotalNanos;
        private final Timer deserializationTimer;
        private final Timer insertTimer;

        private AnalyticsMetrics(
            AtomicLong totalReceived,
            AtomicLong totalProcessed,
            AtomicLong totalFailed,
            AtomicLong lastLoggedReceived,
            AtomicLong lastLogNanos,
            AtomicLong lastDeserializationCount,
            AtomicLong lastDeserializationTotalNanos,
            Timer deserializationTimer,
            Timer insertTimer
        ) {
            this.totalReceived = totalReceived;
            this.totalProcessed = totalProcessed;
            this.totalFailed = totalFailed;
            this.lastLoggedReceived = lastLoggedReceived;
            this.lastLogNanos = lastLogNanos;
            this.lastDeserializationCount = lastDeserializationCount;
            this.lastDeserializationTotalNanos = lastDeserializationTotalNanos;
            this.lastInsertCount = new AtomicLong(0);
            this.lastInsertTotalNanos = new AtomicLong(0);
            this.deserializationTimer = deserializationTimer;
            this.insertTimer = insertTimer;
        }
    }

}
