package com.sentinel.common.analytics.dto;

import com.sentinel.common.analytics.entity.AnalyticsStatsMetrics;
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
