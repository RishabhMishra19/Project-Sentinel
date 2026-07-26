-- liquibase formatted sql
--
-- Retention policy (application-enforced purge; not DB TTL):
--   request_events                 → 7 days
--   analytics_*_stats_minute                 → 30 days
--   analytics_*_stats_hour                   → 1 year
--   analytics_*_stats_day                    → forever
--   analytics_endpoint_status_metrics        → 30 days (minute buckets)
--   analytics_endpoint_exception_metrics     → 30 days (minute buckets)

-- changeset sentinel:007-analytics-endpoint-stats
CREATE TABLE analytics_endpoint_stats_minute (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_endpoint_stats_minute PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_analytics_endpoint_stats_minute_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_endpoint_stats_minute_endpoint_bucket ON analytics_endpoint_stats_minute (endpoint_id, bucket_start DESC);
CREATE INDEX idx_analytics_endpoint_stats_minute_bucket ON analytics_endpoint_stats_minute (bucket_start DESC);

CREATE TABLE analytics_endpoint_stats_hour (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_endpoint_stats_hour PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_analytics_endpoint_stats_hour_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_endpoint_stats_hour_endpoint_bucket ON analytics_endpoint_stats_hour (endpoint_id, bucket_start DESC);
CREATE INDEX idx_analytics_endpoint_stats_hour_bucket ON analytics_endpoint_stats_hour (bucket_start DESC);

CREATE TABLE analytics_endpoint_stats_day (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_endpoint_stats_day PRIMARY KEY (bucket_start, endpoint_id),
    CONSTRAINT fk_analytics_endpoint_stats_day_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_endpoint_stats_day_endpoint_bucket ON analytics_endpoint_stats_day (endpoint_id, bucket_start DESC);
CREATE INDEX idx_analytics_endpoint_stats_day_bucket ON analytics_endpoint_stats_day (bucket_start DESC);

-- changeset sentinel:007-analytics-service-stats
CREATE TABLE analytics_service_stats_minute (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_service_stats_minute PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_analytics_service_stats_minute_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_service_stats_minute_service_bucket ON analytics_service_stats_minute (service_id, bucket_start DESC);
CREATE INDEX idx_analytics_service_stats_minute_bucket ON analytics_service_stats_minute (bucket_start DESC);

CREATE TABLE analytics_service_stats_hour (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_service_stats_hour PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_analytics_service_stats_hour_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_service_stats_hour_service_bucket ON analytics_service_stats_hour (service_id, bucket_start DESC);
CREATE INDEX idx_analytics_service_stats_hour_bucket ON analytics_service_stats_hour (bucket_start DESC);

CREATE TABLE analytics_service_stats_day (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_service_stats_day PRIMARY KEY (bucket_start, service_id),
    CONSTRAINT fk_analytics_service_stats_day_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_service_stats_day_service_bucket ON analytics_service_stats_day (service_id, bucket_start DESC);
CREATE INDEX idx_analytics_service_stats_day_bucket ON analytics_service_stats_day (bucket_start DESC);

-- changeset sentinel:007-analytics-product-stats
CREATE TABLE analytics_product_stats_minute (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_product_stats_minute PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_analytics_product_stats_minute_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_product_stats_minute_product_bucket ON analytics_product_stats_minute (product_id, bucket_start DESC);
CREATE INDEX idx_analytics_product_stats_minute_bucket ON analytics_product_stats_minute (bucket_start DESC);

CREATE TABLE analytics_product_stats_hour (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_product_stats_hour PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_analytics_product_stats_hour_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_product_stats_hour_product_bucket ON analytics_product_stats_hour (product_id, bucket_start DESC);
CREATE INDEX idx_analytics_product_stats_hour_bucket ON analytics_product_stats_hour (bucket_start DESC);

CREATE TABLE analytics_product_stats_day (
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_product_stats_day PRIMARY KEY (bucket_start, product_id),
    CONSTRAINT fk_analytics_product_stats_day_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_product_stats_day_product_bucket ON analytics_product_stats_day (product_id, bucket_start DESC);
CREATE INDEX idx_analytics_product_stats_day_bucket ON analytics_product_stats_day (bucket_start DESC);

-- changeset sentinel:007-analytics-tenant-stats
CREATE TABLE analytics_tenant_stats_minute (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_id UUID NOT NULL,
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_tenant_stats_minute PRIMARY KEY (bucket_start, tenant_id),
    CONSTRAINT fk_analytics_tenant_stats_minute_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_tenant_stats_minute_tenant_bucket ON analytics_tenant_stats_minute (tenant_id, bucket_start DESC);
CREATE INDEX idx_analytics_tenant_stats_minute_bucket ON analytics_tenant_stats_minute (bucket_start DESC);

CREATE TABLE analytics_tenant_stats_hour (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_id UUID NOT NULL,
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_tenant_stats_hour PRIMARY KEY (bucket_start, tenant_id),
    CONSTRAINT fk_analytics_tenant_stats_hour_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_tenant_stats_hour_tenant_bucket ON analytics_tenant_stats_hour (tenant_id, bucket_start DESC);
CREATE INDEX idx_analytics_tenant_stats_hour_bucket ON analytics_tenant_stats_hour (bucket_start DESC);

CREATE TABLE analytics_tenant_stats_day (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_id UUID NOT NULL,
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
    request_bytes_total BIGINT NOT NULL,
    response_bytes_total BIGINT NOT NULL,
    CONSTRAINT pk_analytics_tenant_stats_day PRIMARY KEY (bucket_start, tenant_id),
    CONSTRAINT fk_analytics_tenant_stats_day_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_tenant_stats_day_tenant_bucket ON analytics_tenant_stats_day (tenant_id, bucket_start DESC);
CREATE INDEX idx_analytics_tenant_stats_day_bucket ON analytics_tenant_stats_day (bucket_start DESC);

-- changeset sentinel:007-analytics-endpoint-status-metrics
-- Exact HTTP status distribution per endpoint (minute buckets)
CREATE TABLE analytics_endpoint_status_metrics (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    endpoint_id UUID NOT NULL,
    status_code INTEGER NOT NULL,
    request_count BIGINT NOT NULL,
    CONSTRAINT pk_analytics_endpoint_status_metrics PRIMARY KEY (bucket_start, endpoint_id, status_code),
    CONSTRAINT fk_analytics_endpoint_status_metrics_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_endpoint_status_metrics_endpoint_bucket ON analytics_endpoint_status_metrics (endpoint_id, bucket_start DESC);
CREATE INDEX idx_analytics_endpoint_status_metrics_bucket ON analytics_endpoint_status_metrics (bucket_start DESC);

-- changeset sentinel:007-analytics-endpoint-exception-metrics
-- Aggregated exception counts per endpoint (minute buckets)
CREATE TABLE analytics_endpoint_exception_metrics (
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    endpoint_id UUID NOT NULL,
    exception_type VARCHAR(256) NOT NULL,
    exception_count BIGINT NOT NULL,
    CONSTRAINT pk_analytics_endpoint_exception_metrics PRIMARY KEY (bucket_start, endpoint_id, exception_type),
    CONSTRAINT fk_analytics_endpoint_exception_metrics_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_analytics_endpoint_exception_metrics_endpoint_bucket ON analytics_endpoint_exception_metrics (endpoint_id, bucket_start DESC);
CREATE INDEX idx_analytics_endpoint_exception_metrics_bucket ON analytics_endpoint_exception_metrics (bucket_start DESC);
