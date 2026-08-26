--liquibase formatted sql

--changeset sentinel-team:001-create-load-test
CREATE TABLE load_test_data (
    id         UUID         NOT NULL,
    name       VARCHAR(255) NOT NULL,
    test_data  JSONB        NOT NULL,
    created_at TIMESTAMP    NOT NULL,
    status     VARCHAR(50)  NOT NULL,

    CONSTRAINT load_test_data_pkey PRIMARY KEY (id)
);

CREATE TABLE load_test_run_log (
    id UUID NOT NULL,
    load_test_data_id UUID NOT NULL,
    config JSONB NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP DEFAULT NULL,
    total_requests BIGINT DEFAULT 0,
    failed_requests BIGINT DEFAULT 0,

    CONSTRAINT load_test_run_log_pkey PRIMARY KEY (id),

    CONSTRAINT fk_load_test_run_log_load_test_data
    FOREIGN KEY (load_test_data_id)
    REFERENCES load_test_data (id)
);

--rollback DROP TABLE load_test_run_log;
--rollback DROP TABLE load_test_data;
