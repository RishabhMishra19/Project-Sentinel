package com.sentinel.ingest.instance.service.core;

import com.sentinel.common.observability.entity.ServiceInstance;
import com.sentinel.common.observability.repository.ServiceInstanceRepository;
import com.sentinel.ingest.common.exception.NotFoundException;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceInstanceServiceImpl implements ServiceInstanceService {

    private final ServiceInstanceRepository serviceInstanceRepository;

    public ServiceInstanceServiceImpl(ServiceInstanceRepository serviceInstanceRepository) {
        this.serviceInstanceRepository = serviceInstanceRepository;
    }

    @Override
    @Transactional
    public ServiceInstance register(UUID serviceId) {
        Instant now = Instant.now();
        ServiceInstance instance = new ServiceInstance();
        instance.setServiceId(serviceId);
        instance.setStartedAt(now);
        instance.setLastSeenAt(now);
        return serviceInstanceRepository.save(instance);
    }

    @Override
    @Transactional
    public ServiceInstance heartbeat(UUID instanceId, UUID serviceId) {
        ServiceInstance instance = serviceInstanceRepository
                .findByIdAndServiceId(instanceId, serviceId)
                .orElseThrow(() -> new NotFoundException("Service instance not found"));
        instance.setLastSeenAt(Instant.now());
        return serviceInstanceRepository.save(instance);
    }
}
