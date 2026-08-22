package com.sentinel.common.analytics.dto.response;

import com.sentinel.common.analytics.dto.AnalyticsStatsMetrics;
import com.sentinel.common.analytics.utils.AnalyticsBucket;
import com.sentinel.common.analytics.utils.AnalyticsScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TotalStatsResponse {

    private AnalyticsBucket bucket;
    private AnalyticsScope scope;
    private UUID entityId;
    private AnalyticsStatsMetrics totalStats;

}
