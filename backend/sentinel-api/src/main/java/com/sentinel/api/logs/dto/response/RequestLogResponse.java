package com.sentinel.api.logs.dto.response;

import java.time.Instant;
import java.util.UUID;

public record RequestLogResponse(
        UUID id,
        UUID serviceInstanceId,
        UUID endpointId,
        String requestId,
        String traceId,
        Instant occurredAt,
        String endUserIp,
        String userId,
        int statusCode,
        int durationMs,
        Integer requestSizeBytes,
        Integer responseSizeBytes,
        Instant receivedAt,
        String method,
        String pathTemplate,
        UUID serviceId,
        String serviceName,
        UUID productId,
        String productName) {}
