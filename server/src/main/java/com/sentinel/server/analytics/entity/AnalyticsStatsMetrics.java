package com.sentinel.server.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class AnalyticsStatsMetrics {

    @Id
    @Column(name = "bucket_start", nullable = false)
    private Instant bucketStart;

    @Column(name = "request_count", nullable = false)
    private long requestCount;

    @Column(name = "error_count", nullable = false)
    private long errorCount;

    @Column(name = "status_2xx", nullable = false)
    private long status2xx;

    @Column(name = "status_3xx", nullable = false)
    private long status3xx;

    @Column(name = "status_4xx", nullable = false)
    private long status4xx;

    @Column(name = "status_5xx", nullable = false)
    private long status5xx;

    @Column(name = "latency_sum_ms", nullable = false)
    private long latencySumMs;

    @Column(name = "latency_min_ms", nullable = false)
    private int latencyMinMs;

    @Column(name = "latency_max_ms", nullable = false)
    private int latencyMaxMs;

    @Column(name = "latency_p50_ms", nullable = false)
    private int latencyP50Ms;

    @Column(name = "latency_p95_ms", nullable = false)
    private int latencyP95Ms;

    @Column(name = "latency_p99_ms", nullable = false)
    private int latencyP99Ms;

    @Column(name = "request_bytes_total", nullable = false)
    private long requestBytesTotal;

    @Column(name = "response_bytes_total", nullable = false)
    private long responseBytesTotal;
}
