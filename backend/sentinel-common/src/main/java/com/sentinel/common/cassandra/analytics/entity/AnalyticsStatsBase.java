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
        this.requestCount = metrics.getMetrics().getRequestCount();
        this.errorCount = metrics.getMetrics().getErrorCount();
        this.status2xx = metrics.getMetrics().getStatus2xx();
        this.status3xx = metrics.getMetrics().getStatus3xx();
        this.status4xx = metrics.getMetrics().getStatus4xx();
        this.status5xx = metrics.getMetrics().getStatus5xx();
        this.latencySumMs = metrics.getMetrics().getLatencySumMs();
        this.latencyMinMs = metrics.getMetrics().getLatencyMinMs();
        this.latencyMaxMs = metrics.getMetrics().getLatencyMaxMs();
        this.latencyP50Ms = (long) metrics.getMetrics().getLatencyHistogram().getPercentileAtOrBelowValue(50);
        this.latencyP95Ms = (long) metrics.getMetrics().getLatencyHistogram().getPercentileAtOrBelowValue(95);
        this.latencyP99Ms = (long) metrics.getMetrics().getLatencyHistogram().getPercentileAtOrBelowValue(99);
        this.requestBytesTotal = metrics.getMetrics().getRequestBytesTotal();
        this.responseBytesTotal = metrics.getMetrics().getResponseBytesTotal();
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