package com.sentinel.common.postgresql.tenant.repository;

import com.sentinel.common.postgresql.tenant.entity.Tenant;
import com.sentinel.common.postgresql.tenant.entity.TenantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository
    extends JpaRepository<Tenant, UUID>, JpaSpecificationExecutor<Tenant> {

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);

    @Override
    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Page<Tenant> findAll(Specification<Tenant> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy", "updatedBy"})
    Optional<Tenant> findWithAuditById(UUID id);

    @Query("SELECT t.id FROM Tenant t WHERE t.status = :status")
    List<UUID> findIdsByStatus(@Param("status") TenantStatus status);

    List<Tenant> findByIdIn(List<UUID> ids);
}
