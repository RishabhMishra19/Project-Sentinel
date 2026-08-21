package com.sentinel.common.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class AnalyticsTimeSeriesMetrics {

    private Instant bucketStart;
    private AnalyticsStatsMetrics statsMetrics;

}
