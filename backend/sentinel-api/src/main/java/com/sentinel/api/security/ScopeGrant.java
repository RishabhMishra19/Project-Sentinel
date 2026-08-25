package com.sentinel.api.security;

import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.RoleScopeType;

import java.util.UUID;

/**
 * Active role-scope grant attached to the authenticated principal.
 */
public record ScopeGrant(RoleScopeType scopeType, UUID scopeId, PermissionType permission) {
}
