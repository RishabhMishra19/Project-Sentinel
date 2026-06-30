--liquibase formatted sql

--changeset sentinel:002

CREATE TABLE users (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       org_id UUID NOT NULL,
       role VARCHAR(30) NOT NULL,
       status VARCHAR(30) NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       last_login_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE users
    ADD CONSTRAINT fk_users_org
        FOREIGN KEY (org_id)
            REFERENCES org(id);

ALTER TABLE users
    ADD CONSTRAINT uk_users_email
        UNIQUE (email);

CREATE INDEX idx_users_org
    ON users(org_id);