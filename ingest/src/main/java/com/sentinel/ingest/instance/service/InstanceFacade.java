package com.sentinel.ingest.instance.service;

import com.sentinel.ingest.instance.dto.response.InstanceResponse;
import java.util.UUID;

public interface InstanceFacade {

    InstanceResponse register(UUID serviceId);

    void heartbeat(UUID instanceId, UUID serviceId);
}
