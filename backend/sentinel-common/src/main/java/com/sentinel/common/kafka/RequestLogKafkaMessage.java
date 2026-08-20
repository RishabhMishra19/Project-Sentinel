package com.sentinel.common.kafka;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record RequestLogKafkaMessage(
        UUID tenantId,
        UUID productId,
        UUID serviceId,
        String method,
        String path,
        String pathTemplate,
        Instant occurredAt,
        Instant receivedAt,
        int statusCode,
        int durationMs,
        String endUserIp,
        int requestSizeBytes,
        int responseSizeBytes,
        String requestId,
        String userId) {}
