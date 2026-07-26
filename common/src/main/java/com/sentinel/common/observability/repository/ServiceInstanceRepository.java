package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.ServiceInstance;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceInstanceRepository extends JpaRepository<ServiceInstance, UUID> {

    Optional<ServiceInstance> findByIdAndServiceId(UUID id, UUID serviceId);
}
