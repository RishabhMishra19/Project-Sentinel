package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.entity.AnalyticsStatsMetrics;
import com.sentinel.common.analytics.utils.AnalyticsBucket;
import com.sentinel.common.analytics.utils.AnalyticsScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryResponse extends AnalyticsStatsMetrics {

    public AnalyticsSummaryResponse(
            AnalyticsBucket bucket,
            AnalyticsScope scope,
            UUID scopeId,
            Long activeEndpointCount,
            AnalyticsStatsMetrics statsMetrics
    ) {
        super(statsMetrics);
        this.bucket = bucket;
        this.scope = scope;
        this.scopeId = scopeId;
        this.activeEndpointCount = activeEndpointCount;
    }

    private AnalyticsBucket bucket;
    private AnalyticsScope scope;
    private UUID scopeId;
    private Double errorRate;
    private Long activeEndpointCount;

}
