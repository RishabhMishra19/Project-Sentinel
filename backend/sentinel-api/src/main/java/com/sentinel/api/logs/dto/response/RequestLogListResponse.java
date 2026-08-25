package com.sentinel.api.logs.dto.response;

import java.time.Instant;
import java.util.UUID;

public record RequestLogListResponse(
    UUID id,
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
    String method,
    String pathTemplate,
    UUID serviceId,
    String serviceName,
    UUID productId,
    String productName) {
}
