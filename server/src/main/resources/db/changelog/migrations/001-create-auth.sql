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

CREATE INDEX idx_users_email ON users (email);

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

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);

-- changeset sentinel:001-role-permissions
CREATE TABLE role_permissions (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);

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
CREATE INDEX idx_refresh_tokens_token_hash_status ON refresh_tokens (token_hash, status);
