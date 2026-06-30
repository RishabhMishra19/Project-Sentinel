--liquibase formatted sql

--changeset sentinel:007

CREATE TABLE refresh_token (
       id UUID PRIMARY KEY,
       hashed_token VARCHAR(255) NOT NULL,
       user_id UUID NOT NULL,
       revoked_at TIMESTAMPTZ DEFAULT NULL,
       expires_at TIMESTAMPTZ NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE refresh_token
    ADD CONSTRAINT fk_refresh_token_user
        FOREIGN KEY (user_id)
            REFERENCES users(id);

CREATE INDEX idx_refresh_token_user
    ON refresh_token(user_id);