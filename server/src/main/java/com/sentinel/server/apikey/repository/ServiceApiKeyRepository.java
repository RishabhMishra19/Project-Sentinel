package com.sentinel.server.apikey.repository;

import com.sentinel.server.apikey.entity.ServiceApiKey;
import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ServiceApiKeyRepository
        extends JpaRepository<ServiceApiKey, UUID>, JpaSpecificationExecutor<ServiceApiKey> {

    boolean existsByServiceIdAndStatus(UUID serviceId, ServiceApiKeyStatus status);

    @Override
    @EntityGraph(attributePaths = {"service", "createdBy", "updatedBy"})
    Page<ServiceApiKey> findAll(Specification<ServiceApiKey> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"service", "createdBy", "updatedBy"})
    Optional<ServiceApiKey> findWithAuditByIdAndServiceId(UUID id, UUID serviceId);
}
