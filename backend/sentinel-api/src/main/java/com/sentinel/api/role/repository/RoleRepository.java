package com.sentinel.api.role.repository;

import com.sentinel.server.role.entity.Role;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Optional<Role> findByIdAndTenantId(UUID id, UUID tenantId);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    List<Role> findByTenantIdOrderByNameAsc(UUID tenantId);

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);
}
