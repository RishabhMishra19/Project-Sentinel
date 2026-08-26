package com.sentinel.loadEngine.loadTestRun.entity;


import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoadTestRunLogConfig {

    public LoadTestRunLogConfig(RunLoadTestRequest request) {
        this.targetRps = request.targetRps();
        this.concurrency = request.concurrency();
        this.durationSeconds = request.durationSeconds();
        this.minLatencyMs = request.minLatencyMs();
        this.maxLatencyMs = request.maxLatencyMs();
        this.failureRatePercentage = request.failureRatePercentage();
        this.minRequestOccurredAtTime = request.minRequestOccurredAtTime();
        this.maxRequestOccurredAtTime = request.maxRequestOccurredAtTime();
    }

    int targetRps;
    int concurrency;
    int durationSeconds;
    int minLatencyMs;
    int maxLatencyMs;
    double failureRatePercentage;
    Instant minRequestOccurredAtTime;
    Instant maxRequestOccurredAtTime;
}
