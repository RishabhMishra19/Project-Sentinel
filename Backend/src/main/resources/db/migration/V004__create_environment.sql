--liquibase formatted sql

--changeset sentinel:004

CREATE TABLE environment (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       category VARCHAR(30) NOT NULL,
       status VARCHAR(30) NOT NULL,
       project_id UUID NOT NULL,
       created_by_id UUID NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE environment
    ADD CONSTRAINT fk_environment_project
        FOREIGN KEY (project_id)
            REFERENCES project(id);

ALTER TABLE environment
    ADD CONSTRAINT fk_environment_created_by
        FOREIGN KEY (created_by_id)
            REFERENCES users(id);

CREATE INDEX idx_environment_project
    ON environment(project_id);

CREATE INDEX idx_environment_created_by
    ON environment(created_by_id);