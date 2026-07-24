package com.sentinel.server.tenant.repository;

import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.tenant.entity.TenantStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Page<Tenant> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Page<Tenant> findByStatus(TenantStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Optional<Tenant> findWithAuditById(UUID id);
}
