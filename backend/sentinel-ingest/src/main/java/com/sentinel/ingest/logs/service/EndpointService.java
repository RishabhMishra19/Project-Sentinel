package com.sentinel.ingest.logs.service;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface EndpointService {

    Map<String, Map<String, UUID>> findPathTemplateMappingForService(UUID serviceId);

    void bulkInsertEndpoints(List<Endpoint> endpoints);

    void bulkUpdateLastSeenToNow(List<UUID> endpointIds);

}
