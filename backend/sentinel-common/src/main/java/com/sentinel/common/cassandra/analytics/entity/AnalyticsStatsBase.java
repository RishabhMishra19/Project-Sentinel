package com.sentinel.common.cassandra.analytics.entity;

import com.sentinel.common.kafka.KafkaMessage;
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

    public AnalyticsStatsBase(KafkaMessage.AnalyticsMetrics metrics) {
        this.requestCount = metrics.getRequestCount();
        this.errorCount = metrics.getErrorCount();
        this.status2xx = metrics.getStatus2xx();
        this.status3xx = metrics.getStatus3xx();
        this.status4xx = metrics.getStatus4xx();
        this.status5xx = metrics.getStatus5xx();
        this.latencySumMs = metrics.getLatencySumMs();
        this.latencyMinMs = metrics.getLatencyMinMs();
        this.latencyMaxMs = metrics.getLatencyMaxMs();
        this.latencyP50Ms = (long) metrics.getLatencyHistogram().getValueAtPercentile(50);
        this.latencyP95Ms = (long) metrics.getLatencyHistogram().getValueAtPercentile(95);
        this.latencyP99Ms = (long) metrics.getLatencyHistogram().getValueAtPercentile(99);
        this.requestBytesTotal = metrics.getRequestBytesTotal();
        this.responseBytesTotal = metrics.getResponseBytesTotal();
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