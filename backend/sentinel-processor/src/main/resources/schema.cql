--liquibase formatted sql

-- ============================================================
-- MODULE: OBSERVABILITY DATA STRUCTURES
-- DESCRIPTION: Tracks endpoints, quick lookup mappings, and request logs.
-- ============================================================

--changeset sentinel-team:001_create_endpoints_table
--comment: Main table for fetching endpoint details by serviceId with cursor-based pagination.
CREATE TABLE IF NOT EXISTS endpoints (
                                         service_id uuid,
                                         id uuid,
                                         method text,
                                         path_template text,
                                         first_seen_at timestamp,
                                         last_seen_at timestamp,
                                         PRIMARY KEY (service_id, id)
);
--rollback DROP TABLE endpoints;

--changeset sentinel-team:001_create_endpoint_lookup_table
--comment: Highly efficient lookup table for O(1) direct queries by serviceId, method, and template.
CREATE TABLE IF NOT EXISTS endpoint_lookup (
                                               service_id uuid,
                                               method text,
                                               path_template text,
                                               endpoint_id uuid,
                                               PRIMARY KEY ((service_id), method, path_template)
);
--rollback DROP TABLE endpoint_lookup;

--changeset sentinel-team:001_create_request_logs_table
--comment: Main time-series ledger capturing full incoming traffic payloads ordered by time descendancy.
CREATE TABLE IF NOT EXISTS request_logs (
                                            tenant_id uuid,
                                            service_id uuid,
                                            occurred_at timestamp,
                                            id uuid,
                                            endpoint_id uuid,
                                            request_id text,
                                            trace_id text,
                                            end_user_ip text,
                                            user_id text,
                                            status_code int,
                                            duration_ms int,
                                            request_size_bytes int,
                                            response_size_bytes int,
                                            PRIMARY KEY ((tenant_id, service_id), occurred_at, id)
) WITH CLUSTERING ORDER BY (occurred_at DESC, id DESC);
--rollback DROP TABLE request_logs;

--changeset sentinel-team:001_create_request_logs_lookup_by_id_table
--comment: O(1) point-lookup table allowing direct inspection of an isolated log by its absolute ID.
CREATE TABLE IF NOT EXISTS request_logs_lookup_by_id (
                                                         id uuid,
                                                         occurred_at timestamp,
                                                         PRIMARY KEY (id)
);
--rollback DROP TABLE request_logs_lookup_by_id;

--liquibase formatted sql

-- ============================================================
-- MODULE: METRIC ROLLUPS & TIME-SERIES STATS
-- DESCRIPTION: Holds aggregated performance metrics across dimensions.
-- ============================================================

-- ============================================================
-- Endpoint statistics
-- ============================================================

