package com.sentinel.ingest.analytics;

import com.sentinel.common.kafka.AnalyticsDeltaMessage;
import com.sentinel.common.kafka.AnalyticsDeltaMessage.StatusCount;
import com.sentinel.ingest.event.dto.request.IngestEventItem;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsDeltaAccumulator {

    private final AnalyticsDeltaPublisher publisher;
    private final int flushEventThreshold;

    /** Per-key aggregation; ConcurrentHashMap.compute serializes only that key. */
    private final ConcurrentHashMap<DeltaKey, DeltaAgg> buffer = new ConcurrentHashMap<>();
    private final AtomicLong pendingEvents = new AtomicLong();
    private final AtomicBoolean flushing = new AtomicBoolean(false);

    public AnalyticsDeltaAccumulator(
            AnalyticsDeltaPublisher publisher,
            @Value("${sentinel.analytics.flush-event-threshold:2000}") int flushEventThreshold) {
        this.publisher = publisher;
        this.flushEventThreshold = flushEventThreshold;
    }

    public void record(UUID serviceId, String method, String pathTemplate, IngestEventItem event) {
        Instant minuteBucket = event.occurredAt().truncatedTo(ChronoUnit.MINUTES);
        DeltaKey key = new DeltaKey(serviceId, method, pathTemplate, minuteBucket);
        int statusCode = event.statusCode();
        long error = statusCode >= 400 ? 1L : 0L;
        long s2 = statusClass(statusCode, 200);
        long s3 = statusClass(statusCode, 300);
        long s4 = statusClass(statusCode, 400);
        long s5 = statusClass(statusCode, 500);
        int durationMs = event.durationMs();
        long reqBytes = event.requestSizeBytes();
        long resBytes = event.responseSizeBytes();

        buffer.compute(key, (k, existing) -> {
            DeltaAgg agg = existing != null ? existing : new DeltaAgg();
            agg.requestCount += 1;
            agg.errorCount += error;
            agg.status2xx += s2;
            agg.status3xx += s3;
            agg.status4xx += s4;
            agg.status5xx += s5;
            agg.latencySumMs += durationMs;
            agg.latencyMinMs = Math.min(agg.latencyMinMs, durationMs);
            agg.latencyMaxMs = Math.max(agg.latencyMaxMs, durationMs);
            agg.requestBytesTotal += reqBytes;
            agg.responseBytesTotal += resBytes;
            agg.statusCounts.merge(statusCode, 1L, Long::sum);
            return agg;
        });

        if (pendingEvents.incrementAndGet() >= flushEventThreshold) {
            flush();
        }
    }

    @Scheduled(fixedDelayString = "${sentinel.analytics.flush-interval-ms:5000}")
    public void scheduledFlush() {
        flush();
    }

    public void flush() {
        if (buffer.isEmpty()) {
            pendingEvents.set(0);
            return;
        }
        if (!flushing.compareAndSet(false, true)) {
            return;
        }
        try {
            List<AnalyticsDeltaMessage> deltas = new ArrayList<>();
            for (DeltaKey key : buffer.keySet()) {
                DeltaAgg agg = buffer.remove(key);
                if (agg == null) {
                    continue;
                }
                deltas.add(toMessage(key, agg));
            }
            pendingEvents.set(0);
            if (!deltas.isEmpty()) {
                publisher.publish(deltas);
            }
        } finally {
            flushing.set(false);
        }
    }

    private static AnalyticsDeltaMessage toMessage(DeltaKey key, DeltaAgg agg) {
        List<StatusCount> statusCounts = new ArrayList<>(agg.statusCounts.size());
        for (Map.Entry<Integer, Long> sc : agg.statusCounts.entrySet()) {
            statusCounts.add(new StatusCount(sc.getKey(), sc.getValue()));
        }
        return new AnalyticsDeltaMessage(
                key.serviceId(),
                key.method(),
                key.pathTemplate(),
                key.minuteBucket(),
                agg.requestCount,
                agg.errorCount,
                agg.status2xx,
                agg.status3xx,
                agg.status4xx,
                agg.status5xx,
                agg.latencySumMs,
                agg.latencyMinMs == Long.MAX_VALUE ? 0 : agg.latencyMinMs,
                agg.latencyMaxMs,
                agg.requestBytesTotal,
                agg.responseBytesTotal,
                statusCounts);
    }

    private static long statusClass(int statusCode, int clazz) {
        return statusCode >= clazz && statusCode < clazz + 100 ? 1L : 0L;
    }

    private record DeltaKey(UUID serviceId, String method, String pathTemplate, Instant minuteBucket) {}

    private static final class DeltaAgg {
        long requestCount;
        long errorCount;
        long status2xx;
        long status3xx;
        long status4xx;
        long status5xx;
        long latencySumMs;
        long latencyMinMs = Long.MAX_VALUE;
        long latencyMaxMs;
        long requestBytesTotal;
        long responseBytesTotal;
        final Map<Integer, Long> statusCounts = new HashMap<>();
    }
}
