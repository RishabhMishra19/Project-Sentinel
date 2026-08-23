package com.sentinel.common.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.HdrHistogram.Histogram;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class KafkaMessage {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaseMetrics {

        private long requestCount = 0;
        private long errorCount = 0;
        private long status2xx = 0;
        private long status3xx = 0;
        private long status4xx = 0;
        private long status5xx = 0;
        private long latencySumMs = 0;
        private long latencyMinMs = Integer.MAX_VALUE;
        private long latencyMaxMs = 0;
        private long requestBytesTotal = 0;
        private long responseBytesTotal = 0;
        private final Histogram latencyHistogram = new Histogram(2);

        public void aggregate(BaseMetrics metric) {
            this.requestCount += metric.requestCount;
            this.errorCount += metric.errorCount;
            this.status2xx += metric.status2xx;
            this.status3xx += metric.status3xx;
            this.status4xx += metric.status4xx;
            this.status5xx += metric.status5xx;
            this.latencySumMs += metric.latencySumMs;
            this.latencyMinMs = Math.min(this.latencyMinMs, metric.latencyMinMs);
            this.latencyMaxMs = Math.max(this.latencyMaxMs, metric.latencyMaxMs);
            this.requestBytesTotal += metric.requestBytesTotal;
            this.responseBytesTotal += metric.responseBytesTotal;
            this.latencyHistogram.add(metric.latencyHistogram);
        }

        public void aggregate(ReqLog reqLog) {
            this.requestCount++;
            if (reqLog.statusCode() >= 400) {
                this.errorCount++;
            }
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

    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class AnalyticsMetrics {

        private String compositeIds;
        private Instant bucketStart;
        private BaseMetrics metrics = new BaseMetrics();

        public static AnalyticsMetrics from(ReqLog reqLog) {
            AnalyticsMetrics metrics = new AnalyticsMetrics();
            metrics.metrics.aggregate(reqLog);
            metrics.setCompositeIds(String.join(
                    "\\|",
                    List.of(reqLog.tenantId.toString(), reqLog.productId.toString(), reqLog.serviceId.toString(), reqLog.endpointId.toString())
            ));
            return metrics;
        }

        public AnalyticsMetrics aggregate(AnalyticsMetrics metrics) {
            this.metrics.aggregate(metrics.getMetrics());
            return this;
        }

        public UUID getEndpointId() {
            String[] ids = compositeIds.split("\\|");
            return ids.length < 4 ? null : UUID.fromString(ids[3]);
        }

        public UUID getServiceId() {
            String[] ids = compositeIds.split("\\|");
            return ids.length < 3 ? null : UUID.fromString(ids[2]);
        }

        public UUID getProductId() {
            String[] ids = compositeIds.split("\\|");
            return ids.length < 2 ? null : UUID.fromString(ids[1]);
        }

        public UUID getTenantId() {
            String[] ids = compositeIds.split("\\|");
            return ids.length < 1 ? null : UUID.fromString(ids[0]);
        }

        public void removeLastIdFromCompositeId() {
            String[] ids = compositeIds.split("\\|");
            if (ids.length == 0) return;
            this.compositeIds = String.join("|", List.of(ids).subList(0, ids.length - 1));
        }

    }

    @Builder
    public static record ReqLog(
            UUID requestLogId,
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            String path,
            Instant occurredAt,
            Integer statusCode,
            Integer durationMs,
            String endUserIp,
            String requestId,
            String traceId,
            String userId,
            Integer requestSizeBytes,
            Integer responseSizeBytes
    ) {
        public String getKey(){
            return tenantId.toString()+"|"+productId.toString()+"|"+serviceId.toString()+"|"+endpointId.toString();
        }
    }

}
