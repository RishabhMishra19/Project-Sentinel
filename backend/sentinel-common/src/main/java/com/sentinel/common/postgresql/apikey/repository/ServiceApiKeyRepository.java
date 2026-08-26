package com.sentinel.common.postgresql.apikey.repository;

import com.sentinel.common.postgresql.apikey.entity.ServiceApiKey;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceApiKeyRepository
    extends JpaRepository<ServiceApiKey, UUID>, JpaSpecificationExecutor<ServiceApiKey> {

    boolean existsByServiceIdAndStatus(UUID serviceId, ServiceApiKeyStatus status);

    Optional<ServiceApiKey> findByIdAndServiceId(UUID id, UUID serviceId);

    Optional<ServiceApiKey> findByKeyHashAndStatus(String keyHash, ServiceApiKeyStatus status);

    boolean existsByKeyHashAndServiceIdAndStatus(String keyHash, UUID serviceId, ServiceApiKeyStatus status);

    List<ServiceApiKey> findByServiceIdIn(List<UUID> serviceIds);
}
