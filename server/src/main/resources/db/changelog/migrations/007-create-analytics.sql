-- liquibase formatted sql

-- changeset sentinel:007-analytics-endpoint-stats
CREATE TABLE endpoint_stats_minute (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    endpoint_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_endpoint_stats_minute PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_endpoint_stats_minute_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_endpoint_stats_minute_endpoint_bucket ON endpoint_stats_minute (endpoint_id, bucket_start DESC);

CREATE TABLE endpoint_stats_hour (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    endpoint_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_endpoint_stats_hour PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_endpoint_stats_hour_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_endpoint_stats_hour_endpoint_bucket ON endpoint_stats_hour (endpoint_id, bucket_start DESC);

CREATE TABLE endpoint_stats_day (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    endpoint_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_endpoint_stats_day PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_endpoint_stats_day_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_endpoint_stats_day_endpoint_bucket ON endpoint_stats_day (endpoint_id, bucket_start DESC);

-- changeset sentinel:007-analytics-service-stats
CREATE TABLE service_stats_minute (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    service_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_service_stats_minute PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_service_stats_minute_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_service_stats_minute_service_bucket ON service_stats_minute (service_id, bucket_start DESC);

CREATE TABLE service_stats_hour (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    service_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_service_stats_hour PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_service_stats_hour_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_service_stats_hour_service_bucket ON service_stats_hour (service_id, bucket_start DESC);

CREATE TABLE service_stats_day (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    service_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_service_stats_day PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_service_stats_day_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_service_stats_day_service_bucket ON service_stats_day (service_id, bucket_start DESC);

-- changeset sentinel:007-analytics-product-stats
CREATE TABLE product_stats_minute (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    product_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_product_stats_minute PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_product_stats_minute_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_product_stats_minute_product_bucket ON product_stats_minute (product_id, bucket_start DESC);

CREATE TABLE product_stats_hour (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    product_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_product_stats_hour PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_product_stats_hour_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_product_stats_hour_product_bucket ON product_stats_hour (product_id, bucket_start DESC);

CREATE TABLE product_stats_day (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    product_id UUID NOT NULL,
    request_count BIGINT NOT NULL,
    error_count BIGINT NOT NULL,
    status_2xx BIGINT NOT NULL,
    status_3xx BIGINT NOT NULL,
    status_4xx BIGINT NOT NULL,
    status_5xx BIGINT NOT NULL,
    latency_sum_ms BIGINT NOT NULL,
    latency_min_ms INTEGER NOT NULL,
    latency_max_ms INTEGER NOT NULL,
    latency_p50_ms INTEGER NOT NULL,
    latency_p95_ms INTEGER NOT NULL,
    latency_p99_ms INTEGER NOT NULL,
    CONSTRAINT pk_product_stats_day PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_product_stats_day_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_product_stats_day_product_bucket ON product_stats_day (product_id, bucket_start DESC);
