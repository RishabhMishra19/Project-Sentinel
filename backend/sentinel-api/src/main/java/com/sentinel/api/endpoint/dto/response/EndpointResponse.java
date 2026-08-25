package com.sentinel.api.endpoint.dto.response;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;

import java.time.Instant;
import java.util.UUID;

public record EndpointResponse(
    UUID id, UUID serviceId, String method, String pathTemplate, Instant firstSeenAt, Instant lastSeenAt
) {
    public EndpointResponse(Endpoint endpoint) {
        this(
            endpoint.getId(),
            endpoint.getServiceId(),
            endpoint.getMethod(),
            endpoint.getPathTemplate(),
            endpoint.getFirstSeenAt(),
            endpoint.getLastSeenAt()
        );
    }
}
