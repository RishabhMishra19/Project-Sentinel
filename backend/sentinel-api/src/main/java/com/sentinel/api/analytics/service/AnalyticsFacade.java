package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.GetAnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import java.util.List;
import java.util.UUID;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse summary(UUID tenantId, GetAnalyticsSummaryRequestParams params);

    AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query);

    PageResponse<AnalyticsRankingItem> rankings(UUID tenantId, ListQueryRequest query);

    List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query);

    List<ExceptionMetricItem> exceptions(UUID tenantId, UUID endpointId, ListQueryRequest query);
}
