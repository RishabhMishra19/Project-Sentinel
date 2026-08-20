package com.sentinel.common.analytics;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.cassandra.core.mapping.Column;

@Getter
@Setter
@AllArgsConstructor
public class AnalyticsStatsMetrics {

    public AnalyticsStatsMetrics(AnalyticsStatsMetrics metrics) {
        this.requestCount = metrics.getRequestCount();
        this.errorCount = metrics.getErrorCount();
        this.status2xx = metrics.getStatus2xx();
        this.status3xx = metrics.getStatus3xx();
        this.status4xx = metrics.getStatus4xx();
        this.status5xx = metrics.getStatus5xx();

        this.latencySumMs = metrics.getLatencySumMs();
        this.latencyMinMs = metrics.getLatencyMinMs();
        this.latencyMaxMs = metrics.getLatencyMaxMs();
        this.latencyP50Ms = metrics.getLatencyP50Ms();
        this.latencyP95Ms = metrics.getLatencyP95Ms();
        this.latencyP99Ms = metrics.getLatencyP99Ms();

        this.requestBytesTotal = metrics.getRequestBytesTotal();
        this.responseBytesTotal = metrics.getResponseBytesTotal();
    }

    public AnalyticsStatsMetrics(){
        this.requestCount = 0;
        this.errorCount = 0;
        this.status2xx = 0;
        this.status3xx = 0;
        this.status4xx = 0;
        this.status5xx = 0;
        this.latencySumMs = 0;
        this.latencyMinMs = Integer.MAX_VALUE;
        this.latencyMaxMs = 0;
        this.latencyP50Ms = 0;
        this.latencyP95Ms = 0;
        this.latencyP99Ms = 0;
        this.requestBytesTotal = 0;
        this.responseBytesTotal = 0;
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

    public void accumulate(KafkaMessage.ReqLog reqLog) {
        requestCount++;

        if (reqLog.statusCode() >= 400) {
            errorCount++;
        }

        int statusCode = reqLog.statusCode();
        if (statusCode >= 200 && statusCode < 300) {
            status2xx++;
        } else if (statusCode >= 300 && statusCode < 400) {
            status3xx++;
        } else if (statusCode >= 400 && statusCode < 500) {
            status4xx++;
        } else if (statusCode >= 500 && statusCode < 600) {
            status5xx++;
        }

        long latency = reqLog.durationMs();
        latencySumMs += latency;
        latencyMinMs = Math.min(latencyMinMs, latency);
        latencyMaxMs = Math.max(latencyMaxMs, latency);

        requestBytesTotal += reqLog.requestSizeBytes();
        responseBytesTotal += reqLog.responseSizeBytes();
    }

    public void accumulate(AnalyticsStatsMetrics metrics) {
        requestCount += metrics.getRequestCount();
        errorCount += metrics.getErrorCount();

        status2xx += metrics.getStatus2xx();
        status3xx += metrics.getStatus3xx();
        status4xx += metrics.getStatus4xx();
        status5xx += metrics.getStatus5xx();

        latencySumMs += metrics.getLatencySumMs();
        latencyMinMs = Math.min(latencyMinMs, metrics.getLatencyMinMs());
        latencyMaxMs = Math.max(latencyMaxMs, metrics.getLatencyMaxMs());

        requestBytesTotal += metrics.getRequestBytesTotal();
        responseBytesTotal += metrics.getResponseBytesTotal();
    }
}