package com.sentinel.server.role.service.core;

import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.entity.RoleScope;
import com.sentinel.server.role.entity.RoleScopeStatus;
import com.sentinel.server.role.entity.RoleScopeType;
import com.sentinel.server.role.repository.RoleScopeRepository;
import com.sentinel.server.user.entity.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
