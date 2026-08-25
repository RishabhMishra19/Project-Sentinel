package com.sentinel.loadEngine.dataGenerator.dto.response;

import com.sentinel.loadEngine.dataGenerator.entity.LoadTest;

import java.time.LocalDateTime;
import java.util.UUID;

public record LoadTestResponse(
    UUID testDataId,
    Integer targetRps,
    Integer concurrency,
    Long durationMs,
    Integer tenantCount,
    Integer productCount,
    Integer serviceCount,
    Long totalRequests,
    Long successfulRequests,
    Long failedRequests,
    Double averageLatencyMs,
    Double p50LatencyMs,
    Double p95LatencyMs,
    Double p99LatencyMs,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

    public LoadTestResponse(LoadTest loadTest) {
        this(
            loadTest.getId(),
            loadTest.getTargetRps(),
            loadTest.getConcurrency(),
            loadTest.getDurationMs(),
            loadTest.getTenantCount(),
            loadTest.getProductCount(),
            loadTest.getServiceCount(),
            loadTest.getTotalRequests(),
            loadTest.getSuccessfulRequests(),
            loadTest.getFailedRequests(),
            loadTest.getAverageLatencyMs(),
            loadTest.getP50LatencyMs(),
            loadTest.getP95LatencyMs(),
            loadTest.getP99LatencyMs(),
            loadTest.getStartedAt(),
            loadTest.getCompletedAt(),
            loadTest.getCreatedAt(),
            loadTest.getUpdatedAt()
        );
    }
}
