package com.sentinel.api.role.service.core;

import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.common.postgresql.permission.entity.PermissionType;
import com.sentinel.common.postgresql.role.entity.Role;
import com.sentinel.common.postgresql.role.entity.RoleScope;
import com.sentinel.common.postgresql.role.entity.RoleScopeStatus;
import com.sentinel.common.postgresql.role.entity.RoleScopeType;
import com.sentinel.common.postgresql.role.repository.RoleScopeRepository;
import com.sentinel.common.postgresql.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleScopeServiceImpl implements RoleScopeService {

    private final RoleService roleService;
    private final RoleScopeRepository roleScopeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RoleScope> listByRoleIdForTenant(UUID tenantId, UUID roleId) {
        roleService.getByIdForTenant(tenantId, roleId);
        return roleScopeRepository.findByRoleIdOrderByCreatedAtAsc(roleId);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleScope getByIdForRole(UUID tenantId, UUID roleId, UUID scopeId) {
        roleService.getByIdForTenant(tenantId, roleId);
        return roleScopeRepository
            .findByIdAndRoleId(scopeId, roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role scope not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsResourceScope(UUID roleId, RoleScopeType scopeType, UUID scopeId) {
        return roleScopeRepository.existsByRoleIdAndScopeTypeAndScopeId(roleId, scopeType, scopeId);
    }

    @Override
    public RoleScope create(
        Role role,
        RoleScopeType scopeType,
        UUID scopeId,
        PermissionType permission,
        User actor) {
        RoleScope scope = new RoleScope();
        scope.setRole(role);
        scope.setScopeType(scopeType);
        scope.setScopeId(scopeId);
        scope.setPermission(permission);
        scope.setStatus(RoleScopeStatus.ACTIVE);
        scope.setCreatedBy(actor);
        scope.setUpdatedBy(actor);
        return roleScopeRepository.save(scope);
    }

    @Override
    public RoleScope updatePermission(RoleScope scope, PermissionType permission, User actor) {
        scope.setPermission(permission);
        scope.setUpdatedBy(actor);
        return roleScopeRepository.save(scope);
    }

    @Override
    public RoleScope markInactive(RoleScope scope, User actor) {
        scope.setStatus(RoleScopeStatus.INACTIVE);
        scope.setUpdatedBy(actor);
        return roleScopeRepository.save(scope);
    }
}
