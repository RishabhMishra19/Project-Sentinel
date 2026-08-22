package com.sentinel.common.analytics.entity;

import com.sentinel.common.analytics.dto.AnalyticsStatsMetrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnalyticsStatsBase {

    public AnalyticsStatsBase(AnalyticsStatsMetrics statsMetrics) {
        this.requestCount = statsMetrics.getRequestCount();
        this.errorCount = statsMetrics.getErrorCount();
        this.status2xx = statsMetrics.getStatus2xx();
        this.status3xx = statsMetrics.getStatus3xx();
        this.status4xx = statsMetrics.getStatus4xx();
        this.status5xx = statsMetrics.getStatus5xx();
        this.latencySumMs = statsMetrics.getLatencySumMs();
        this.latencyMinMs = statsMetrics.getLatencyMinMs();
        this.latencyMaxMs = statsMetrics.getLatencyMaxMs();
        this.latencyP50Ms = statsMetrics.getLatencyP50Ms();
        this.latencyP95Ms = statsMetrics.getLatencyP95Ms();
        this.latencyP99Ms = statsMetrics.getLatencyP99Ms();
        this.requestBytesTotal = statsMetrics.getRequestBytesTotal();
        this.responseBytesTotal = statsMetrics.getResponseBytesTotal();
    }

    private long requestCount;
    private long errorCount;
    private long status2xx;
    private long status3xx;
    private long status4xx;
    private long status5xx;
    private long latencySumMs;
    private long latencyMinMs;
    private long latencyMaxMs;
    private long latencyP50Ms;
    private long latencyP95Ms;
    private long latencyP99Ms;
    private long requestBytesTotal;
    private long responseBytesTotal;

}