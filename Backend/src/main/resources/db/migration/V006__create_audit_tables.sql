--liquibase formatted sql

--changeset sentinel:006

-- AUDIT LOGS
CREATE TABLE audit_logs (
                            id UUID PRIMARY KEY,

                            entity_type VARCHAR(50) NOT NULL,
                            entity_id UUID NOT NULL,

                            action VARCHAR(30) NOT NULL,

                            old_val JSONB,
                            new_val JSONB,

                            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            created_by UUID NOT NULL,

                            CONSTRAINT fk_audit_logs_created_by
                                FOREIGN KEY (created_by) REFERENCES users(id)
);