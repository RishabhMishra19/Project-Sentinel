package com.sentinel.ingest.logs.service;

import com.sentinel.ingest.logs.dto.EndpointKey;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface EndpointService {

    Map<EndpointKey, UUID> upsertEndpointsAndReturnIdMapping(Set<EndpointKey> endpointKeys);

}
