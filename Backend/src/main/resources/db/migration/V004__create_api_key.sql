--liquibase formatted sql

--changeset sentinel:005

CREATE TABLE api_key (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       hashed_api_key VARCHAR(255) NOT NULL,
       status VARCHAR(30) NOT NULL,
       env_id UUID NOT NULL,
       created_by_id UUID NOT NULL,
       revoked_by_id UUID DEFAULT NULL,
       revoked_at TIMESTAMPTZ DEFAULT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE api_key
    ADD CONSTRAINT fk_api_key_environment
        FOREIGN KEY (env_id)
            REFERENCES environment(id);

ALTER TABLE api_key
    ADD CONSTRAINT fk_api_key_created_by
        FOREIGN KEY (created_by_id)
            REFERENCES users(id);

ALTER TABLE api_key
    ADD CONSTRAINT fk_api_key_revoked_by
        FOREIGN KEY (revoked_by_id)
            REFERENCES users(id);

CREATE INDEX idx_api_key_environment
    ON api_key(env_id);

CREATE INDEX idx_api_key_created_by
    ON api_key(created_by_id);