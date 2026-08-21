package com.sentinel.common.analytics;

import com.datastax.oss.driver.api.core.cql.Row;
import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.cql.CqlTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AnalyticsRepository {

    private final CqlTemplate cqlTemplate;

    public AnalyticsStatsMetrics findStats(UUID entityId, Instant from, Instant to, AnalyticsScope scope, AnalyticsBucket bucket) {
        String tableName = AnalyticsUtils.getTableName(scope, bucket);
        String idColumnName = AnalyticsUtils.getIdColumnName(scope);
        String cql = String.format(
                """
                            SELECT
                                %s,
                                SUM(request_count) AS request_count,
                               SUM(error_count) AS error_count,
                               SUM(status_2xx) AS status_2xx,
                               SUM(status_3xx) AS status_3xx,
                               SUM(status_4xx) AS status_4xx,
                               SUM(status_5xx) AS status_5xx,
                               SUM(latency_sum_ms) AS latency_sum_ms,
                               MIN(latency_min_ms) AS latency_min_ms,
                               MAX(latency_max_ms) AS latency_max_ms,
                               SUM(latency_p50_ms * request_count) AS latency_p50_ms,
                               SUM(latency_p95_ms * request_count) AS latency_p95_ms,
                               SUM(latency_p99_ms * request_count) AS latency_p99_ms,
                               SUM(request_bytes_total) AS request_bytes_total,
                               SUM(response_bytes_total) AS response_bytes_total
                            FROM %s
                            WHERE %s = ?
                              AND bucket_start >= ?
                              AND bucket_start < ?
                        """, idColumnName, tableName, idColumnName
        );
        AnalyticsStatsMetrics statsMetrics = cqlTemplate
                .query(cql, this::analyticsRowMapper, entityId, from, to)
                .stream()
                .findFirst()
                .orElse(null);
        if (statsMetrics != null && statsMetrics.getRequestCount() > 0) {
            statsMetrics.setLatencyP50Ms(
                    (long) Math.ceil((double) statsMetrics.getLatencyP50Ms() / statsMetrics.getRequestCount()));
            statsMetrics.setLatencyP95Ms(
                    (long) Math.ceil((double) statsMetrics.getLatencyP95Ms() / statsMetrics.getRequestCount()));
            statsMetrics.setLatencyP99Ms(
                    (long) Math.ceil((double) statsMetrics.getLatencyP99Ms() / statsMetrics.getRequestCount()));
        }
        return statsMetrics;
    }

    public AnalyticsStatsMetrics analyticsRowMapper(Row row, int rowNum) {
        return AnalyticsStatsMetrics
                .builder()
                .requestCount(getLong(row, "request_count"))
                .errorCount(getLong(row, "error_count"))
                .status2xx(getLong(row, "status_2xx"))
                .status3xx(getLong(row, "status_3xx"))
                .status4xx(getLong(row, "status_4xx"))
                .status5xx(getLong(row, "status_5xx"))
                .latencySumMs(getLong(row, "latency_sum_ms"))
                .latencyMinMs(getLong(row, "latency_min_ms"))
                .latencyMaxMs(getLong(row, "latency_max_ms"))
                .latencyP50Ms(getLong(row, "latency_p50_ms"))
                .latencyP95Ms(getLong(row, "latency_p95_ms"))
                .latencyP99Ms(getLong(row, "latency_p99_ms"))
                .requestBytesTotal(getLong(row, "request_bytes_total"))
                .responseBytesTotal(getLong(row, "response_bytes_total"))
                .build();
    }

    public long getLong(Row row, String column) {
        Long value = row.get(column, Long.class);
        return value != null ? value : 0L;
    }

}
