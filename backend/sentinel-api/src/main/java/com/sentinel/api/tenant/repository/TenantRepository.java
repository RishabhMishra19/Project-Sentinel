package com.sentinel.api.tenant.repository;

import com.sentinel.server.tenant.entity.Tenant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TenantRepository
        extends JpaRepository<Tenant, UUID>, JpaSpecificationExecutor<Tenant> {

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);

    @Override
    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Page<Tenant> findAll(Specification<Tenant> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Optional<Tenant> findWithAuditById(UUID id);
}
