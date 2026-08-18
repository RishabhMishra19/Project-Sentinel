package com.sentinel.api.role.repository;

import com.sentinel.server.role.entity.RoleScope;
import com.sentinel.server.role.entity.RoleScopeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleScopeRepository extends JpaRepository<RoleScope, UUID> {

    List<RoleScope> findByRoleIdOrderByCreatedAtAsc(UUID roleId);

    Optional<RoleScope> findByIdAndRoleId(UUID id, UUID roleId);

    boolean existsByRoleIdAndScopeTypeAndScopeId(
            UUID roleId, RoleScopeType scopeType, UUID scopeId);
}
