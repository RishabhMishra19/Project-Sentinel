package com.sentinel.api.analytics.service;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import java.util.List;
import java.util.UUID;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse summary(UUID tenantId, ListQueryRequest query);

    AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query);

    PageResponse<AnalyticsRankingItem> rankings(UUID tenantId, ListQueryRequest query);

    List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query);

    List<ExceptionMetricItem> exceptions(UUID tenantId, UUID endpointId, ListQueryRequest query);
}
