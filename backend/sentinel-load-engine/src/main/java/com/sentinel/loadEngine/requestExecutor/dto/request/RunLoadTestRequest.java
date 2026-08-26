package com.sentinel.loadEngine.requestExecutor.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record RunLoadTestRequest(
    @Min(1) int targetRps,
    @Min(1) int concurrency,
    @Min(1) int durationSeconds,

    @Min(0) int minLatencyMs,
    @Min(0) int maxLatencyMs,

    @Min(0) @Max(100) double failureRatePercentage,
    @NotNull Instant minRequestOccurredAtTime,
    @NotNull Instant maxRequestOccurredAtTime
    ) {
}
