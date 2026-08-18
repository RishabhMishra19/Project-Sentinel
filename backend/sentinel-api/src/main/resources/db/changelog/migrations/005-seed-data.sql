-- liquibase formatted sql

-- changeset sentinel:005-seed-user
INSERT INTO users (id, email, password_hash, display_name, status, is_sentinel_admin, is_tenant_admin, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'rishabhpndt19@gmail.com',
    '$2a$10$lcHb18xVhZWyp3MxCJfseOHgn7mD6CO/EA16M76nxt1qJPmSQ1pV6',
    'Sentinel',
    'ACTIVE',
    TRUE,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
