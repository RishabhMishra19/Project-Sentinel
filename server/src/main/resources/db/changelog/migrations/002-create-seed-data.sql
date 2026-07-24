-- liquibase formatted sql

-- changeset sentinel:002-seed-user
INSERT INTO users (id, email, password_hash, display_name, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'rishabhpndt19@gmail.com',
    '$2a$10$lcHb18xVhZWyp3MxCJfseOHgn7mD6CO/EA16M76nxt1qJPmSQ1pV6',
    'Sentinel',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- changeset sentinel:002-seed-permission
INSERT INTO permissions (id, name, status, created_by, updated_by, created_at, updated_at)
SELECT
    gen_random_uuid(),
    'ALL',
    'ACTIVE',
    u.id,
    u.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'rishabhpndt19@gmail.com';

-- changeset sentinel:002-seed-role
INSERT INTO roles (id, name, status, created_by, updated_by, created_at, updated_at)
SELECT
    gen_random_uuid(),
    'SENTINEL_USER',
    'ACTIVE',
    u.id,
    u.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'rishabhpndt19@gmail.com';

-- changeset sentinel:002-seed-role-permission
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'SENTINEL_USER'
  AND p.name = 'ALL';

-- changeset sentinel:002-seed-user-role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'rishabhpndt19@gmail.com'
  AND r.name = 'SENTINEL_USER';
