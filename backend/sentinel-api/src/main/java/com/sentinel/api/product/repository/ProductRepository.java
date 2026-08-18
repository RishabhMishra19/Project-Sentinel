package com.sentinel.api.product.repository;

import com.sentinel.api.product.entity.Product;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository
        extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);

    @Override
    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Optional<Product> findWithAuditById(UUID id);

    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Optional<Product> findWithAuditByIdAndTenantId(UUID id, UUID tenantId);
}
