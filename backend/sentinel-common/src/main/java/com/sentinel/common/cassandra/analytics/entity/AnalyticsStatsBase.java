package com.sentinel.common.cassandra.analytics.entity;

import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.mapping.Column;

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

    @Column("request_count")
    private long requestCount;
    @Column("error_count")
    private long errorCount;
    @Column("status_2xx")
    private long status2xx;
    @Column("status_3xx")
    private long status3xx;
    @Column("status_4xx")
    private long status4xx;
    @Column("status_5xx")
    private long status5xx;
    @Column("latency_sum_ms")
    private long latencySumMs;
    @Column("latency_min_ms")
    private long latencyMinMs;
    @Column("latency_max_ms")
    private long latencyMaxMs;
    @Column("latency_p50_ms")
    private long latencyP50Ms;
    @Column("latency_p95_ms")
    private long latencyP95Ms;
    @Column("latency_p99_ms")
    private long latencyP99Ms;
    @Column("request_bytes_total")
    private long requestBytesTotal;
    @Column("response_bytes_total")
    private long responseBytesTotal;

}