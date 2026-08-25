--liquibase formatted sql

--changeset sentinel-team:001-create-load-test
CREATE TABLE public.load_test (
                                  id UUID NOT NULL,
                                  name VARCHAR(255) NOT NULL,
                                  status VARCHAR(50) NOT NULL,
                                  test_data_id VARCHAR(255),
                                  target_rps INT,
                                  concurrency INT,
                                  duration_ms BIGINT,
                                  endpoint_count INT,
                                  total_requests BIGINT,
                                  successful_requests BIGINT,
                                  failed_requests BIGINT,
                                  average_latency_ms DOUBLE PRECISION,
                                  p50_latency_ms DOUBLE PRECISION,
                                  p95_latency_ms DOUBLE PRECISION,
                                  p99_latency_ms DOUBLE PRECISION,
                                  started_at TIMESTAMP,
                                  completed_at TIMESTAMP,
                                  created_at TIMESTAMP,
                                  updated_at TIMESTAMP,

                                  CONSTRAINT load_test_pkey PRIMARY KEY (id)
);

--rollback DROP TABLE public.load_test;
