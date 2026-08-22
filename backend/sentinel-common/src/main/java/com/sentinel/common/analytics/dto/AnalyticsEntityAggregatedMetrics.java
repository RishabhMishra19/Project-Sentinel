package com.sentinel.common.analytics.dto;

import com.sentinel.common.analytics.entity.AnalyticsStatsMetrics;
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
