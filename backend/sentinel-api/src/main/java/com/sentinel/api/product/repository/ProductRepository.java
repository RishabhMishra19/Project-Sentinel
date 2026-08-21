package com.sentinel.api.product.repository;

import com.sentinel.api.product.entity.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.sentinel.api.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);

    @Override
    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Optional<Product> findWithAuditById(UUID id);

    @EntityGraph(attributePaths = {"tenant", "createdBy", "updatedBy"})
    Optional<Product> findWithAuditByIdAndTenantId(UUID id, UUID tenantId);

    @Query("""
                SELECT p.id
                FROM Product p
                WHERE p.tenant.id = :tenantId
                  AND p.status = :status
            """)
    List<UUID> findAllProductIdsByTenantIdAndStatus(UUID tenantId, ProductStatus status);

}
