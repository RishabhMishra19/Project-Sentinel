--liquibase formatted sql

--changeset sentinel:003

-- ORG PROJECTS
CREATE TABLE org_projects (
                              id UUID PRIMARY KEY,

                              name VARCHAR(255) NOT NULL,
                              org_id UUID NOT NULL,

                              status VARCHAR(30) NOT NULL,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              created_by UUID NOT NULL,

                              updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_by UUID NOT NULL,

                              CONSTRAINT uq_org_projects UNIQUE (org_id, name),

                              CONSTRAINT fk_org_projects_org
                                  FOREIGN KEY (org_id) REFERENCES organizations(id),

                              CONSTRAINT fk_org_projects_created_by
                                  FOREIGN KEY (created_by) REFERENCES users(id),

                              CONSTRAINT fk_org_projects_updated_by
                                  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- PROJECT ENVS
CREATE TABLE project_envs (
                              id UUID PRIMARY KEY,

                              name VARCHAR(255) NOT NULL,
                              category VARCHAR(30) NOT NULL,
                              project_id UUID NOT NULL,

                              status VARCHAR(30) NOT NULL,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              created_by UUID NOT NULL,

                              updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_by UUID NOT NULL,

                              CONSTRAINT uq_project_envs UNIQUE (project_id, name),

                              CONSTRAINT fk_project_envs_project
                                  FOREIGN KEY (project_id) REFERENCES org_projects(id),

                              CONSTRAINT fk_project_envs_created_by
                                  FOREIGN KEY (created_by) REFERENCES users(id),

                              CONSTRAINT fk_project_envs_updated_by
                                  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ENV API KEYS
CREATE TABLE env_api_keys (
                              id UUID PRIMARY KEY,

                              name VARCHAR(255) NOT NULL,
                              api_key_hash VARCHAR(255) NOT NULL,

                              env_id UUID NOT NULL,

                              status VARCHAR(30) NOT NULL,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              created_by UUID NOT NULL,

                              updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_by UUID NOT NULL,

                              CONSTRAINT uq_env_api_keys UNIQUE (env_id, name),

                              CONSTRAINT fk_env_api_keys_env
                                  FOREIGN KEY (env_id) REFERENCES project_envs(id),

                              CONSTRAINT fk_env_api_keys_created_by
                                  FOREIGN KEY (created_by) REFERENCES users(id),

                              CONSTRAINT fk_env_api_keys_updated_by
                                  FOREIGN KEY (updated_by) REFERENCES users(id)
);