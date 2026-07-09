--liquibase formatted sql

--changeset sentinel:005

-- SEED PERMISSIONS
INSERT INTO permissions (
    id, entity, action, status, created_at, updated_at
) VALUES
      (gen_random_uuid(), 'USER', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'USER', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'USER', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'USER', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ROLE', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ROLE', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ROLE', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ROLE', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PERMISSION', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PERMISSION', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PERMISSION', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PERMISSION', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ORG', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ORG', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ORG', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ORG', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PROJECT', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PROJECT', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PROJECT', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'PROJECT', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ENVIRONMENT', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ENVIRONMENT', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ENVIRONMENT', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'ENVIRONMENT', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'API_KEY', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'API_KEY', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'API_KEY', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'API_KEY', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'INVITATION', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'INVITATION', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'INVITATION', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'INVITATION', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'AUDIT_LOG', 'CREATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'AUDIT_LOG', 'READ', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'AUDIT_LOG', 'UPDATE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'AUDIT_LOG', 'DELETE', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- SEED ROLE
INSERT INTO roles (
    id, name, status, created_at, updated_at
) VALUES (
             gen_random_uuid(),
             'SUPER_USER',
             'ACTIVE',
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
         );


-- SEED SENTINEL USER
INSERT INTO users (
    id,
    name,
    email,
    password_hash,
    email_verified,
    status,
    created_at,
    updated_at
) VALUES (
             gen_random_uuid(),
             'Sentinel',
             'rishabhpnd19@gmail.com',
             NULL,
             TRUE,
             'ACTIVE',
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
         );


-- MAP USER -> ROLE
INSERT INTO user_roles (
    id, user_id, role_id, status, created_at, updated_at
)
SELECT
    gen_random_uuid(),
    u.id,
    r.id,
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u
         JOIN roles r ON r.name = 'SUPER_USER'
WHERE u.email = 'rishabhpnd19@gmail.com';


-- MAP ROLE -> ALL PERMISSIONS
INSERT INTO role_permissions (
    id,
    role_id,
    permission_id,
    status,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    r.id,
    p.id,
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
         CROSS JOIN permissions p
WHERE r.name = 'SUPER_USER';


-- UPDATE AUDIT FIELDS
UPDATE users
SET created_by = u.id,
    updated_by = u.id
    FROM users u
WHERE u.email = 'rishabhpnd19@gmail.com';

UPDATE roles
SET created_by = u.id,
    updated_by = u.id
    FROM users u
WHERE u.email = 'rishabhpnd19@gmail.com';

UPDATE permissions
SET created_by = u.id,
    updated_by = u.id
    FROM users u
WHERE u.email = 'rishabhpnd19@gmail.com';

UPDATE user_roles
SET created_by = u.id,
    updated_by = u.id
    FROM users u
WHERE u.email = 'rishabhpnd19@gmail.com';

UPDATE role_permissions
SET created_by = u.id,
    updated_by = u.id
    FROM users u
WHERE u.email = 'rishabhpnd19@gmail.com';


-- ADD SELF REFERENCING FOREIGN KEYS
ALTER TABLE users
    ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN updated_by SET NOT NULL;

ALTER TABLE roles
    ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN updated_by SET NOT NULL;

ALTER TABLE permissions
    ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN updated_by SET NOT NULL;

ALTER TABLE role_permissions
    ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN updated_by SET NOT NULL;

ALTER TABLE user_roles
    ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN updated_by SET NOT NULL;