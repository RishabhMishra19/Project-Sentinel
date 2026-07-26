package com.sentinel.ingest.instance.service.core;

import com.sentinel.common.observability.entity.ServiceInstance;
import java.util.UUID;

public interface ServiceInstanceService {

    ServiceInstance register(UUID serviceId);

    ServiceInstance heartbeat(UUID instanceId, UUID serviceId);
}
