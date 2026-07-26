package com.sentinel.server.observability.dto.response;

public record EndpointResponse(
        String id, String serviceId, String method, String pathTemplate) {}
