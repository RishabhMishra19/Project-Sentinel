package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse getSummary(AnalyticsSummaryRequestParams params);

    AnalyticsTimeSeriesResponse getTimeSeries(AnalyticsTimeSeriesRequestParams params);

    AnalyticsEntityAggregatedResponse getEntityAggregated(AnalyticsEntityAggregatedRequestParams params);

}
