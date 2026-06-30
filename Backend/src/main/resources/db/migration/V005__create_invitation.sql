--liquibase formatted sql

--changeset sentinel:006

CREATE TABLE invitation (
       id UUID PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       role VARCHAR(30) NOT NULL,
       status VARCHAR(30) NOT NULL,
       hashed_token VARCHAR(255) NOT NULL,
       org_id UUID NOT NULL,
       invited_by_id UUID NOT NULL,
       expires_at TIMESTAMPTZ NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE invitation
    ADD CONSTRAINT fk_invitation_org
        FOREIGN KEY (org_id)
            REFERENCES org(id);

ALTER TABLE invitation
    ADD CONSTRAINT fk_invitation_invited_by
        FOREIGN KEY (invited_by_id)
            REFERENCES users(id);

CREATE INDEX idx_invitation_org_status
    ON invitation(org_id, status);

CREATE INDEX idx_invitation_org_invited_by
    ON invitation(org_id, invited_by_id);