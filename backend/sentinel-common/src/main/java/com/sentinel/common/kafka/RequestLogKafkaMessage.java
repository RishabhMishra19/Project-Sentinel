package com.sentinel.common.kafka;

import lombok.Builder;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
public record RequestLogKafkaMessage(List<RequestLogKafkaMessageItem> requestLogKafkaMessageItems) {
    @Builder
    public record RequestLogKafkaMessageItem(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
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
            String traceId,
            String userId) {}
}

