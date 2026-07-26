package com.sentinel.worker.analytics;

import com.sentinel.common.kafka.AnalyticsDeltaMessage;
import com.sentinel.common.kafka.AnalyticsDeltaMessage.StatusCount;
import com.sentinel.worker.support.ServiceHierarchy;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsRollupService {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRollupService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Batch beginBatch() {
        return new Batch(jdbcTemplate);
    }

    public void applyDelta(AnalyticsDeltaMessage delta, UUID endpointId, ServiceHierarchy hierarchy) {
        Batch batch = beginBatch();
        batch.recordDelta(delta, endpointId, hierarchy);
        batch.flush();
    }

    public static final class Batch {

        private final JdbcTemplate jdbcTemplate;
        private final Map<StatsKey, StatsAgg> stats = new HashMap<>();
        private final Map<StatusKey, Long> statusCounts = new HashMap<>();

        private Batch(JdbcTemplate jdbcTemplate) {
            this.jdbcTemplate = jdbcTemplate;
        }

        public void recordDelta(
                AnalyticsDeltaMessage delta, UUID endpointId, ServiceHierarchy hierarchy) {
            Instant minute = delta.minuteBucket().truncatedTo(ChronoUnit.MINUTES);
            Instant hour = minute.truncatedTo(ChronoUnit.HOURS);
            Instant day = minute.truncatedTo(ChronoUnit.DAYS);

            accumulate(
                    "analytics_endpoint_stats_minute",
                    "endpoint_id",
                    minute,
                    endpointId,
                    delta);
            accumulate(
                    "analytics_endpoint_stats_hour",
                    "endpoint_id",
                    hour,
                    endpointId,
                    delta);
            accumulate(
                    "analytics_endpoint_stats_day",
                    "endpoint_id",
                    day,
                    endpointId,
                    delta);

            accumulate(
                    "analytics_service_stats_minute",
                    "service_id",
                    minute,
                    delta.serviceId(),
                    delta);
            accumulate(
                    "analytics_service_stats_hour",
                    "service_id",
                    hour,
                    delta.serviceId(),
                    delta);
            accumulate(
                    "analytics_service_stats_day",
                    "service_id",
                    day,
                    delta.serviceId(),
                    delta);

            accumulate(
                    "analytics_product_stats_minute",
                    "product_id",
                    minute,
                    hierarchy.productId(),
                    delta);
            accumulate(
                    "analytics_product_stats_hour",
                    "product_id",
                    hour,
                    hierarchy.productId(),
                    delta);
            accumulate(
                    "analytics_product_stats_day",
                    "product_id",
                    day,
                    hierarchy.productId(),
                    delta);

            accumulate(
                    "analytics_tenant_stats_minute",
                    "tenant_id",
                    minute,
                    hierarchy.tenantId(),
                    delta);
            accumulate(
                    "analytics_tenant_stats_hour",
                    "tenant_id",
                    hour,
                    hierarchy.tenantId(),
                    delta);
            accumulate(
                    "analytics_tenant_stats_day",
                    "tenant_id",
                    day,
                    hierarchy.tenantId(),
                    delta);

            if (delta.statusCounts() != null) {
                for (StatusCount sc : delta.statusCounts()) {
                    statusCounts.merge(
                            new StatusKey(minute, endpointId, sc.statusCode()),
                            sc.count(),
                            Long::sum);
                }
            }
        }

        public void flush() {
            Map<String, List<Map.Entry<StatsKey, StatsAgg>>> byTable = new HashMap<>();
            for (Map.Entry<StatsKey, StatsAgg> entry : stats.entrySet()) {
                byTable
                        .computeIfAbsent(entry.getKey().table(), ignored -> new ArrayList<>())
                        .add(entry);
            }
            for (Map.Entry<String, List<Map.Entry<StatsKey, StatsAgg>>> tableEntries :
                    byTable.entrySet()) {
                List<Map.Entry<StatsKey, StatsAgg>> rows = tableEntries.getValue();
                if (rows.isEmpty()) {
                    continue;
                }
                StatsKey sample = rows.getFirst().getKey();
                String sql = statsUpsertSql(sample.table(), sample.grainColumn());
                jdbcTemplate.batchUpdate(sql, rows, rows.size(), (ps, entry) -> bindStats(ps, entry));
            }

            if (!statusCounts.isEmpty()) {
                List<Map.Entry<StatusKey, Long>> statusRows =
                        new ArrayList<>(statusCounts.entrySet());
                jdbcTemplate.batchUpdate(
                        STATUS_UPSERT_SQL,
                        statusRows,
                        statusRows.size(),
                        (ps, entry) -> {
                            StatusKey key = entry.getKey();
                            ps.setTimestamp(1, Timestamp.from(key.bucketStart()));
                            ps.setObject(2, key.endpointId());
                            ps.setInt(3, key.statusCode());
                            ps.setLong(4, entry.getValue());
                        });
            }

            stats.clear();
            statusCounts.clear();
        }

        private void accumulate(
                String table,
                String grainColumn,
                Instant bucketStart,
                UUID grainId,
                AnalyticsDeltaMessage delta) {
            StatsKey key = new StatsKey(table, grainColumn, bucketStart, grainId);
            stats.compute(key, (k, existing) -> {
                StatsAgg agg = existing != null ? existing : new StatsAgg();
                long prevCount = agg.requestCount;
                agg.requestCount += delta.requestCount();
                agg.errorCount += delta.errorCount();
                agg.status2xx += delta.status2xx();
                agg.status3xx += delta.status3xx();
                agg.status4xx += delta.status4xx();
                agg.status5xx += delta.status5xx();
                agg.latencySumMs += delta.latencySumMs();
                agg.latencyMinMs = Math.min(agg.latencyMinMs, delta.latencyMinMs());
                agg.latencyMaxMs = Math.max(agg.latencyMaxMs, delta.latencyMaxMs());
                long avgLatency = delta.requestCount() > 0
                        ? delta.latencySumMs() / delta.requestCount()
                        : 0;
                if (agg.requestCount > 0) {
                    agg.latencyP50Ms =
                            ((agg.latencyP50Ms * prevCount) + (avgLatency * delta.requestCount()))
                                    / agg.requestCount;
                }
                agg.latencyP95Ms = Math.max(agg.latencyP95Ms, delta.latencyMaxMs());
                agg.latencyP99Ms = Math.max(agg.latencyP99Ms, delta.latencyMaxMs());
                agg.requestBytesTotal += delta.requestBytesTotal();
                agg.responseBytesTotal += delta.responseBytesTotal();
                return agg;
            });
        }

        private static String statsUpsertSql(String table, String grainColumn) {
            return """
                    INSERT INTO %s (
                        bucket_start, %s,
                        request_count, error_count,
                        status_2xx, status_3xx, status_4xx, status_5xx,
                        latency_sum_ms, latency_min_ms, latency_max_ms,
                        latency_p50_ms, latency_p95_ms, latency_p99_ms,
                        request_bytes_total, response_bytes_total
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT (bucket_start, %s) DO UPDATE SET
                        request_count = %s.request_count + EXCLUDED.request_count,
                        error_count = %s.error_count + EXCLUDED.error_count,
                        status_2xx = %s.status_2xx + EXCLUDED.status_2xx,
                        status_3xx = %s.status_3xx + EXCLUDED.status_3xx,
                        status_4xx = %s.status_4xx + EXCLUDED.status_4xx,
                        status_5xx = %s.status_5xx + EXCLUDED.status_5xx,
                        latency_sum_ms = %s.latency_sum_ms + EXCLUDED.latency_sum_ms,
                        latency_min_ms = LEAST(%s.latency_min_ms, EXCLUDED.latency_min_ms),
                        latency_max_ms = GREATEST(%s.latency_max_ms, EXCLUDED.latency_max_ms),
                        latency_p50_ms = ((%s.latency_p50_ms * %s.request_count)
                            + (EXCLUDED.latency_p50_ms * EXCLUDED.request_count))
                            / (%s.request_count + EXCLUDED.request_count),
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
        }

        private static void bindStats(PreparedStatement ps, Map.Entry<StatsKey, StatsAgg> entry)
                throws SQLException {
            StatsKey key = entry.getKey();
            StatsAgg agg = entry.getValue();
            ps.setTimestamp(1, Timestamp.from(key.bucketStart()));
            ps.setObject(2, key.grainId());
            ps.setLong(3, agg.requestCount);
            ps.setLong(4, agg.errorCount);
            ps.setLong(5, agg.status2xx);
            ps.setLong(6, agg.status3xx);
            ps.setLong(7, agg.status4xx);
            ps.setLong(8, agg.status5xx);
            ps.setLong(9, agg.latencySumMs);
            ps.setLong(10, agg.latencyMinMs);
            ps.setLong(11, agg.latencyMaxMs);
            ps.setLong(12, agg.latencyP50Ms);
            ps.setLong(13, agg.latencyP95Ms);
            ps.setLong(14, agg.latencyP99Ms);
            ps.setLong(15, agg.requestBytesTotal);
            ps.setLong(16, agg.responseBytesTotal);
        }

        private static final String STATUS_UPSERT_SQL =
                """
                INSERT INTO analytics_endpoint_status_metrics (
                    bucket_start, endpoint_id, status_code, request_count
                ) VALUES (?, ?, ?, ?)
                ON CONFLICT (bucket_start, endpoint_id, status_code)
                DO UPDATE SET request_count =
                    analytics_endpoint_status_metrics.request_count + EXCLUDED.request_count
                """;
    }

    private record StatsKey(String table, String grainColumn, Instant bucketStart, UUID grainId) {}

    private record StatusKey(Instant bucketStart, UUID endpointId, int statusCode) {}

    private static final class StatsAgg {
        long requestCount;
        long errorCount;
        long status2xx;
        long status3xx;
        long status4xx;
        long status5xx;
        long latencySumMs;
        long latencyMinMs = Long.MAX_VALUE;
        long latencyMaxMs;
        long latencyP50Ms;
        long latencyP95Ms;
        long latencyP99Ms;
        long requestBytesTotal;
        long responseBytesTotal;
    }
}
