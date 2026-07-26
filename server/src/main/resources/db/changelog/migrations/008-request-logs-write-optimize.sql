-- liquibase formatted sql

-- changeset sentinel:008-request-logs-write-optimize
-- Drop FKs and excess indexes so high-RPS inserts are cheaper.
ALTER TABLE request_logs DROP CONSTRAINT IF EXISTS fk_request_logs_instance;
ALTER TABLE request_logs DROP CONSTRAINT IF EXISTS fk_request_logs_endpoint;

DROP INDEX IF EXISTS idx_request_logs_instance_occurred;
DROP INDEX IF EXISTS idx_request_logs_endpoint_occurred;
DROP INDEX IF EXISTS idx_request_logs_request_id;
DROP INDEX IF EXISTS idx_request_logs_user_id_occurred;
DROP INDEX IF EXISTS idx_request_logs_status_occurred;

-- Keep only occurred_at, status_code, trace_id (recreate status as single-column).
DROP INDEX IF EXISTS idx_request_logs_occurred_at;
DROP INDEX IF EXISTS idx_request_logs_trace_id;

CREATE INDEX idx_request_logs_occurred_at ON request_logs (occurred_at DESC);
CREATE INDEX idx_request_logs_status_code ON request_logs (status_code);
CREATE INDEX idx_request_logs_trace_id ON request_logs (trace_id) WHERE trace_id IS NOT NULL;
