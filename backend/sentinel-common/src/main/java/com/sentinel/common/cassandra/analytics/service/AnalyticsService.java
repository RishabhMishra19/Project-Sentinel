package com.sentinel.common.cassandra.analytics.service;

import com.sentinel.common.cassandra.analytics.dto.response.EntityAggregatedStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TimeSeriesStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TotalStatsResponse;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsService {

    TotalStatsResponse findTotalStats(
        UUID entityId,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    );

    EntityAggregatedStatsResponse findEntityAggregatedStats(
        List<UUID> entityIds,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    );

    TimeSeriesStatsResponse findTimeSeriesStats(
        UUID entityId,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    );

}
