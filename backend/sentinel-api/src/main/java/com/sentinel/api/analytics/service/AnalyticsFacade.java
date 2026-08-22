package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsChildrenAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsChildrenAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse getSummary(AnalyticsSummaryRequestParams params);

    AnalyticsTimeSeriesResponse getTimeSeries(AnalyticsTimeSeriesRequestParams params);

    AnalyticsChildrenAggregatedResponse getChildrenAggregated(AnalyticsChildrenAggregatedRequestParams params);

}
