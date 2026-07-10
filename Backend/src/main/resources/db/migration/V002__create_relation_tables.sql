--liquibase formatted sql

--changeset sentinel:002

-- ROLE PERMISSIONS
CREATE TABLE role_permissions
(
    id            UUID PRIMARY KEY,

    role_id       UUID        NOT NULL,
    permission_id UUID        NOT NULL,

    status        VARCHAR(30) NOT NULL,

    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    UUID,

    updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by    UUID,

    CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id),

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles (id),

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions (id),

    CONSTRAINT fk_role_permissions_created_by
        FOREIGN KEY (created_by) REFERENCES users (id),

    CONSTRAINT fk_role_permissions_updated_by
        FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- USER ROLES
CREATE TABLE user_roles
(
    id         UUID PRIMARY KEY,

    user_id    UUID        NOT NULL,
    role_id    UUID        NOT NULL,

    status     VARCHAR(30) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,

    CONSTRAINT uq_user_roles UNIQUE (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id),

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles (id),

    CONSTRAINT fk_user_roles_created_by
        FOREIGN KEY (created_by) REFERENCES users (id),

    CONSTRAINT fk_user_roles_updated_by
        FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- USER ORGANIZATIONS
CREATE TABLE user_orgs
(
    id         UUID PRIMARY KEY,

    user_id    UUID        NOT NULL,
    org_id     UUID        NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID        NOT NULL,

    CONSTRAINT uq_user_orgs UNIQUE (user_id, org_id),

    CONSTRAINT fk_user_orgs_user
        FOREIGN KEY (user_id) REFERENCES users (id),

    CONSTRAINT fk_user_orgs_org
        FOREIGN KEY (org_id) REFERENCES organizations (id),

    CONSTRAINT fk_user_orgs_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
);