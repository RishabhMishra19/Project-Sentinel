package com.sentinel.api.role.service.core;

import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.role.entity.Role;
import com.sentinel.api.role.entity.RoleStatus;
import com.sentinel.api.role.repository.RoleRepository;
import com.sentinel.api.tenant.entity.Tenant;
import com.sentinel.api.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    public Role getById(UUID id) {
        return roleRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Role getByIdForTenant(UUID tenantId, UUID id) {
        return roleRepository
            .findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> listByTenant(UUID tenantId) {
        return roleRepository.findByTenantIdOrderByNameAsc(tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name) {
        return roleRepository.existsByTenantIdAndNameIgnoreCase(tenantId, name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(
        UUID tenantId, String name, UUID id) {
        return roleRepository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, name, id);
    }

    @Override
    public Role create(Tenant tenant, String name, User actor) {
        Role role = new Role();
        role.setTenant(tenant);
        role.setName(name);
        role.setStatus(RoleStatus.ACTIVE);
        role.setCreatedBy(actor);
        role.setUpdatedBy(actor);
        return roleRepository.save(role);
    }

    @Override
    public Role updateName(Role role, String name, User actor) {
        role.setName(name);
        role.setUpdatedBy(actor);
        return roleRepository.save(role);
    }

    @Override
    public Role markInactive(Role role, User actor) {
        role.setStatus(RoleStatus.INACTIVE);
        role.setUpdatedBy(actor);
        return roleRepository.save(role);
    }
}
