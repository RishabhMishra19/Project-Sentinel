package com.sentinel.common.kafka;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Pre-aggregated analytics delta flushed from ingest.
 * Key: serviceId + method + pathTemplate + minuteBucket.
 */
public record AnalyticsDeltaMessage(
        UUID serviceId,
        String method,
        String pathTemplate,
        Instant minuteBucket,
        long requestCount,
        long errorCount,
        long status2xx,
        long status3xx,
        long status4xx,
        long status5xx,
        long latencySumMs,
        long latencyMinMs,
        long latencyMaxMs,
        long requestBytesTotal,
        long responseBytesTotal,
        List<StatusCount> statusCounts) {

    public record StatusCount(int statusCode, long count) {}
}
