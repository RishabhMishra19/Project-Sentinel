package com.sentinel.processor.kafka.stream.listener;

import com.sentinel.common.cassandra.CassandraBatchInsertUtil;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;
import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class ReqLogListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ReqLogListener.class);
    private static final long LOG_INTERVAL_NANOS = TimeUnit.SECONDS.toNanos(1);

    private final ObjectMapper objectMapper;
    private final CassandraBatchInsertUtil cassandraBatchInsertUtil;
    private final Timer deserializationTimer;
    private final Timer requestLogInsertTimer;
    private final Timer requestLogLookupInsertTimer;

    private final AtomicLong totalReceived = new AtomicLong(0);
    private final AtomicLong totalProcessed = new AtomicLong(0);
    private final AtomicLong totalFailed = new AtomicLong(0);

    private final AtomicLong lastLoggedReceived = new AtomicLong(0);
    private final AtomicLong lastLogNanos = new AtomicLong(System.nanoTime());

    private final AtomicLong lastDeserializationCount = new AtomicLong(0);
    private final AtomicLong lastDeserializationTotalNanos = new AtomicLong(0);

    private final AtomicLong lastRequestLogInsertCount = new AtomicLong(0);
    private final AtomicLong lastRequestLogInsertTotalNanos = new AtomicLong(0);

    private final AtomicLong lastRequestLogLookupInsertCount = new AtomicLong(0);
    private final AtomicLong lastRequestLogLookupInsertTotalNanos = new AtomicLong(0);

    public ReqLogListener(
        ObjectMapper objectMapper,
        CassandraBatchInsertUtil cassandraBatchInsertUtil,
        MeterRegistry meterRegistry
    ) {
        this.objectMapper = objectMapper;
        this.cassandraBatchInsertUtil = cassandraBatchInsertUtil;

        this.deserializationTimer = buildTimer(
            meterRegistry,
            "sentinel.processor.deserialization"
        );

        this.requestLogInsertTimer = buildTimer(
            meterRegistry,
            "sentinel.processor.request-log-insert"
        );

        this.requestLogLookupInsertTimer = buildTimer(
            meterRegistry,
            "sentinel.processor.request-log-lookup-insert"
        );
    }

    private Timer buildTimer(MeterRegistry meterRegistry, String name) {
        return Timer.builder(name).publishPercentiles(0.5, 0.95, 0.99).publishPercentileHistogram().register(meterRegistry);
    }

    @KafkaListener(topics = KafkaTopics.request_logs, containerFactory = "sentinelKafkaListenerContainerFactory", groupId =
        KafkaTopics.request_logs + "_group")
    public void onReqLogsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }

        totalReceived.addAndGet(records.size());

        List<RequestLog> requestLogs = new ArrayList<>(records.size());
        List<RequestLogLookup> requestLogLookups = new ArrayList<>(records.size());

        try {
            deserializationTimer.record(() -> {
                for (ConsumerRecord<String, String> record : records) {
                    KafkaMessage.ReqLog reqLog = objectMapper.readValue(record.value(), KafkaMessage.ReqLog.class);
                    requestLogs.add(this.toRequestLog(reqLog));
                    requestLogLookups.add(this.toRequestLogLookup(reqLog));
                }
            });

            long requestLogInsertStart = System.nanoTime();
            CompletableFuture<Void> requestLogInsertFuture = cassandraBatchInsertUtil.insertAsync(requestLogs);
            requestLogInsertFuture.whenComplete((result, error) ->
                requestLogInsertTimer.record(System.nanoTime() - requestLogInsertStart, TimeUnit.NANOSECONDS)
            );

            long requestLogLookupInsertStart = System.nanoTime();
            CompletableFuture<Void> requestLogLookupInsertFuture = cassandraBatchInsertUtil.insertAsync(requestLogLookups);
            requestLogLookupInsertFuture.whenComplete((result, error) ->
                requestLogLookupInsertTimer.record(System.nanoTime() - requestLogLookupInsertStart, TimeUnit.NANOSECONDS)
            );

            CompletableFuture.allOf(
                requestLogInsertFuture,
                requestLogLookupInsertFuture
            ).join();

            totalProcessed.addAndGet(records.size());
        } catch (Exception e) {
            totalFailed.addAndGet(records.size());
            log.error("Failed processing Kafka batch", e);
            throw e;
        } finally {
            logStatsIfNeeded();
        }
    }

    private RequestLogLookup toRequestLogLookup(KafkaMessage.ReqLog reqLogKafkaMessage) {
        return RequestLogLookup.builder()
            .requestLogId(reqLogKafkaMessage.requestLogId())
            .occurredAt(reqLogKafkaMessage.occurredAt())
            .build();
    }

    private RequestLog toRequestLog(KafkaMessage.ReqLog reqLog) {
        return RequestLog.builder()
            .id(new RequestLog.PrimaryKeyComposite(reqLog.tenantId(), reqLog.serviceId(), reqLog.occurredAt(), reqLog.requestLogId()))
            .endpointId(reqLog.endpointId())
            .requestId(reqLog.requestId())
            .traceId(reqLog.traceId())
            .endUserIp(reqLog.endUserIp())
            .userId(reqLog.userId())
            .statusCode(reqLog.statusCode())
            .durationMs(reqLog.durationMs())
            .requestSizeBytes(reqLog.requestSizeBytes())
            .responseSizeBytes(reqLog.responseSizeBytes())
            .build();
    }

    private void logStatsIfNeeded() {
        long now = System.nanoTime();
        long lastLog = lastLogNanos.get();
        long elapsedNanos = now - lastLog;

        if (elapsedNanos < LOG_INTERVAL_NANOS) {
            return;
        }

        if (!lastLogNanos.compareAndSet(lastLog, now)) {
            return;
        }

        long received = totalReceived.get();
        long processed = totalProcessed.get();
        long failed = totalFailed.get();

        long previousReceived = lastLoggedReceived.getAndSet(received);
        long intervalReceived = received - previousReceived;

        double elapsedSeconds = elapsedNanos / 1_000_000_000.0;
        double rate = intervalReceived / elapsedSeconds;

        long inFlight = received - processed - failed;

        double deserializationMs = getIntervalAverageMs(
            deserializationTimer,
            lastDeserializationCount,
            lastDeserializationTotalNanos
        );

        double requestLogInsertMs = getIntervalAverageMs(
            requestLogInsertTimer,
            lastRequestLogInsertCount,
            lastRequestLogInsertTotalNanos
        );

        double requestLogLookupInsertMs = getIntervalAverageMs(
            requestLogLookupInsertTimer,
            lastRequestLogLookupInsertCount,
            lastRequestLogLookupInsertTotalNanos
        );

        log.info(
            "Processor stats: received={}, processed={}, failed={}, inFlight={}, rate={} records/s | " +
                "deserialization={}ms, requestLogInsert={}ms, requestLogLookupInsert={}ms",
            received,
            processed,
            failed,
            inFlight,
            Math.round(rate),
            format(deserializationMs),
            format(requestLogInsertMs),
            format(requestLogLookupInsertMs)
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

}
