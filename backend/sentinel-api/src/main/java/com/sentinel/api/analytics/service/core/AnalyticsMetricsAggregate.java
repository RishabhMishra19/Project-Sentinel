package com.sentinel.api.analytics.service.core;

import java.time.Instant;
import java.util.UUID;

/** Aggregated metrics row used by scope handlers (not a JPA entity). */
public record AnalyticsMetricsAggregate(
        Instant bucketStart,
        UUID grainId,
        String name,
        String method,
        String pathTemplate,
        long requestCount,
        long errorCount,
        long status2xx,
        long status3xx,
        long status4xx,
        long status5xx,
        long latencySumMs,
        Integer latencyMinMs,
        Integer latencyMaxMs,
        Integer latencyP50Ms,
        Integer latencyP95Ms,
        Integer latencyP99Ms,
        long requestBytesTotal,
        long responseBytesTotal) {

    public double errorRate() {
        if (requestCount <= 0) {
            return 0.0;
        }
        return (double) errorCount / (double) requestCount;
    }
}
