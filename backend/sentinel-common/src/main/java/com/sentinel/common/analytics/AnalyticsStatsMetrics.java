package com.sentinel.common.analytics;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public abstract class AnalyticsStatsMetrics {

    private long requestCount;
    private long errorCount;

    private long status2xx;
    private long status3xx;
    private long status4xx;
    private long status5xx;

    private long latencySumMs;
    private int latencyMinMs;
    private int latencyMaxMs;
    private int latencyP50Ms;
    private int latencyP95Ms;
    private int latencyP99Ms;

    private long requestBytesTotal;
    private long responseBytesTotal;
}