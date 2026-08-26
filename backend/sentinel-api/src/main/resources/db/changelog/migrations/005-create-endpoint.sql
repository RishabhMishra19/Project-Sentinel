-- liquibase formatted sql

-- changeset sentinel:005-create-endpoint
CREATE TABLE endpoints
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id    UUID        NOT NULL,
    method        VARCHAR(16) NOT NULL,
    path_template TEXT        NOT NULL,
    first_seen_at TIMESTAMP WITH TIME ZONE,
    last_seen_at  TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_endpoints_service
        FOREIGN KEY (service_id)
            REFERENCES services (id)
);

CREATE INDEX idx_endpoints_service_id
    ON endpoints (service_id);

CREATE UNIQUE INDEX idx_endpoints_service_path
    ON endpoints (service_id, method, path_template);
