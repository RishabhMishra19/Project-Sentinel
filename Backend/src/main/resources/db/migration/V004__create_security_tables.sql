--liquibase formatted sql

--changeset sentinel:004

-- INVITATIONS
CREATE TABLE invitations
(
    id           UUID PRIMARY KEY,

    email        VARCHAR(255) NOT NULL,

    role_id      UUID         NOT NULL,
    org_id       UUID         NOT NULL,

    hashed_token VARCHAR(255) NOT NULL,

    expires_at   TIMESTAMPTZ  NOT NULL,

    status       VARCHAR(30)  NOT NULL,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by   UUID         NOT NULL,

    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by   UUID         NOT NULL,

    CONSTRAINT uq_invitations_hashed_token
        UNIQUE (hashed_token),

    CONSTRAINT fk_invitations_role
        FOREIGN KEY (role_id) REFERENCES roles (id),

    CONSTRAINT fk_invitations_org
        FOREIGN KEY (org_id) REFERENCES organizations (id),

    CONSTRAINT fk_invitations_created_by
        FOREIGN KEY (created_by) REFERENCES users (id),

    CONSTRAINT fk_invitations_updated_by
        FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- REFRESH TOKENS
CREATE TABLE refresh_tokens
(
    id         UUID PRIMARY KEY,

    token_hash VARCHAR(255) NOT NULL,

    user_id    UUID         NOT NULL,

    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMPTZ  NOT NULL,

    revoked_at TIMESTAMPTZ,
    revoked_by UUID,

    CONSTRAINT uq_refresh_tokens_token_hash
        UNIQUE (token_hash),

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id),

    CONSTRAINT fk_refresh_tokens_revoked_by
        FOREIGN KEY (revoked_by) REFERENCES users (id)
);