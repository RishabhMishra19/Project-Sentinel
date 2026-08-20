USE sentinel;

-- ============================================================
-- Endpoint statistics
-- ============================================================

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

    PRIMARY KEY (
        endpoint_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        endpoint_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        endpoint_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


-- ============================================================
-- Product statistics
-- ============================================================

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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        product_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        product_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        product_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


-- ============================================================
-- Service statistics
-- ============================================================

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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        service_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        service_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        service_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


-- ============================================================
-- Tenant statistics
-- ============================================================

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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        tenant_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        tenant_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);


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
    latency_p99_ms int,

    request_bytes_total bigint,
    response_bytes_total bigint,

    PRIMARY KEY (
        tenant_id,
        bucket_start
    )
)
WITH CLUSTERING ORDER BY (
    bucket_start DESC
);