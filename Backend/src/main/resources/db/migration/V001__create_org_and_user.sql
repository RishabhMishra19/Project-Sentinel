--liquibase formatted sql

--changeset sentinel:001

CREATE TABLE org (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       status VARCHAR(30) NOT NULL,
       owner_id UUID DEFAULT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

ALTER TABLE org
    ADD CONSTRAINT fk_org_owner
        FOREIGN KEY (owner_id)
            REFERENCES users(id);

ALTER TABLE users
    ADD CONSTRAINT uk_users_email
        UNIQUE (email);

ALTER TABLE org
    ADD CONSTRAINT uk_org_name
        UNIQUE (name);

CREATE INDEX idx_users_org
    ON users(org_id);

