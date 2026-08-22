package com.sentinel.common.cassandra.analytics.dto.response;

import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TimeSeriesStatsResponse {

    private AnalyticsBucket bucket;
    private AnalyticsScope scope;
    private UUID entityId;
    private List<AnalyticsStatsMetrics> timeSeriesStats;

}
