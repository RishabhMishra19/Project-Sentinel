-- liquibase formatted sql

-- changeset sentinel:002-tenants
CREATE TABLE tenants (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_tenants_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_tenants_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX idx_tenants_slug ON tenants (slug);
CREATE INDEX idx_tenants_status ON tenants (status);
CREATE INDEX idx_tenants_created_by ON tenants (created_by);

-- changeset sentinel:002-users-tenant-fk
-- Tenant users must have tenant_id; Sentinel platform admins must not.
-- Tenant admins are non-platform users only (is_tenant_admin implies not sentinel admin).
ALTER TABLE users
    ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
    ADD CONSTRAINT chk_users_tenant_vs_platform CHECK (
        (is_sentinel_admin = TRUE AND tenant_id IS NULL AND is_tenant_admin = FALSE)
        OR (is_sentinel_admin = FALSE AND tenant_id IS NOT NULL)
    );

-- changeset sentinel:002-roles
-- All roles belong to a tenant. Platform operators use users.is_sentinel_admin (not roles).
CREATE TABLE roles (
    id UUID NOT NULL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_roles_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT fk_roles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_roles_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE INDEX idx_roles_tenant_id ON roles (tenant_id);

-- changeset sentinel:002-user-roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);

-- changeset sentinel:002-role-scopes
-- permission per scope: ALL | READ | READ_AND_WRITE
CREATE TABLE role_scopes (
    id UUID NOT NULL PRIMARY KEY,
    role_id UUID NOT NULL,
    scope_type VARCHAR(32) NOT NULL,
    scope_id UUID NOT NULL,
    permission VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_role_scopes_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_role_scopes_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_role_scopes_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_role_scopes_permission CHECK (permission IN ('ALL', 'READ', 'READ_AND_WRITE'))
);

CREATE UNIQUE INDEX uk_role_scopes_resource ON role_scopes (role_id, scope_type, scope_id);

CREATE INDEX idx_role_scopes_role_id ON role_scopes (role_id);
CREATE INDEX idx_role_scopes_scope ON role_scopes (scope_type, scope_id);
CREATE INDEX idx_role_scopes_status ON role_scopes (status);