--changeset sentinel-team:002_create_analytics_endpoint_stats_minute
--comment: Aggregated operational analytics on endpoints grouped into 1-minute time windows.
CREATE TABLE IF NOT EXISTS analytics_endpoint_stats_minute (
                                                               endpoint_id uuid,
                                                               bucket_start timestamp,
                                                               request_count bigint,
                                                               error_count bigint,
                                                               status_2xx bigint,
                                                               status_3xx bigint,
                                                               status_4xx bigint,
                                                               status_5xx bigint,
                                                               latency_sum_ms bigint,
                                                               latency_min_ms bigint,
                                                               latency_max_ms bigint,
                                                               latency_p50_ms bigint,
                                                               latency_p95_ms bigint,
                                                               latency_p99_ms bigint,
                                                               request_bytes_total bigint,
                                                               response_bytes_total bigint,
                                                               PRIMARY KEY (endpoint_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_endpoint_stats_minute;

--changeset sentinel-team:002_create_analytics_endpoint_stats_hour
--comment: Aggregated operational analytics on endpoints grouped into 1-hour time windows.
CREATE TABLE IF NOT EXISTS analytics_endpoint_stats_hour (
                                                             endpoint_id uuid,
                                                             bucket_start timestamp,
                                                             request_count bigint,
                                                             error_count bigint,
                                                             status_2xx bigint,
                                                             status_3xx bigint,
                                                             status_4xx bigint,
                                                             status_5xx bigint,
                                                             latency_sum_ms bigint,
                                                             latency_min_ms bigint,
                                                             latency_max_ms bigint,
                                                             latency_p50_ms bigint,
                                                             latency_p95_ms bigint,
                                                             latency_p99_ms bigint,
                                                             request_bytes_total bigint,
                                                             response_bytes_total bigint,
                                                             PRIMARY KEY (endpoint_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_endpoint_stats_hour;

--changeset sentinel-team:002_create_analytics_endpoint_stats_day
--comment: Aggregated operational analytics on endpoints grouped into 1-day time windows.
CREATE TABLE IF NOT EXISTS analytics_endpoint_stats_day (
                                                            endpoint_id uuid,
                                                            bucket_start timestamp,
                                                            request_count bigint,
                                                            error_count bigint,
                                                            status_2xx bigint,
                                                            status_3xx bigint,
                                                            status_4xx bigint,
                                                            status_5xx bigint,
                                                            latency_sum_ms bigint,
                                                            latency_min_ms bigint,
                                                            latency_max_ms bigint,
                                                            latency_p50_ms bigint,
                                                            latency_p95_ms bigint,
                                                            latency_p99_ms bigint,
                                                            request_bytes_total bigint,
                                                            response_bytes_total bigint,
                                                            PRIMARY KEY (endpoint_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_endpoint_stats_day;


-- ============================================================
-- Product statistics
-- ============================================================

--changeset sentinel-team:002_create_analytics_product_stats_minute
--comment: Aggregated operational analytics on products grouped into 1-minute time windows.
CREATE TABLE IF NOT EXISTS analytics_product_stats_minute (
                                                              product_id uuid,
                                                              bucket_start timestamp,
                                                              request_count bigint,
                                                              error_count bigint,
                                                              status_2xx bigint,
                                                              status_3xx bigint,
                                                              status_4xx bigint,
                                                              status_5xx bigint,
                                                              latency_sum_ms bigint,
                                                              latency_min_ms bigint,
                                                              latency_max_ms bigint,
                                                              latency_p50_ms bigint,
                                                              latency_p95_ms bigint,
                                                              latency_p99_ms bigint,
                                                              request_bytes_total bigint,
                                                              response_bytes_total bigint,
                                                              PRIMARY KEY (product_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_product_stats_minute;

--changeset sentinel-team:002_create_analytics_product_stats_hour
--comment: Aggregated operational analytics on products grouped into 1-hour time windows.
CREATE TABLE IF NOT EXISTS analytics_product_stats_hour (
                                                            product_id uuid,
                                                            bucket_start timestamp,
                                                            request_count bigint,
                                                            error_count bigint,
                                                            status_2xx bigint,
                                                            status_3xx bigint,
                                                            status_4xx bigint,
                                                            status_5xx bigint,
                                                            latency_sum_ms bigint,
                                                            latency_min_ms bigint,
                                                            latency_max_ms bigint,
                                                            latency_p50_ms bigint,
                                                            latency_p95_ms bigint,
                                                            latency_p99_ms bigint,
                                                            request_bytes_total bigint,
                                                            response_bytes_total bigint,
                                                            PRIMARY KEY (product_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_product_stats_hour;

--changeset sentinel-team:002_create_analytics_product_stats_day
--comment: Aggregated operational analytics on products grouped into 1-day time windows.
CREATE TABLE IF NOT EXISTS analytics_product_stats_day (
                                                           product_id uuid,
                                                           bucket_start timestamp,
                                                           request_count bigint,
                                                           error_count bigint,
                                                           status_2xx bigint,
                                                           status_3xx bigint,
                                                           status_4xx bigint,
                                                           status_5xx bigint,
                                                           latency_sum_ms bigint,
                                                           latency_min_ms bigint,
                                                           latency_max_ms bigint,
                                                           latency_p50_ms bigint,
                                                           latency_p95_ms bigint,
                                                           latency_p99_ms bigint,
                                                           request_bytes_total bigint,
                                                           response_bytes_total bigint,
                                                           PRIMARY KEY (product_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_product_stats_day;


-- ============================================================
-- Service statistics
-- ============================================================

--changeset sentinel-team:002_create_analytics_service_stats_minute
--comment: Aggregated operational analytics on services grouped into 1-minute time windows.
CREATE TABLE IF NOT EXISTS analytics_service_stats_minute (
                                                              service_id uuid,
                                                              bucket_start timestamp,
                                                              request_count bigint,
                                                              error_count bigint,
                                                              status_2xx bigint,
                                                              status_3xx bigint,
                                                              status_4xx bigint,
                                                              status_5xx bigint,
                                                              latency_sum_ms bigint,
                                                              latency_min_ms bigint,
                                                              latency_max_ms bigint,
                                                              latency_p50_ms bigint,
                                                              latency_p95_ms bigint,
                                                              latency_p99_ms bigint,
                                                              request_bytes_total bigint,
                                                              response_bytes_total bigint,
                                                              PRIMARY KEY (service_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_service_stats_minute;

--changeset sentinel-team:002_create_analytics_service_stats_hour
--comment: Aggregated operational analytics on services grouped into 1-hour time windows.
CREATE TABLE IF NOT EXISTS analytics_service_stats_hour (
                                                            service_id uuid,
                                                            bucket_start timestamp,
                                                            request_count bigint,
                                                            error_count bigint,
                                                            status_2xx bigint,
                                                            status_3xx bigint,
                                                            status_4xx bigint,
                                                            status_5xx bigint,
                                                            latency_sum_ms bigint,
                                                            latency_min_ms bigint,
                                                            latency_max_ms bigint,
                                                            latency_p50_ms bigint,
                                                            latency_p95_ms bigint,
                                                            latency_p99_ms bigint,
                                                            request_bytes_total bigint,
                                                            response_bytes_total bigint,
                                                            PRIMARY KEY (service_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_service_stats_hour;

--changeset sentinel-team:002_create_analytics_service_stats_day
--comment: Aggregated operational analytics on services grouped into 1-day time windows.
CREATE TABLE IF NOT EXISTS analytics_service_stats_day (
                                                           service_id uuid,
                                                           bucket_start timestamp,
                                                           request_count bigint,
                                                           error_count bigint,
                                                           status_2xx bigint,
                                                           status_3xx bigint,
                                                           status_4xx bigint,
                                                           status_5xx bigint,
                                                           latency_sum_ms bigint,
                                                           latency_min_ms bigint,
                                                           latency_max_ms bigint,
                                                           latency_p50_ms bigint,
                                                           latency_p95_ms bigint,
                                                           latency_p99_ms bigint,
                                                           request_bytes_total bigint,
                                                           response_bytes_total bigint,
                                                           PRIMARY KEY (service_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_service_stats_day;


-- ============================================================
-- Tenant statistics
-- ============================================================

--changeset sentinel-team:002_create_analytics_tenant_stats_minute
--comment: Aggregated operational analytics on tenants grouped into 1-minute time windows.
CREATE TABLE IF NOT EXISTS analytics_tenant_stats_minute (
                                                             tenant_id uuid,
                                                             bucket_start timestamp,
                                                             request_count bigint,
                                                             error_count bigint,
                                                             status_2xx bigint,
                                                             status_3xx bigint,
                                                             status_4xx bigint,
                                                             status_5xx bigint,
                                                             latency_sum_ms bigint,
                                                             latency_min_ms bigint,
                                                             latency_max_ms bigint,
                                                             latency_p50_ms bigint,
                                                             latency_p95_ms bigint,
                                                             latency_p99_ms bigint,
                                                             request_bytes_total bigint,
                                                             response_bytes_total bigint,
                                                             PRIMARY KEY (tenant_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_tenant_stats_minute;

--changeset sentinel-team:002_create_analytics_tenant_stats_hour
--comment: Aggregated operational analytics on tenants grouped into 1-hour time windows.
CREATE TABLE IF NOT EXISTS analytics_tenant_stats_hour (
                                                           tenant_id uuid,
                                                           bucket_start timestamp,
                                                           request_count bigint,
                                                           error_count bigint,
                                                           status_2xx bigint,
                                                           status_3xx bigint,
                                                           status_4xx bigint,
                                                           status_5xx bigint,
                                                           latency_sum_ms bigint,
                                                           latency_min_ms bigint,
                                                           latency_max_ms bigint,
                                                           latency_p50_ms bigint,
                                                           latency_p95_ms bigint,
                                                           latency_p99_ms bigint,
                                                           request_bytes_total bigint,
                                                           response_bytes_total bigint,
                                                           PRIMARY KEY (tenant_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_tenant_stats_hour;

--changeset sentinel-team:002_create_analytics_tenant_stats_day
--comment: Aggregated operational analytics on tenants grouped into 1-day time windows.
CREATE TABLE IF NOT EXISTS analytics_tenant_stats_day (
                                                          tenant_id uuid,
                                                          bucket_start timestamp,
                                                          request_count bigint,
                                                          error_count bigint,
                                                          status_2xx bigint,
                                                          status_3xx bigint,
                                                          status_4xx bigint,
                                                          status_5xx bigint,
                                                          latency_sum_ms bigint,
                                                          latency_min_ms bigint,
                                                          latency_max_ms bigint,
                                                          latency_p50_ms bigint,
                                                          latency_p95_ms bigint,
                                                          latency_p99_ms bigint,
                                                          request_bytes_total bigint,
                                                          response_bytes_total bigint,
                                                          PRIMARY KEY (tenant_id, bucket_start)
) WITH CLUSTERING ORDER BY (bucket_start DESC);
--rollback DROP TABLE analytics_tenant_stats_day;
