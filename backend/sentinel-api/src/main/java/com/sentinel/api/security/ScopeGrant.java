package com.sentinel.api.security;

import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.RoleScopeType;
import java.util.UUID;

/** Active role-scope grant attached to the authenticated principal. */
public record ScopeGrant(RoleScopeType scopeType, UUID scopeId, PermissionType permission) {
}
