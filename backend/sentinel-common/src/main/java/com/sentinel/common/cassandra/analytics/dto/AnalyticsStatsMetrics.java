package com.sentinel.common.cassandra.analytics.dto;

import com.sentinel.common.kafka.KafkaMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnalyticsStatsMetrics {

    public AnalyticsStatsMetrics(AnalyticsStatsMetrics metrics) {
        this.entityId = metrics.getEntityId();
        this.bucketStart = metrics.getBucketStart();
        this.requestCount = metrics.getRequestCount();
        this.errorCount = metrics.getErrorCount();
        this.errorRate = this.calculateErrorRate();
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

    private UUID entityId;
    private Instant bucketStart;
    private long requestCount = 0;
    private long errorCount = 0;
    private double errorRate = 0;
    private long status2xx = 0;
    private long status3xx = 0;
    private long status4xx = 0;
    private long status5xx = 0;
    private long latencySumMs = 0;
    private long latencyMinMs = Integer.MAX_VALUE;
    private long latencyMaxMs = 0;
    private long latencyP50Ms = 0;
    private long latencyP95Ms = 0;
    private long latencyP99Ms = 0;
    private long requestBytesTotal = 0;
    private long responseBytesTotal = 0;

    public void accumulate(KafkaMessage.ReqLog reqLog) {
        this.requestCount++;
        if (reqLog.statusCode() >= 400) {
            this.errorCount++;
        }
        this.errorRate = this.calculateErrorRate();
        int statusCode = reqLog.statusCode();
        if (statusCode >= 200 && statusCode < 300) {
            this.status2xx++;
        } else if (statusCode >= 300 && statusCode < 400) {
            this.status3xx++;
        } else if (statusCode >= 400 && statusCode < 500) {
            this.status4xx++;
        } else if (statusCode >= 500 && statusCode < 600) {
            this.status5xx++;
        }
        long latency = reqLog.durationMs();
        this.latencySumMs += latency;
        this.latencyMinMs = Math.min(latencyMinMs, latency);
        this.latencyMaxMs = Math.max(latencyMaxMs, latency);
        this.requestBytesTotal += reqLog.requestSizeBytes();
        this.responseBytesTotal += reqLog.responseSizeBytes();
    }

    public void accumulate(AnalyticsStatsMetrics metrics) {
        this.requestCount += metrics.getRequestCount();
        this.errorCount += metrics.getErrorCount();
        this.errorRate = this.calculateErrorRate();
        this.status2xx += metrics.getStatus2xx();
        this.status3xx += metrics.getStatus3xx();
        this.status4xx += metrics.getStatus4xx();
        this.status5xx += metrics.getStatus5xx();
        this.latencySumMs += metrics.getLatencySumMs();
        this.latencyMinMs = Math.min(latencyMinMs, metrics.getLatencyMinMs());
        this.latencyMaxMs = Math.max(latencyMaxMs, metrics.getLatencyMaxMs());
        this.requestBytesTotal += metrics.getRequestBytesTotal();
        this.responseBytesTotal += metrics.getResponseBytesTotal();
    }

    double calculateErrorRate() {
        return this.errorRate = (double) this.errorCount / (double) Math.min(this.requestCount, 1L);
    }

}