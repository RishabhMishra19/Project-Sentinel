package com.sentinel.worker.analytics;

import com.sentinel.common.kafka.RequestEventMessage;
import com.sentinel.worker.support.ServiceHierarchy;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsRollupService {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRollupService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void record(
            RequestEventMessage message, UUID endpointId, ServiceHierarchy hierarchy) {
        Instant occurredAt = message.occurredAt();
        Instant minute = occurredAt.truncatedTo(ChronoUnit.MINUTES);
        Instant hour = occurredAt.truncatedTo(ChronoUnit.HOURS);
        Instant day = occurredAt.truncatedTo(ChronoUnit.DAYS);

        int statusCode = message.statusCode();
        long error = statusCode >= 400 ? 1L : 0L;
        long s2 = statusClass(statusCode, 200);
        long s3 = statusClass(statusCode, 300);
        long s4 = statusClass(statusCode, 400);
        long s5 = statusClass(statusCode, 500);
        int durationMs = message.durationMs();
        long reqBytes = message.requestSizeBytes();
        long resBytes = message.responseSizeBytes();

        upsertStats(
                "analytics_endpoint_stats_minute",
                "endpoint_id",
                minute,
                endpointId,
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_endpoint_stats_hour",
                "endpoint_id",
                hour,
                endpointId,
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_endpoint_stats_day",
                "endpoint_id",
                day,
                endpointId,
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);

        upsertStats(
                "analytics_service_stats_minute",
                "service_id",
                minute,
                message.serviceId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_service_stats_hour",
                "service_id",
                hour,
                message.serviceId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_service_stats_day",
                "service_id",
                day,
                message.serviceId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);

        upsertStats(
                "analytics_product_stats_minute",
                "product_id",
                minute,
                hierarchy.productId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_product_stats_hour",
                "product_id",
                hour,
                hierarchy.productId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_product_stats_day",
                "product_id",
                day,
                hierarchy.productId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);

        upsertStats(
                "analytics_tenant_stats_minute",
                "tenant_id",
                minute,
                hierarchy.tenantId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_tenant_stats_hour",
                "tenant_id",
                hour,
                hierarchy.tenantId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);
        upsertStats(
                "analytics_tenant_stats_day",
                "tenant_id",
                day,
                hierarchy.tenantId(),
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                reqBytes,
                resBytes);

        upsertStatusMetric(minute, endpointId, statusCode);
    }

    private static long statusClass(int statusCode, int clazz) {
        return statusCode >= clazz && statusCode < clazz + 100 ? 1L : 0L;
    }

    private void upsertStats(
            String table,
            String grainColumn,
            Instant bucketStart,
            UUID grainId,
            long error,
            long s2,
            long s3,
            long s4,
            long s5,
            int durationMs,
            long reqBytes,
            long resBytes) {
        String sql =
                """
                INSERT INTO %s (
                    bucket_start, %s,
                    request_count, error_count,
                    status_2xx, status_3xx, status_4xx, status_5xx,
                    latency_sum_ms, latency_min_ms, latency_max_ms,
                    latency_p50_ms, latency_p95_ms, latency_p99_ms,
                    request_bytes_total, response_bytes_total
                ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT (bucket_start, %s) DO UPDATE SET
                    request_count = %s.request_count + 1,
                    error_count = %s.error_count + EXCLUDED.error_count,
                    status_2xx = %s.status_2xx + EXCLUDED.status_2xx,
                    status_3xx = %s.status_3xx + EXCLUDED.status_3xx,
                    status_4xx = %s.status_4xx + EXCLUDED.status_4xx,
                    status_5xx = %s.status_5xx + EXCLUDED.status_5xx,
                    latency_sum_ms = %s.latency_sum_ms + EXCLUDED.latency_sum_ms,
                    latency_min_ms = LEAST(%s.latency_min_ms, EXCLUDED.latency_min_ms),
                    latency_max_ms = GREATEST(%s.latency_max_ms, EXCLUDED.latency_max_ms),
                    latency_p50_ms = ((%s.latency_p50_ms * %s.request_count) + EXCLUDED.latency_p50_ms)
                        / (%s.request_count + 1),
                    latency_p95_ms = GREATEST(%s.latency_p95_ms, EXCLUDED.latency_p95_ms),
                    latency_p99_ms = GREATEST(%s.latency_p99_ms, EXCLUDED.latency_p99_ms),
                    request_bytes_total = %s.request_bytes_total + EXCLUDED.request_bytes_total,
                    response_bytes_total = %s.response_bytes_total + EXCLUDED.response_bytes_total
                """
                        .formatted(
                                table,
                                grainColumn,
                                grainColumn,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table,
                                table);

        jdbcTemplate.update(
                sql,
                Timestamp.from(bucketStart),
                grainId,
                error,
                s2,
                s3,
                s4,
                s5,
                durationMs,
                durationMs,
                durationMs,
                durationMs,
                durationMs,
                durationMs,
                reqBytes,
                resBytes);
    }

    private void upsertStatusMetric(Instant bucketStart, UUID endpointId, int statusCode) {
        jdbcTemplate.update(
                """
                INSERT INTO analytics_endpoint_status_metrics (
                    bucket_start, endpoint_id, status_code, request_count
                ) VALUES (?, ?, ?, 1)
                ON CONFLICT (bucket_start, endpoint_id, status_code)
                DO UPDATE SET request_count = analytics_endpoint_status_metrics.request_count + 1
                """,
                Timestamp.from(bucketStart),
                endpointId,
                statusCode);
    }
}
