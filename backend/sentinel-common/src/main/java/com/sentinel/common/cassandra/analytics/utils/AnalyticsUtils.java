package com.sentinel.common.cassandra.analytics.utils;

import com.datastax.oss.driver.api.core.cql.Row;
import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class AnalyticsUtils {

    public static String getTableName(AnalyticsScope scope, AnalyticsBucket bucket) {
        return "analytics_" + scope.getName() + "_stats_" + bucket.getName();
    }

    public static String getIdColumnName(AnalyticsScope scope) {
        return scope.getName() + "_id";
    }

    public static String getTotalStatCql(AnalyticsScope scope, AnalyticsBucket bucket) {
        String tableName = AnalyticsUtils.getTableName(scope, bucket);
        String idColumnName = AnalyticsUtils.getIdColumnName(scope);
        return String.format(
                """
                            SELECT
                               %s as entity_id,
                               MIN(bucket_start) as bucket_start,
                               SUM(request_count) AS request_count,
                               SUM(error_count) AS error_count,
                               SUM(status_2xx) AS status_2xx,
                               SUM(status_3xx) AS status_3xx,
                               SUM(status_4xx) AS status_4xx,
                               SUM(status_5xx) AS status_5xx,
                               SUM(latency_sum_ms) AS latency_sum_ms,
                               MIN(latency_min_ms) AS latency_min_ms,
                               MAX(latency_max_ms) AS latency_max_ms,
                               SUM(latency_p50_ms * request_count) AS latency_p50_ms_weighted_sum,
                               SUM(latency_p95_ms * request_count) AS latency_p95_ms_weighted_sum,
                               SUM(latency_p99_ms * request_count) AS latency_p99_ms_weighted_sum,
                               SUM(request_bytes_total) AS request_bytes_total,
                               SUM(response_bytes_total) AS response_bytes_total
                            FROM %s
                            WHERE %s = ?
                              AND bucket_start >= ?
                              AND bucket_start < ?
                        """, idColumnName, tableName, idColumnName
        );
    }

    public static String getEntityAggregatedStatsCql(AnalyticsScope scope, AnalyticsBucket bucket) {
        String tableName = AnalyticsUtils.getTableName(scope, bucket);
        String idColumnName = AnalyticsUtils.getIdColumnName(scope);
        return String.format(
                """
                            SELECT
                               %s as entity_id,
                               MIN(bucket_start) as bucket_start,
                               SUM(request_count) AS request_count,
                               SUM(error_count) AS error_count,
                               SUM(status_2xx) AS status_2xx,
                               SUM(status_3xx) AS status_3xx,
                               SUM(status_4xx) AS status_4xx,
                               SUM(status_5xx) AS status_5xx,
                               SUM(latency_sum_ms) AS latency_sum_ms,
                               MIN(latency_min_ms) AS latency_min_ms,
                               MAX(latency_max_ms) AS latency_max_ms,
                               SUM(latency_p50_ms * request_count) AS latency_p50_ms_weighted_sum,
                               SUM(latency_p95_ms * request_count) AS latency_p95_ms_weighted_sum,
                               SUM(latency_p99_ms * request_count) AS latency_p99_ms_weighted_sum,
                               SUM(request_bytes_total) AS request_bytes_total,
                               SUM(response_bytes_total) AS response_bytes_total
                            FROM %s
                            WHERE %s IN ?
                               AND bucket_start >= ?
                               AND bucket_start < ?
                            GROUP BY %s
                        """, idColumnName, tableName, idColumnName, idColumnName
        );
    }

    public static String getTimeSeriesStatsCql(AnalyticsScope scope, AnalyticsBucket bucket) {
        String tableName = AnalyticsUtils.getTableName(scope, bucket);
        String idColumnName = AnalyticsUtils.getIdColumnName(scope);
        return String.format(
                """
                            SELECT
                               %s as entity_id,
                               bucket_start,
                               request_count,
                               error_count,
                               status_2xx,
                               status_3xx,
                               status_4xx,
                               status_5xx,
                               latency_sum_ms,
                               latency_min_ms,
                               latency_max_ms,
                               (latency_p50_ms * request_count) * 1 AS latency_p50_ms_weighted_sum,
                               (latency_p95_ms * request_count) * 1 AS latency_p95_ms_weighted_sum,
                               (latency_p99_ms * request_count) * 1 AS latency_p99_ms_weighted_sum,
                               request_bytes_total,
                               response_bytes_total
                            FROM %s
                            WHERE %s = ?
                               AND bucket_start >= ?
                               AND bucket_start < ?
                        """, idColumnName, tableName, idColumnName
        );
    }

    public static AnalyticsStatsMetrics statsMetricsRowMapper(Row row, int rowNum) {
        return AnalyticsStatsMetrics.builder()
                .entityId(getUUID(row, "entity_id"))
                .bucketStart(getInstant(row, "bucket_start"))
                .requestCount(getLong(row, "request_count"))
                .errorCount(getLong(row, "error_count"))
                .errorRate((double)getLong(row, "error_count") / (double)Math.max(1L, getLong(row, "request_count")))
                .status2xx(getLong(row, "status_2xx"))
                .status3xx(getLong(row, "status_3xx"))
                .status4xx(getLong(row, "status_4xx"))
                .status5xx(getLong(row, "status_5xx"))
                .latencySumMs(getLong(row, "latency_sum_ms"))
                .latencyMinMs(getLong(row, "latency_min_ms"))
                .latencyMaxMs(getLong(row, "latency_max_ms"))
                .latencyP50Ms(getLong(row, "latency_p50_ms_weighted_sum") / Math.max(1L, getLong(row, "request_count")))
                .latencyP95Ms(getLong(row, "latency_p95_ms_weighted_sum") / Math.max(1L, getLong(row, "request_count")))
                .latencyP99Ms(getLong(row, "latency_p99_ms_weighted_sum") / Math.max(1L, getLong(row, "request_count")))
                .requestBytesTotal(getLong(row, "request_bytes_total"))
                .responseBytesTotal(getLong(row, "response_bytes_total"))
                .build();
    }

    public static long getLong(Row row, String column) {
        Long value = row.get(column, Long.class);
        return value != null ? value : 0L;
    }

    public static UUID getUUID(Row row, String column) {
        return row.get(column, UUID.class);
    }

    public static Instant getInstant(Row row, String column) {
        return row.get(column, Instant.class);
    }

    public static AnalyticsBucket getAnalyticsBucket(Instant from, Instant to) {
        if (from.truncatedTo(ChronoUnit.DAYS)
                .isBefore(to.truncatedTo(ChronoUnit.DAYS))) {
            return AnalyticsBucket.DAY;
        }
        if (from.truncatedTo(ChronoUnit.HOURS)
                .isBefore(to.truncatedTo(ChronoUnit.HOURS))) {
            return AnalyticsBucket.HOUR;
        }
        return AnalyticsBucket.MINUTE;
    }

}
