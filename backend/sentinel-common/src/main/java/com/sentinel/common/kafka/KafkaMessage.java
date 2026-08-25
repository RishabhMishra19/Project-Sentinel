package com.sentinel.common.kafka;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.SneakyThrows;
import org.HdrHistogram.Histogram;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

public class KafkaMessage {

    private static final Map<AnalyticsBucket, ChronoUnit> bucketToChronoUnitMap = Map.ofEntries(
        Map.entry(AnalyticsBucket.MINUTE, ChronoUnit.MINUTES),
        Map.entry(AnalyticsBucket.HOUR, ChronoUnit.HOURS),
        Map.entry(AnalyticsBucket.DAY, ChronoUnit.DAYS)
    );

    // Serializes the histogram into a compressed, Base64-encoded string
    public static class JacksonHdrSerializer extends JsonSerializer<Histogram> {
        @Override
        public void serialize(Histogram value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            if (value == null) {
                gen.writeNull();
                return;
            }
            ByteBuffer buffer = ByteBuffer.allocate(value.getEstimatedFootprintInBytes());
            int size = value.encodeIntoCompressedByteBuffer(buffer);
            byte[] bytes = new byte[size];
            System.arraycopy(buffer.array(), 0, bytes, 0, size);

            gen.writeString(Base64.getEncoder().encodeToString(bytes));
        }
    }

    // Deserializes the Base64 string back into a Histogram object
    public static class JacksonHdrDeserializer extends JsonDeserializer<Histogram> {
        @SneakyThrows
        @Override
        public Histogram deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String base64Str = p.getValueAsString();
            if (base64Str == null)
                return null;

            byte[] bytes = Base64.getDecoder().decode(base64Str);
            return Histogram.decodeFromCompressedByteBuffer(ByteBuffer.wrap(bytes), 0);
        }
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
        @JsonSerialize(using = JacksonHdrSerializer.class)
        @JsonDeserialize(using = JacksonHdrDeserializer.class)
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

        public AnalyticsMetrics initialize(AnalyticsMetrics metrics) {
            this.timestamp = metrics.getTimestamp();
            this.requestCount = metrics.getRequestCount();
            this.errorCount = metrics.getErrorCount();
            this.status2xx = metrics.getStatus2xx();
            this.status3xx = metrics.getStatus3xx();
            this.status4xx = metrics.getStatus4xx();
            this.status5xx = metrics.getStatus5xx();
            this.latencySumMs = metrics.getLatencySumMs();
            this.latencyMinMs = metrics.getLatencyMinMs();
            this.latencyMaxMs = metrics.getLatencyMaxMs();
            this.requestBytesTotal = metrics.getRequestBytesTotal();
            this.responseBytesTotal = metrics.getResponseBytesTotal();
            this.latencyHistogram = metrics.getLatencyHistogram();
            return this;
        }

        public AnalyticsMetrics aggregate(AnalyticsMetrics metric) {
            this.entityId = metric.entityId;
            this.timestamp = metric.timestamp == null ? null : metric.timestamp.truncatedTo(bucketToChronoUnitMap.get(bucket));
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
        @JsonIgnore
        public String getKey() {
            return tenantId.toString() + "|" + productId.toString() + "|" + serviceId.toString() + "|" + endpointId.toString();
        }
    }

}
