package com.sentinel.loadEngine.dataGenerator.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "load_test", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoadTest {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "test_data_id", length = 255)
    private String testDataId;

    @Column(name = "target_rps")
    private Integer targetRps;

    @Column
    private Integer concurrency;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "endpoint_count")
    private Integer endpointCount;

    @Column(name = "total_requests")
    private Long totalRequests;

    @Column(name = "successful_requests")
    private Long successfulRequests;

    @Column(name = "failed_requests")
    private Long failedRequests;

    @Column(name = "average_latency_ms")
    private Double averageLatencyMs;

    @Column(name = "p50_latency_ms")
    private Double p50LatencyMs;

    @Column(name = "p95_latency_ms")
    private Double p95LatencyMs;

    @Column(name = "p99_latency_ms")
    private Double p99LatencyMs;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
