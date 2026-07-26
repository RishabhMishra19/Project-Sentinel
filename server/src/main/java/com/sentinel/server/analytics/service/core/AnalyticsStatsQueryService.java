package com.sentinel.server.analytics.service.core;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsStatsQueryService {

    public static final long ERROR_RATE_MIN_REQUESTS = 100L;

    private final NamedParameterJdbcTemplate jdbc;

    public AnalyticsMetricsAggregate summarize(
            AnalyticsScope scope, UUID grainId, Instant from, Instant to, AnalyticsBucket bucket) {
        String table = statsTable(scope, bucket);
        String grainCol = grainColumn(scope);
        String sql =
                """
                SELECT
                  NULL::timestamptz AS bucket_start,
                  :grainId AS grain_id,
                  NULL::text AS name,
                  NULL::text AS method,
                  NULL::text AS path_template,
                  COALESCE(SUM(request_count), 0) AS request_count,
                  COALESCE(SUM(error_count), 0) AS error_count,
                  COALESCE(SUM(status_2xx), 0) AS status_2xx,
                  COALESCE(SUM(status_3xx), 0) AS status_3xx,
                  COALESCE(SUM(status_4xx), 0) AS status_4xx,
                  COALESCE(SUM(status_5xx), 0) AS status_5xx,
                  COALESCE(SUM(latency_sum_ms), 0) AS latency_sum_ms,
                  MIN(latency_min_ms) AS latency_min_ms,
                  MAX(latency_max_ms) AS latency_max_ms,
                  CASE WHEN SUM(request_count) > 0
                    THEN ROUND(SUM(latency_p50_ms::numeric * request_count) / SUM(request_count))::int
                    ELSE NULL END AS latency_p50_ms,
                  CASE WHEN SUM(request_count) > 0
                    THEN ROUND(SUM(latency_p95_ms::numeric * request_count) / SUM(request_count))::int
                    ELSE NULL END AS latency_p95_ms,
                  CASE WHEN SUM(request_count) > 0
                    THEN ROUND(SUM(latency_p99_ms::numeric * request_count) / SUM(request_count))::int
                    ELSE NULL END AS latency_p99_ms,
                  COALESCE(SUM(request_bytes_total), 0) AS request_bytes_total,
                  COALESCE(SUM(response_bytes_total), 0) AS response_bytes_total
                FROM %s
                WHERE %s = :grainId
                  AND bucket_start >= :from
                  AND bucket_start < :to
                """
                        .formatted(table, grainCol);

        Map<String, Object> params = Map.of("grainId", grainId, "from", Timestamp.from(from), "to", Timestamp.from(to));
        List<AnalyticsMetricsAggregate> rows = jdbc.query(sql, params, this::mapAggregate);
        return rows.isEmpty() ? emptyAggregate(grainId) : rows.getFirst();
    }

    public List<AnalyticsMetricsAggregate> timeseries(
            AnalyticsScope scope, UUID grainId, Instant from, Instant to, AnalyticsBucket bucket) {
        String table = statsTable(scope, bucket);
        String grainCol = grainColumn(scope);
        String sql =
                """
                SELECT
                  bucket_start,
                  :grainId AS grain_id,
                  NULL::text AS name,
                  NULL::text AS method,
                  NULL::text AS path_template,
                  request_count,
                  error_count,
                  status_2xx,
                  status_3xx,
                  status_4xx,
                  status_5xx,
                  latency_sum_ms,
                  latency_min_ms,
                  latency_max_ms,
                  latency_p50_ms,
                  latency_p95_ms,
                  latency_p99_ms,
                  request_bytes_total,
                  response_bytes_total
                FROM %s
                WHERE %s = :grainId
                  AND bucket_start >= :from
                  AND bucket_start < :to
                ORDER BY bucket_start ASC
                """
                        .formatted(table, grainCol);

        Map<String, Object> params = Map.of("grainId", grainId, "from", Timestamp.from(from), "to", Timestamp.from(to));
        return jdbc.query(sql, params, this::mapAggregate);
    }

    public List<AnalyticsMetricsAggregate> rankings(
            AnalyticsScope parentScope,
            UUID parentId,
            UUID tenantId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable) {
        return switch (parentScope) {
            case TENANT -> rankProducts(tenantId, from, to, bucket, sortBy, pageable);
            case PRODUCT -> rankServices(parentId, tenantId, from, to, bucket, sortBy, pageable);
            case SERVICE -> rankEndpoints(parentId, tenantId, from, to, bucket, sortBy, pageable);
            case ENDPOINT -> List.of();
        };
    }

    public long rankingsCount(
            AnalyticsScope parentScope, UUID parentId, UUID tenantId, Instant from, Instant to, AnalyticsBucket bucket) {
        return switch (parentScope) {
            case TENANT -> countRankedProducts(tenantId, from, to, bucket);
            case PRODUCT -> countRankedServices(parentId, tenantId, from, to, bucket);
            case SERVICE -> countRankedEndpoints(parentId, tenantId, from, to, bucket);
            case ENDPOINT -> 0L;
        };
    }

    public long countActiveEndpoints(UUID tenantId, Instant from, Instant to) {
        String sql =
                """
                SELECT COUNT(DISTINCT e.id)
                FROM endpoints e
                JOIN services s ON s.id = e.service_id
                JOIN products p ON p.id = s.product_id
                WHERE p.tenant_id = :tenantId
                  AND e.last_seen_at >= :from
                  AND e.last_seen_at < :to
                """;
        Map<String, Object> params = Map.of("tenantId", tenantId, "from", Timestamp.from(from), "to", Timestamp.from(to));
        Long count = jdbc.queryForObject(sql, params, Long.class);
        return count == null ? 0L : count;
    }

    public List<StatusCount> statusBreakdown(UUID endpointId, UUID tenantId, Instant from, Instant to) {
        String sql =
                """
                SELECT m.status_code, COALESCE(SUM(m.request_count), 0) AS request_count
                FROM analytics_endpoint_status_metrics m
                JOIN endpoints e ON e.id = m.endpoint_id
                JOIN services s ON s.id = e.service_id
                JOIN products p ON p.id = s.product_id
                WHERE m.endpoint_id = :endpointId
                  AND p.tenant_id = :tenantId
                  AND m.bucket_start >= :from
                  AND m.bucket_start < :to
                GROUP BY m.status_code
                ORDER BY m.status_code
                """;
        Map<String, Object> params =
                Map.of(
                        "endpointId",
                        endpointId,
                        "tenantId",
                        tenantId,
                        "from",
                        Timestamp.from(from),
                        "to",
                        Timestamp.from(to));
        return jdbc.query(
                sql,
                params,
                (rs, rowNum) -> new StatusCount(rs.getInt("status_code"), rs.getLong("request_count")));
    }

    public List<ExceptionCount> exceptionBreakdown(UUID endpointId, UUID tenantId, Instant from, Instant to) {
        String sql =
                """
                SELECT m.exception_type, COALESCE(SUM(m.exception_count), 0) AS exception_count
                FROM analytics_endpoint_exception_metrics m
                JOIN endpoints e ON e.id = m.endpoint_id
                JOIN services s ON s.id = e.service_id
                JOIN products p ON p.id = s.product_id
                WHERE m.endpoint_id = :endpointId
                  AND p.tenant_id = :tenantId
                  AND m.bucket_start >= :from
                  AND m.bucket_start < :to
                GROUP BY m.exception_type
                ORDER BY exception_count DESC
                """;
        Map<String, Object> params =
                Map.of(
                        "endpointId",
                        endpointId,
                        "tenantId",
                        tenantId,
                        "from",
                        Timestamp.from(from),
                        "to",
                        Timestamp.from(to));
        return jdbc.query(
                sql,
                params,
                (rs, rowNum) -> new ExceptionCount(rs.getString("exception_type"), rs.getLong("exception_count")));
    }

    private List<AnalyticsMetricsAggregate> rankProducts(
            UUID tenantId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable) {
        String table = statsTable(AnalyticsScope.PRODUCT, bucket);
        String order = orderBy(sortBy);
        String sql =
                """
                SELECT
                  NULL::timestamptz AS bucket_start,
                  p.id AS grain_id,
                  p.name AS name,
                  NULL::text AS method,
                  NULL::text AS path_template,
                  COALESCE(SUM(st.request_count), 0) AS request_count,
                  COALESCE(SUM(st.error_count), 0) AS error_count,
                  COALESCE(SUM(st.status_2xx), 0) AS status_2xx,
                  COALESCE(SUM(st.status_3xx), 0) AS status_3xx,
                  COALESCE(SUM(st.status_4xx), 0) AS status_4xx,
                  COALESCE(SUM(st.status_5xx), 0) AS status_5xx,
                  COALESCE(SUM(st.latency_sum_ms), 0) AS latency_sum_ms,
                  MIN(st.latency_min_ms) AS latency_min_ms,
                  MAX(st.latency_max_ms) AS latency_max_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p50_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p50_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p95_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p95_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p99_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p99_ms,
                  COALESCE(SUM(st.request_bytes_total), 0) AS request_bytes_total,
                  COALESCE(SUM(st.response_bytes_total), 0) AS response_bytes_total
                FROM products p
                LEFT JOIN %s st ON st.product_id = p.id
                  AND st.bucket_start >= :from
                  AND st.bucket_start < :to
                WHERE p.tenant_id = :tenantId
                GROUP BY p.id, p.name
                HAVING COALESCE(SUM(st.request_count), 0) > 0
                ORDER BY %s
                LIMIT :limit OFFSET :offset
                """
                        .formatted(table, order);
        Map<String, Object> params = pageParams(tenantId, from, to, pageable);
        return jdbc.query(sql, params, this::mapAggregate);
    }

    private long countRankedProducts(UUID tenantId, Instant from, Instant to, AnalyticsBucket bucket) {
        String table = statsTable(AnalyticsScope.PRODUCT, bucket);
        String sql =
                """
                SELECT COUNT(*) FROM (
                  SELECT p.id
                  FROM products p
                  LEFT JOIN %s st ON st.product_id = p.id
                    AND st.bucket_start >= :from
                    AND st.bucket_start < :to
                  WHERE p.tenant_id = :tenantId
                  GROUP BY p.id
                  HAVING COALESCE(SUM(st.request_count), 0) > 0
                ) x
                """
                        .formatted(table);
        Long count =
                jdbc.queryForObject(
                        sql,
                        Map.of("tenantId", tenantId, "from", Timestamp.from(from), "to", Timestamp.from(to)),
                        Long.class);
        return count == null ? 0L : count;
    }

    private List<AnalyticsMetricsAggregate> rankServices(
            UUID productId,
            UUID tenantId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable) {
        String table = statsTable(AnalyticsScope.SERVICE, bucket);
        String order = orderBy(sortBy);
        String sql =
                """
                SELECT
                  NULL::timestamptz AS bucket_start,
                  s.id AS grain_id,
                  s.name AS name,
                  NULL::text AS method,
                  NULL::text AS path_template,
                  COALESCE(SUM(st.request_count), 0) AS request_count,
                  COALESCE(SUM(st.error_count), 0) AS error_count,
                  COALESCE(SUM(st.status_2xx), 0) AS status_2xx,
                  COALESCE(SUM(st.status_3xx), 0) AS status_3xx,
                  COALESCE(SUM(st.status_4xx), 0) AS status_4xx,
                  COALESCE(SUM(st.status_5xx), 0) AS status_5xx,
                  COALESCE(SUM(st.latency_sum_ms), 0) AS latency_sum_ms,
                  MIN(st.latency_min_ms) AS latency_min_ms,
                  MAX(st.latency_max_ms) AS latency_max_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p50_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p50_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p95_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p95_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p99_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p99_ms,
                  COALESCE(SUM(st.request_bytes_total), 0) AS request_bytes_total,
                  COALESCE(SUM(st.response_bytes_total), 0) AS response_bytes_total
                FROM services s
                JOIN products p ON p.id = s.product_id
                LEFT JOIN %s st ON st.service_id = s.id
                  AND st.bucket_start >= :from
                  AND st.bucket_start < :to
                WHERE s.product_id = :productId
                  AND p.tenant_id = :tenantId
                GROUP BY s.id, s.name
                HAVING COALESCE(SUM(st.request_count), 0) > 0
                ORDER BY %s
                LIMIT :limit OFFSET :offset
                """
                        .formatted(table, order);
        Map<String, Object> params = pageParams(tenantId, from, to, pageable);
        params.put("productId", productId);
        return jdbc.query(sql, params, this::mapAggregate);
    }

    private long countRankedServices(UUID productId, UUID tenantId, Instant from, Instant to, AnalyticsBucket bucket) {
        String table = statsTable(AnalyticsScope.SERVICE, bucket);
        String sql =
                """
                SELECT COUNT(*) FROM (
                  SELECT s.id
                  FROM services s
                  JOIN products p ON p.id = s.product_id
                  LEFT JOIN %s st ON st.service_id = s.id
                    AND st.bucket_start >= :from
                    AND st.bucket_start < :to
                  WHERE s.product_id = :productId
                    AND p.tenant_id = :tenantId
                  GROUP BY s.id
                  HAVING COALESCE(SUM(st.request_count), 0) > 0
                ) x
                """
                        .formatted(table);
        Long count =
                jdbc.queryForObject(
                        sql,
                        Map.of(
                                "productId",
                                productId,
                                "tenantId",
                                tenantId,
                                "from",
                                Timestamp.from(from),
                                "to",
                                Timestamp.from(to)),
                        Long.class);
        return count == null ? 0L : count;
    }

    private List<AnalyticsMetricsAggregate> rankEndpoints(
            UUID serviceId,
            UUID tenantId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable) {
        String table = statsTable(AnalyticsScope.ENDPOINT, bucket);
        String order = orderBy(sortBy);
        String sql =
                """
                SELECT
                  NULL::timestamptz AS bucket_start,
                  e.id AS grain_id,
                  NULL::text AS name,
                  e.method AS method,
                  e.path_template AS path_template,
                  COALESCE(SUM(st.request_count), 0) AS request_count,
                  COALESCE(SUM(st.error_count), 0) AS error_count,
                  COALESCE(SUM(st.status_2xx), 0) AS status_2xx,
                  COALESCE(SUM(st.status_3xx), 0) AS status_3xx,
                  COALESCE(SUM(st.status_4xx), 0) AS status_4xx,
                  COALESCE(SUM(st.status_5xx), 0) AS status_5xx,
                  COALESCE(SUM(st.latency_sum_ms), 0) AS latency_sum_ms,
                  MIN(st.latency_min_ms) AS latency_min_ms,
                  MAX(st.latency_max_ms) AS latency_max_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p50_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p50_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p95_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p95_ms,
                  CASE WHEN SUM(st.request_count) > 0
                    THEN ROUND(SUM(st.latency_p99_ms::numeric * st.request_count) / SUM(st.request_count))::int
                    ELSE NULL END AS latency_p99_ms,
                  COALESCE(SUM(st.request_bytes_total), 0) AS request_bytes_total,
                  COALESCE(SUM(st.response_bytes_total), 0) AS response_bytes_total
                FROM endpoints e
                JOIN services s ON s.id = e.service_id
                JOIN products p ON p.id = s.product_id
                LEFT JOIN %s st ON st.endpoint_id = e.id
                  AND st.bucket_start >= :from
                  AND st.bucket_start < :to
                WHERE e.service_id = :serviceId
                  AND p.tenant_id = :tenantId
                GROUP BY e.id, e.method, e.path_template
                HAVING COALESCE(SUM(st.request_count), 0) > 0
                ORDER BY %s
                LIMIT :limit OFFSET :offset
                """
                        .formatted(table, order);
        Map<String, Object> params = pageParams(tenantId, from, to, pageable);
        params.put("serviceId", serviceId);
        return jdbc.query(sql, params, this::mapAggregate);
    }

    private long countRankedEndpoints(UUID serviceId, UUID tenantId, Instant from, Instant to, AnalyticsBucket bucket) {
        String table = statsTable(AnalyticsScope.ENDPOINT, bucket);
        String sql =
                """
                SELECT COUNT(*) FROM (
                  SELECT e.id
                  FROM endpoints e
                  JOIN services s ON s.id = e.service_id
                  JOIN products p ON p.id = s.product_id
                  LEFT JOIN %s st ON st.endpoint_id = e.id
                    AND st.bucket_start >= :from
                    AND st.bucket_start < :to
                  WHERE e.service_id = :serviceId
                    AND p.tenant_id = :tenantId
                  GROUP BY e.id
                  HAVING COALESCE(SUM(st.request_count), 0) > 0
                ) x
                """
                        .formatted(table);
        Long count =
                jdbc.queryForObject(
                        sql,
                        Map.of(
                                "serviceId",
                                serviceId,
                                "tenantId",
                                tenantId,
                                "from",
                                Timestamp.from(from),
                                "to",
                                Timestamp.from(to)),
                        Long.class);
        return count == null ? 0L : count;
    }

    private Map<String, Object> pageParams(UUID tenantId, Instant from, Instant to, Pageable pageable) {
        Map<String, Object> params = new HashMap<>();
        params.put("tenantId", tenantId);
        params.put("from", Timestamp.from(from));
        params.put("to", Timestamp.from(to));
        params.put("limit", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        return params;
    }

    private String orderBy(AnalyticsRankingSort sortBy) {
        return switch (sortBy) {
            case TRAFFIC -> "request_count DESC";
            case ERROR_RATE ->
                    """
                    CASE WHEN request_count >= %d
                      THEN error_count::float / NULLIF(request_count, 0)
                      ELSE -1 END DESC, request_count DESC
                    """
                            .formatted(ERROR_RATE_MIN_REQUESTS);
            case P95 -> "latency_p95_ms DESC NULLS LAST, request_count DESC";
        };
    }

    private String statsTable(AnalyticsScope scope, AnalyticsBucket bucket) {
        String grain =
                switch (scope) {
                    case TENANT -> "tenant";
                    case PRODUCT -> "product";
                    case SERVICE -> "service";
                    case ENDPOINT -> "endpoint";
                };
        String suffix =
                switch (bucket) {
                    case MINUTE -> "minute";
                    case HOUR -> "hour";
                    case DAY -> "day";
                };
        return "analytics_" + grain + "_stats_" + suffix;
    }

    private String grainColumn(AnalyticsScope scope) {
        return switch (scope) {
            case TENANT -> "tenant_id";
            case PRODUCT -> "product_id";
            case SERVICE -> "service_id";
            case ENDPOINT -> "endpoint_id";
        };
    }

    private AnalyticsMetricsAggregate mapAggregate(ResultSet rs, int rowNum) throws SQLException {
        Timestamp bucketTs = rs.getTimestamp("bucket_start");
        Instant bucketStart = bucketTs == null ? null : bucketTs.toInstant();
        Object grainObj = rs.getObject("grain_id");
        UUID grainId = grainObj == null ? null : (UUID) grainObj;
        Integer min = (Integer) rs.getObject("latency_min_ms");
        Integer max = (Integer) rs.getObject("latency_max_ms");
        Integer p50 = (Integer) rs.getObject("latency_p50_ms");
        Integer p95 = (Integer) rs.getObject("latency_p95_ms");
        Integer p99 = (Integer) rs.getObject("latency_p99_ms");
        return new AnalyticsMetricsAggregate(
                bucketStart,
                grainId,
                rs.getString("name"),
                rs.getString("method"),
                rs.getString("path_template"),
                rs.getLong("request_count"),
                rs.getLong("error_count"),
                rs.getLong("status_2xx"),
                rs.getLong("status_3xx"),
                rs.getLong("status_4xx"),
                rs.getLong("status_5xx"),
                rs.getLong("latency_sum_ms"),
                min,
                max,
                p50,
                p95,
                p99,
                rs.getLong("request_bytes_total"),
                rs.getLong("response_bytes_total"));
    }

    private AnalyticsMetricsAggregate emptyAggregate(UUID grainId) {
        return new AnalyticsMetricsAggregate(
                null, grainId, null, null, null, 0, 0, 0, 0, 0, 0, 0, null, null, null, null, null, 0, 0);
    }

    public record StatusCount(int statusCode, long requestCount) {}

    public record ExceptionCount(String exceptionType, long exceptionCount) {}
}
