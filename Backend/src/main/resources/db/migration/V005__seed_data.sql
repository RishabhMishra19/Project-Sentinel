--liquibase formatted sql

--changeset sentinel:005


-- SEED SENTINEL USER
INSERT INTO users (id, name, email, password_hash, email_verified, status, created_at, updated_at)
VALUES (gen_random_uuid(),
        'Sentinel',
        'rishabhpndt19@gmail.com',
        '$2a$10$5Ug0GOK6McMmf8ix.62/PODGiwmFtqEA5haFj4odI1oJCZoQBAZ5i', --Admin@123
        TRUE,
        'ACTIVE',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP);



-- SEED SENTINEL ORG
INSERT INTO organizations(id, name, status, created_at, created_by, updated_at, updated_by)
VALUES (gen_random_uuid(),
        'Sentinel',
        'ACTIVE',
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'));

-- MAP USER -> ORG
INSERT INTO user_orgs (id, user_id, org_id, created_at, created_by)
VALUES (gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
        (SELECT id FROM organizations WHERE name = 'Sentinel'),
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'));



-- SEED ROLE
INSERT INTO roles (id, name, status, created_at, created_by, updated_at, updated_by)
VALUES (gen_random_uuid(),
        'SUPER_USER',
        'ACTIVE',
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'));

-- MAP USER -> ROLE
INSERT INTO user_roles (id, user_id, role_id, status, created_at, created_by, updated_at, updated_by)
VALUES (gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
        (SELECT id FROM roles WHERE name = 'SUPER_USER'),
        'ACTIVE',
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
        CURRENT_TIMESTAMP,
        (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'));



-- SEED PERMISSIONS
INSERT INTO permissions (id, entity, action, status, created_at, created_by, updated_at, updated_by)
SELECT gen_random_uuid(),
       p.entity,
       p.action,
       'ACTIVE',
       CURRENT_TIMESTAMP,
       (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
       CURRENT_TIMESTAMP,
       (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com')
FROM (
         VALUES
             ('USER','CREATE'),
             ('USER','READ'),
             ('USER','UPDATE'),
             ('USER','DELETE'),
             ('ROLE','CREATE'),
             ('ROLE','READ'),
             ('ROLE','UPDATE'),
             ('ROLE','DELETE'),
             ('PERMISSION','CREATE'),
             ('PERMISSION','READ'),
             ('PERMISSION','UPDATE'),
             ('PERMISSION','DELETE'),
             ('ORG','CREATE'),
             ('ORG','READ'),
             ('ORG','UPDATE'),
             ('ORG','DELETE'),
             ('PROJECT','CREATE'),
             ('PROJECT','READ'),
             ('PROJECT','UPDATE'),
             ('PROJECT','DELETE'),
             ('ENVIRONMENT','CREATE'),
             ('ENVIRONMENT','READ'),
             ('ENVIRONMENT','UPDATE'),
             ('ENVIRONMENT','DELETE'),
             ('API_KEY','CREATE'),
             ('API_KEY','READ'),
             ('API_KEY','UPDATE'),
             ('API_KEY','DELETE'),
             ('INVITATION','CREATE'),
             ('INVITATION','READ'),
             ('INVITATION','UPDATE'),
             ('INVITATION','DELETE'),
             ('AUDIT_LOG','CREATE'),
             ('AUDIT_LOG','READ'),
             ('AUDIT_LOG','UPDATE'),
             ('AUDIT_LOG','DELETE')
     ) AS p(entity, action);


-- MAP ROLE -> ALL PERMISSIONS
INSERT INTO role_permissions (id,
                              role_id,
                              permission_id,
                              status,
                              created_at,
                              created_by,
                              updated_at,
                              updated_by)
SELECT gen_random_uuid(),
       (SELECT id FROM roles WHERE name = 'SUPER_USER'),
       p.id,
       'ACTIVE',
       CURRENT_TIMESTAMP,
       (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com'),
       CURRENT_TIMESTAMP,
       (SELECT id FROM users WHERE email = 'rishabhpndt19@gmail.com')
FROM permissions p;



-- UPDATE AUDIT FIELDS
UPDATE users
SET created_by = u.id,
    updated_by = u.id FROM users u
WHERE u.email = 'rishabhpndt19@gmail.com';

-- ADD SELF REFERENCING FOREIGN KEYS
ALTER TABLE users
    ALTER COLUMN created_by SET NOT NULL,
    ALTER
        COLUMN updated_by SET NOT NULL;