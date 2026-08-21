package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.common.query.ListQueryRequest;

import java.util.List;
import java.util.UUID;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse summary(AnalyticsSummaryRequestParams params);

    AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query);

    AnalyticsEntityAggregatedResponse rankings(AnalyticsEntityAggregatedRequestParams params);

    List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query);

}
