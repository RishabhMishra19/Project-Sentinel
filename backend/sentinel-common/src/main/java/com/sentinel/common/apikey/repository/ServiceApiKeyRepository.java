package com.sentinel.common.apikey.repository;

import com.sentinel.common.apikey.entity.ServiceApiKey;
import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface ServiceApiKeyRepository
    extends JpaRepository<ServiceApiKey, UUID>, JpaSpecificationExecutor<ServiceApiKey> {

    boolean existsByServiceIdAndStatus(UUID serviceId, ServiceApiKeyStatus status);

    Optional<ServiceApiKey> findByIdAndServiceId(UUID id, UUID serviceId);

    Optional<ServiceApiKey> findByKeyHashAndStatus(String keyHash, ServiceApiKeyStatus status);

    boolean existsByKeyHashAndServiceIdAndStatus(String keyHash, UUID serviceId, ServiceApiKeyStatus status);
}
