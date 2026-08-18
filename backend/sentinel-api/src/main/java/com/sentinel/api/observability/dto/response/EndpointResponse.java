package com.sentinel.api.observability.dto.response;

public record EndpointResponse(
        String id, String serviceId, String method, String pathTemplate) {}
