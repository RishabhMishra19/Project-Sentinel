package com.sentinel.common.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class AnalyticsEntityAggregatedMetrics {

    private UUID scopeId;
    private AnalyticsStatsMetrics statsMetrics;

}
