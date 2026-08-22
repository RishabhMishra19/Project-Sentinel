package com.sentinel.api.service.repository;

import com.sentinel.api.service.entity.Service;
import com.sentinel.api.service.entity.ServiceStatus;
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

public interface ServiceRepository extends JpaRepository<Service, UUID>, JpaSpecificationExecutor<Service> {

    boolean existsByProductIdAndNameIgnoreCase(UUID productId, String name);

    boolean existsByProductIdAndNameIgnoreCaseAndIdNot(UUID productId, String name, UUID id);

    @Override
    @EntityGraph(attributePaths = {"product", "product.tenant", "createdBy", "updatedBy"})
    Page<Service> findAll(Specification<Service> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"product", "product.tenant", "createdBy", "updatedBy"})
    Optional<Service> findWithAuditById(UUID id);

    @EntityGraph(attributePaths = {"product", "product.tenant", "createdBy", "updatedBy"})
    Optional<Service> findWithAuditByIdAndProductId(UUID id, UUID productId);

    @Query("SELECT s.id FROM Service s WHERE s.status = :status and s.product.id in :productIds")
    List<UUID> findIdsByProductIdsAndStatus(
            @Param("productIds") List<UUID> productIds,
            @Param("status") ServiceStatus status
    );

    @Query("""
                SELECT s.id
                FROM Service s
                LEFT JOIN Product p on s.product.id = p.id
                Left JOIN Tenant t on p.tenant.id = t.id
                WHERE t.id = :tenantId
                  AND s.status = :status
            """)
    List<UUID> findIdsByTenantIdAndStatus(@Param("tenantId") UUID tenantId, @Param("status") ServiceStatus status);

    @Query("""
                SELECT s.id
                FROM Service s
                LEFT JOIN Product p on s.product.id = p.id
                WHERE p.id = :productId
                  AND s.status = :status
            """)
    List<UUID> findIdsByProductIdAndStatus(@Param("productId") UUID productId, @Param("status") ServiceStatus status);

    @Query("SELECT s.id FROM Service s WHERE s.status = :status")
    List<UUID> findIdsByStatus(@Param("status") ServiceStatus serviceStatus);

    List<Service> findByIdIn(List<UUID> ids);

}
