--liquibase formatted sql

--changeset sentinel:001

-- USERS
CREATE TABLE users (
                       id UUID PRIMARY KEY,

                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255),

                       email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       last_login_at TIMESTAMPTZ,

                       status VARCHAR(30) NOT NULL,

                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       created_by UUID,

                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_by UUID,

                       CONSTRAINT fk_users_created_by
                           FOREIGN KEY (created_by) REFERENCES users(id),

                       CONSTRAINT fk_users_updated_by
                           FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ROLES
CREATE TABLE roles (
                       id UUID PRIMARY KEY,

                       name VARCHAR(100) NOT NULL UNIQUE,

                       status VARCHAR(30) NOT NULL,

                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       created_by UUID,

                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_by UUID,

                       CONSTRAINT fk_roles_created_by
                           FOREIGN KEY (created_by) REFERENCES users(id),

                       CONSTRAINT fk_roles_updated_by
                           FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- PERMISSIONS
CREATE TABLE permissions (
                             id UUID PRIMARY KEY,

                             entity VARCHAR(50) NOT NULL,
                             action VARCHAR(50) NOT NULL,

                             status VARCHAR(30) NOT NULL,

                             created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             created_by UUID,

                             updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_by UUID,

                             CONSTRAINT uq_permissions_entity_action
                                 UNIQUE (entity, action),

                             CONSTRAINT fk_permissions_created_by
                                 FOREIGN KEY (created_by) REFERENCES users(id),

                             CONSTRAINT fk_permissions_updated_by
                                 FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ORGANIZATIONS
CREATE TABLE organizations (
                               id UUID PRIMARY KEY,

                               name VARCHAR(255) NOT NULL UNIQUE,

                               status VARCHAR(30) NOT NULL,

                               created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               created_by UUID NOT NULL,

                               updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_by UUID NOT NULL,

                               CONSTRAINT fk_organizations_created_by
                                   FOREIGN KEY (created_by) REFERENCES users(id),

                               CONSTRAINT fk_organizations_updated_by
                                   FOREIGN KEY (updated_by) REFERENCES users(id)
);

