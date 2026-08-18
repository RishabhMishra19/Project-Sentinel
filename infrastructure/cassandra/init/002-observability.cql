USE sentinel;

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

CREATE TABLE IF NOT EXISTS request_logs (
    service_id uuid,
    id uuid,

    endpoint_id uuid,

    request_id text,
    trace_id text,

    occurred_at timestamp,

    end_user_ip text,
    user_id text,

    status_code int,
    duration_ms int,

    request_size_bytes int,
    response_size_bytes int,

    received_at timestamp,

    PRIMARY KEY (
        service_id,
        id
    )
)
WITH CLUSTERING ORDER BY (
    occurred_at DESC,
    id DESC
);