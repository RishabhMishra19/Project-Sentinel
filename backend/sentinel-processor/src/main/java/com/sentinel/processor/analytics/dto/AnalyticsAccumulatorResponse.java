package com.sentinel.processor.analytics.dto;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsMinute;
import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsMinute;
import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsMinute;
import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsMinute;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
public class AnalyticsAccumulatorResponse {
    private final List<AnalyticsTenantStatsMinute> tenantMinuteStats =  new ArrayList<>();
    private final List<AnalyticsProductStatsMinute> productMinuteStats =  new ArrayList<>();
    private final List<AnalyticsServiceStatsMinute> serviceMinuteStats =  new ArrayList<>();
    private final List<AnalyticsEndpointStatsMinute> endpointMinuteStats =  new ArrayList<>();
}
