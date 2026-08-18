package com.sentinel.ingest.event.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public record IngestEventItem(
        @NotBlank @Size(max = 16) String method,
        @NotBlank @Size(max = 2048) String path,
        @NotNull Instant occurredAt,
        @NotNull @Min(100) @Max(599) Integer statusCode,
        @NotNull @Min(0) Integer durationMs,
        @NotBlank @Size(max = 64) String endUserIp,
        @NotNull @Min(0) Integer requestSizeBytes,
        @NotNull @Min(0) Integer responseSizeBytes,
        @Size(max = 128) String requestId,
        @Size(max = 128) String userId) {}
