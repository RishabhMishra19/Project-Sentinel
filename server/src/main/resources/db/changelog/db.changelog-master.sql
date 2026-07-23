-- liquibase formatted sql

-- changeset sentinel:001-users
CREATE TABLE users (
    id UUID NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- changeset sentinel:001-roles
CREATE TABLE roles (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_roles_updated_by FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- changeset sentinel:001-permissions
CREATE TABLE permissions (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_permissions_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_permissions_updated_by FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- changeset sentinel:001-user-roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- changeset sentinel:001-role-permissions
CREATE TABLE role_permissions (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

-- changeset sentinel:001-refresh-tokens
CREATE TABLE refresh_tokens (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);

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
