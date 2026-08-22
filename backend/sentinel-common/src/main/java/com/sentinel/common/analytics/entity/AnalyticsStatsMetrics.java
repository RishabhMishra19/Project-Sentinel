package com.sentinel.common.analytics.entity;

import com.sentinel.common.kafka.KafkaMessage;
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

    private long requestCount= 0;
    private long errorCount= 0;
    private long status2xx= 0;
    private long status3xx= 0;
    private long status4xx= 0;
    private long status5xx= 0;
    private long latencySumMs= 0;
    private long latencyMinMs= Integer.MAX_VALUE;
    private long latencyMaxMs= 0;
    private long latencyP50Ms= 0;
    private long latencyP95Ms= 0;
    private long latencyP99Ms= 0;
    private long requestBytesTotal= 0;
    private long responseBytesTotal= 0;

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