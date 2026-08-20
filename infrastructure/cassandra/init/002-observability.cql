USE sentinel;

-- 1. Main table for fetch by service queries and cursor-based pagination
CREATE TABLE IF NOT EXISTS endpoints (
    service_id uuid,
    id uuid,

    method text,
    path_template text,
    first_seen_at timestamp,
    last_seen_at timestamp,

    PRIMARY KEY (
        service_id,
        id
    )
);

-- 2. Lookup table for O(1) direct fetching by serviceId, method and path_template alone
CREATE TABLE endpoint_lookup (
    service_id uuid,
    method text,
    path_template text,
    endpoint_id uuid,

    PRIMARY KEY ((service_id), method, path_template)
);

-- 1. Main table for time-range queries and cursor-based pagination
CREATE TABLE request_logs (
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

-- 2. Lookup table for O(1) direct fetching by request_log_id alone
CREATE TABLE request_logs_lookup_by_id (
    id uuid,
    occurred_at timestamp,
    PRIMARY KEY (id)
);