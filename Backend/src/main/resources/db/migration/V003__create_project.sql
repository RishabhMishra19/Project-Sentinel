--liquibase formatted sql

--changeset sentinel:003

CREATE TABLE project (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       status VARCHAR(30) NOT NULL,
       created_by_id UUID NOT NULL,
       org_id UUID NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE project
    ADD CONSTRAINT fk_project_org
        FOREIGN KEY (org_id)
            REFERENCES org(id);

ALTER TABLE project
    ADD CONSTRAINT fk_project_created_by
        FOREIGN KEY (created_by_id)
            REFERENCES users(id);

CREATE INDEX idx_project_org_status
    ON project(org_id, status);

CREATE INDEX idx_project_org_created_by
    ON project(org_id, created_by_id);