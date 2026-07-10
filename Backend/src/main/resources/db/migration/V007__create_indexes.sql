--liquibase formatted sql

--changeset sentinel:007

-- USERS
CREATE INDEX idx_users_status ON users (status);

-- ROLE_PERMISSIONS
CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);

-- USER_ROLES
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

-- USER_ORGS
CREATE INDEX idx_user_orgs_user_id ON user_orgs (user_id);
CREATE INDEX idx_user_orgs_org_id ON user_orgs (org_id);

-- ORG_PROJECTS
CREATE INDEX idx_org_projects_org_id ON org_projects (org_id);

-- PROJECT_ENVS
CREATE INDEX idx_project_envs_project_id ON project_envs (project_id);

-- ENV_API_KEYS
CREATE INDEX idx_env_api_keys_env_id ON env_api_keys (env_id);

-- INVITATIONS
CREATE INDEX idx_invitations_email ON invitations (email);

-- REFRESH_TOKENS
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);