package com.sentinel.api.role.service.core;

import com.sentinel.common.postgresql.role.Role;
import com.sentinel.common.postgresql.tenant.Tenant;
import com.sentinel.common.postgresql.user.User;

import java.util.List;
import java.util.UUID;

public interface RoleService {

    Role getById(UUID id);

    Role getByIdForTenant(UUID tenantId, UUID id);

    List<Role> listByTenant(UUID tenantId);

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);

    Role create(Tenant tenant, String name, User actor);

    Role updateName(Role role, String name, User actor);

    Role markInactive(Role role, User actor);
}
