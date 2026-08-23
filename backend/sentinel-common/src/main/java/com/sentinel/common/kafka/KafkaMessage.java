package com.sentinel.common.kafka;

import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

public class KafkaMessage {

    private static final int[] LATENCY_BUCKET_LIMITS = {10, 25, 50, 100, 250, 500, 1000, 1500, 2000};

    private static int getLatencyBucket(int latencyMs) {

        for (int i = 0; i < LATENCY_BUCKET_LIMITS.length; i++) {
            if (latencyMs <= LATENCY_BUCKET_LIMITS[i]) {
                return i;
            }
        }

        return 9; // 2000+
    }

    private static long calculatePercentile(long[] latencyBuckets, double percentile) {
        long totalRequests = 0;
        for (long count : latencyBuckets) {
            totalRequests += count;
        }
        // ceil because we want the first observation
        // at or above the requested percentile.
        long target = (long) Math.ceil(totalRequests * percentile);
        long cumulative = 0;
        for (int i = 0; i < latencyBuckets.length; i++) {
            cumulative += latencyBuckets[i];
            if (cumulative >= target) {
                return LATENCY_BUCKET_LIMITS[i];
            }
        }
        return 2001; // 2000ms+
    }

    @Setter
    @Getter
    public static class Analytics {
        private long[] latencyBuckets = new long[10];
        private AnalyticsStatsMetrics metrics = new  AnalyticsStatsMetrics();
        private UUID id;
        private Instant startBucket;

        public Analytics accumulate(ReqLog reqLog, UUID entityId) {
            this.metrics.accumulate(reqLog);
            this.metrics.setEntityId(entityId);
            latencyBuckets[getLatencyBucket(reqLog.durationMs)]++;
            return this;
        }

        public Analytics accumulate(Analytics analytics, UUID entityId) {
            this.metrics.accumulate(analytics.metrics);
            this.metrics.setEntityId(entityId);
            for(int i = 0; i < analytics.latencyBuckets.length; i++) {
                latencyBuckets[i] += analytics.latencyBuckets[i];
            }
            return this;
        }

        public void calculateAndUpdateLatencyPercentiles() {
            this.metrics.setLatencyP50Ms(calculatePercentile(this.latencyBuckets, 0.50));
            this.metrics.setLatencyP95Ms(calculatePercentile(this.latencyBuckets, 0.95));
            this.metrics.setLatencyP99Ms(calculatePercentile(this.latencyBuckets, 0.99));
        }

    }

    public static record EndpointStatusMetric(UUID endpointId, RequestStatus status, AnalyticsStatsMetrics metrics) {
        public String getKey(){
            return endpointId.toString()+"|"+status.toString();
        }
    }

    @Builder
    public static record ReqLog(UUID requestLogId, UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, String path, Instant occurredAt, Integer statusCode, Integer durationMs, String endUserIp, String requestId, String traceId, String userId, Integer requestSizeBytes, Integer responseSizeBytes) {
        public String getKey(){
            return tenantId.toString()+"|"+productId.toString()+"|"+serviceId.toString()+"|"+endpointId.toString();
        }
    }


    public static enum RequestStatus {
        STATUS_2XX,
        STATUS_3XX,
        STATUS_4XX,
        STATUS_5XX,
    }
}
