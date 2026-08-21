package com.sentinel.api.analytics.service.core;

import java.time.Instant;
import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsMinute;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

/**
 * Aggregated metrics row used by scope handlers (not a JPA entity).
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AnalyticsMetricsAggregate {

    public AnalyticsMetricsAggregate(UUID grainId, Instant bucketStart) {
        this.grainId = grainId;
        this.bucketStart = bucketStart;
        this.requestCount = 0;
        this.errorCount = 0;
        this.status2xx = 0;
        this.status3xx = 0;
        this.status4xx = 0;
        this.status5xx = 0;
        this.latencySumMs = 0;
        this.latencyMinMs = 0L;
        this.latencyMaxMs = 0L;
        this.latencyP50Ms = 0L;
        this.latencyP95Ms = 0L;
        this.latencyP99Ms = 0L;
        this.requestBytesTotal = 0;
        this.responseBytesTotal = 0;
    }

    private Instant bucketStart;
    private UUID grainId;
    private String name;
    private String method;
    private String pathTemplate;
    private long requestCount;
    private long errorCount;
    private long status2xx;
    private long status3xx;
    private long status4xx;
    private long status5xx;
    private long latencySumMs;
    private Long latencyMinMs;
    private Long latencyMaxMs;
    private Long latencyP50Ms;
    private Long latencyP95Ms;
    private Long latencyP99Ms;
    private long requestBytesTotal;
    private long responseBytesTotal;

    public double errorRate() {
        if (requestCount <= 0) {
            return 0.0;
        }
        return (double) errorCount / (double) requestCount;
    }

    public void incrRequestCount(long count) {
        this.requestCount += count;
    }

    public void incrErrorCount(long count) {
        this.errorCount += count;
    }

    public void incrStatus2xx(long count) {
        this.status2xx += count;
    }

    public void incrStatus3xx(long count) {
        this.status3xx += count;
    }

    public void incrStatus4xx(long count) {
        this.status4xx += count;
    }

    public void incrStatus5xx(long count) {
        this.status5xx += count;
    }

    public void incrLatencySumMs(long count) {
        this.latencySumMs += count;
    }

    public void incrRequestBytesTotal(long count) {
        this.requestBytesTotal += count;
    }

    public void incrResponseBytesTotal(long count) {
        this.responseBytesTotal += count;
    }

    public void updateLatencyMinMs(long latencyMs) {
        if (this.latencyMinMs == null || latencyMs < this.latencyMinMs) {
            this.latencyMinMs = latencyMs;
        }
    }

    public void updateLatencyMaxMs(long latencyMs) {
        if (this.latencyMaxMs == null || latencyMs > this.latencyMaxMs) {
            this.latencyMaxMs = latencyMs;
        }
    }
}
