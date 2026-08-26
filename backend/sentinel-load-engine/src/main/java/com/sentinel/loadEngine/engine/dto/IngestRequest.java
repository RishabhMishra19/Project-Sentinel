package com.sentinel.loadEngine.engine.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record IngestRequest(UUID serviceId, String apiKey, List<IngestRequestItem> requests) {
    @Builder
    public record IngestRequestItem(String method,
                                    String path,
                                    Instant occurredAt,
                                    Integer statusCode,
                                    Integer durationMs,
                                    String endUserIp,
                                    Integer requestSizeBytes,
                                    Integer responseSizeBytes,
                                    String requestId,
                                    String traceId,
                                    String userId){}
}
