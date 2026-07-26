package com.sentinel.ingest.instance.service;

import com.sentinel.common.observability.entity.ServiceInstance;
import com.sentinel.ingest.instance.dto.response.InstanceResponse;
import com.sentinel.ingest.instance.service.core.ServiceInstanceService;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InstanceFacadeImpl implements InstanceFacade {

    private final ServiceInstanceService serviceInstanceService;

    public InstanceFacadeImpl(ServiceInstanceService serviceInstanceService) {
        this.serviceInstanceService = serviceInstanceService;
    }

    @Override
    public InstanceResponse register(UUID serviceId) {
        ServiceInstance instance = serviceInstanceService.register(serviceId);
        return new InstanceResponse(instance.getId());
    }

    @Override
    public void heartbeat(UUID instanceId, UUID serviceId) {
        serviceInstanceService.heartbeat(instanceId, serviceId);
    }
}
