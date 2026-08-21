package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.common.query.ListQueryRequest;

import java.util.List;
import java.util.UUID;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse getSummary(AnalyticsSummaryRequestParams params);

    AnalyticsTimeSeriesResponse getTimeSeries(AnalyticsTimeSeriesRequestParams params);

    AnalyticsEntityAggregatedResponse getEntityAggregated(AnalyticsEntityAggregatedRequestParams params);

    List<StatusBreakdownItem> getStatusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query);

}
