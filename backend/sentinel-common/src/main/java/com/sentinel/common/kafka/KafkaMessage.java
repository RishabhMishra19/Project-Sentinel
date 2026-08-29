package com.sentinel.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.HdrHistogram.Histogram;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

public class KafkaMessage {

    @Builder
    public static record ReqLog(UUID requestLogId, UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, String path,
                                Instant occurredAt, Integer statusCode, Integer durationMs, String endUserIp, String requestId,
                                String traceId, String userId, Integer requestSizeBytes, Integer responseSizeBytes) {
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class AnalyticsMetrics {

        private AnalyticsBucket bucket;
        private AnalyticsScope scope;
        private UUID entityId;
        private Instant timestamp;
        private long requestCount;
        private long errorCount;
        private long status2xx;
        private long status3xx;
        private long status4xx;
        private long status5xx;
        private long latencySumMs;
        private long latencyMinMs;
        private long latencyMaxMs;
        private long requestBytesTotal;
        private long responseBytesTotal;
        private Histogram latencyHistogram;

        public AnalyticsMetrics(AnalyticsBucket bucket, AnalyticsScope scope, UUID entityId) {
            this.bucket = bucket;
            this.scope = scope;
            this.entityId = entityId;
            this.requestCount = 0;
            this.errorCount = 0;
            this.status2xx = 0;
            this.status3xx = 0;
            this.status4xx = 0;
            this.status5xx = 0;
            this.latencySumMs = 0;
            this.latencyMinMs = Long.MAX_VALUE;
            this.latencyMaxMs = 0;
            this.requestBytesTotal = 0;
            this.responseBytesTotal = 0;
            this.latencyHistogram = new Histogram(2);
        }

        public AnalyticsMetrics initialize(ReqLog reqLog) {
            this.timestamp = reqLog.occurredAt();
            this.requestCount = 1;
            this.errorCount = reqLog.statusCode() >= 400 ? 1 : 0;
            int statusCode = reqLog.statusCode();
            this.status2xx = statusCode >= 200 && statusCode < 300 ? 1 : 0;
            this.status3xx = statusCode >= 300 && statusCode < 400 ? 1 : 0;
            this.status4xx = statusCode >= 400 && statusCode < 500 ? 1 : 0;
            this.status5xx = statusCode >= 500 && statusCode < 600 ? 1 : 0;
            this.latencySumMs = reqLog.durationMs();
            this.latencyMinMs = reqLog.durationMs();
            this.latencyMaxMs = reqLog.durationMs();
            this.requestBytesTotal += reqLog.requestSizeBytes();
            this.responseBytesTotal += reqLog.responseSizeBytes();
            this.latencyHistogram = new Histogram(2);
            this.latencyHistogram.recordValue(reqLog.durationMs());
            return this;
        }


        public AnalyticsMetrics aggregate(AnalyticsMetrics metric) {
            this.entityId = metric.entityId;
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
            return this;
        }

    }


    @Builder
    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AnalyticsKey {
        UUID tenantId;
        UUID productId;
        UUID serviceId;
        UUID endpointId;

        public UUID getEntityId(AnalyticsScope forScope) {
            return switch (forScope) {
                case TENANT -> tenantId;
                case PRODUCT -> productId;
                case SERVICE -> serviceId;
                case ENDPOINT -> endpointId;
            };
        }

        public AnalyticsKey removeIdForScope(AnalyticsScope forScope) {
            switch (forScope) {
                case TENANT -> this.tenantId = null;
                case PRODUCT -> this.productId = null;
                case SERVICE -> this.serviceId = null;
                case ENDPOINT -> this.endpointId = null;
            }
            ;
            return this;
        }

        public String getBase64Str(ObjectMapper objectMapper) {
            try {
                byte[] jsonBytes = objectMapper.writeValueAsBytes(this);
                return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(jsonBytes);

            } catch (JsonProcessingException e) {
                throw new IllegalStateException(
                    "Failed to serialize AnalyticsKey",
                    e
                );
            }
        }

        public static AnalyticsKey fromKey(String encodedKey, ObjectMapper objectMapper) {
            if (encodedKey == null || encodedKey.isBlank()) {
                return null;
            }

            try {
                byte[] jsonBytes = Base64.getUrlDecoder()
                    .decode(encodedKey);

                return objectMapper.readValue(jsonBytes, AnalyticsKey.class);

            } catch (IllegalArgumentException | IOException e) {
                throw new IllegalArgumentException(
                    "Invalid AnalyticsKey: " + encodedKey,
                    e
                );
            }
        }
    }

}
