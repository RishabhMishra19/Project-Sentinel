package com.sentinel.common.analytics.service;

import com.sentinel.common.analytics.dto.AnalyticsEntityAggregatedMetrics;
import com.sentinel.common.analytics.dto.AnalyticsTimeSeriesMetrics;
import com.sentinel.common.analytics.entity.AnalyticsStatsMetrics;
import com.sentinel.common.analytics.utils.AnalyticsBucket;
import com.sentinel.common.analytics.utils.AnalyticsScope;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsService {

    AnalyticsStatsMetrics findStats(
            UUID entityId,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    );

    List<AnalyticsEntityAggregatedMetrics> findAggregatedMetrics(
            List<UUID> entityIds,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    );

    List<AnalyticsTimeSeriesMetrics> findTimeSeriesMetrics(
            UUID entityId,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    );

}
