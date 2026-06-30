--liquibase formatted sql

--changeset sentinel:001

CREATE TABLE org (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       status VARCHAR(30) NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE org
    ADD CONSTRAINT uk_org_name
        UNIQUE (name);