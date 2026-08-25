package com.sentinel.api.role.service.core;

import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.Role;
import com.sentinel.common.postgresql.role.RoleScope;
import com.sentinel.common.postgresql.role.RoleScopeType;
import com.sentinel.common.postgresql.user.User;

import java.util.List;
import java.util.UUID;

public interface RoleScopeService {

    List<RoleScope> listByRoleIdForTenant(UUID tenantId, UUID roleId);

    RoleScope getByIdForRole(UUID tenantId, UUID roleId, UUID scopeId);

    boolean existsResourceScope(UUID roleId, RoleScopeType scopeType, UUID scopeId);

    RoleScope create(
        Role role,
        RoleScopeType scopeType,
        UUID scopeId,
        PermissionType permission,
        User actor);

    RoleScope updatePermission(RoleScope scope, PermissionType permission, User actor);

    RoleScope markInactive(RoleScope scope, User actor);
}
