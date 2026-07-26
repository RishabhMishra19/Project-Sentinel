-- liquibase formatted sql

-- changeset sentinel:004-service-instances
-- last_seen_at: updated by agent heartbeat only (not per request event)
CREATE TABLE service_instances (
    id UUID NOT NULL PRIMARY KEY,
    service_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_service_instances_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_service_instances_service_id ON service_instances (service_id);
CREATE INDEX idx_service_instances_last_seen_at ON service_instances (last_seen_at);

-- changeset sentinel:004-endpoints
CREATE TABLE endpoints (
    id UUID NOT NULL PRIMARY KEY,
    service_id UUID NOT NULL,
    method VARCHAR(16) NOT NULL,
    path_template VARCHAR(512) NOT NULL,
    first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_endpoints_service_method_path UNIQUE (service_id, method, path_template),
    CONSTRAINT fk_endpoints_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

CREATE INDEX idx_endpoints_service_id ON endpoints (service_id);
CREATE INDEX idx_endpoints_last_seen_at ON endpoints (last_seen_at);

-- changeset sentinel:004-request-events
-- Retention: 7 days (application-enforced purge; not DB TTL)
CREATE TABLE request_events (
    id UUID NOT NULL PRIMARY KEY,
    service_instance_id UUID NOT NULL,
    endpoint_id UUID NOT NULL,
    request_id VARCHAR(128) NULL,
    trace_id VARCHAR(128) NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_user_ip VARCHAR(64) NULL,
    user_id VARCHAR(128) NULL,
    status_code INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    request_size_bytes INTEGER NULL,
    response_size_bytes INTEGER NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_request_events_instance FOREIGN KEY (service_instance_id) REFERENCES service_instances (id) ON DELETE RESTRICT,
    CONSTRAINT fk_request_events_endpoint FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_request_events_instance_occurred ON request_events (service_instance_id, occurred_at DESC);
CREATE INDEX idx_request_events_endpoint_occurred ON request_events (endpoint_id, occurred_at DESC);
CREATE INDEX idx_request_events_occurred_at ON request_events (occurred_at DESC);
CREATE INDEX idx_request_events_request_id ON request_events (request_id) WHERE request_id IS NOT NULL;
CREATE INDEX idx_request_events_trace_id ON request_events (trace_id) WHERE trace_id IS NOT NULL;
CREATE INDEX idx_request_events_user_id_occurred ON request_events (user_id, occurred_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_request_events_status_occurred ON request_events (status_code, occurred_at DESC);
