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

    @Query("""
                SELECT s.id
                FROM Service s
                WHERE s.product.id IN :productIds
                  AND s.status = :status
            """)
    List<UUID> findAllServiceIdsByProductIdsAndStatus(@Param("productIds") List<UUID> productIds, @Param("status") ServiceStatus status);

    @Query("""
                SELECT s.id
                FROM Service s
                WHERE s.product.id = :productId
                  AND s.status = :status
            """)
    List<UUID> findAllServiceIdsByProductIdAndStatus(UUID productId, ServiceStatus status);

    List<UUID> findIdByProductIdAndStatus(UUID productId, ServiceStatus status);

    List<UUID> findIdByStatus(ServiceStatus serviceStatus);

}
