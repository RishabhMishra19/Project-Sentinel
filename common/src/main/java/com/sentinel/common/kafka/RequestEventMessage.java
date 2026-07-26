package com.sentinel.common.kafka;

import java.time.Instant;
import java.util.UUID;

public record RequestEventMessage(
        UUID serviceId,
        UUID serviceInstanceId,
        String method,
        String path,
        Instant occurredAt,
        Instant receivedAt,
        int statusCode,
        int durationMs,
        String endUserIp,
        int requestSizeBytes,
        int responseSizeBytes,
        String requestId,
        String userId) {}
