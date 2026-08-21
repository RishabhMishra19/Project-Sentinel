package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsQueryRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsRankingQueryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryQueryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import java.util.List;
import java.util.UUID;

public interface AnalyticsFacade {

    AnalyticsSummaryQueryResponse summary(AnalyticsQueryRequestParams params);

    AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query);

    AnalyticsRankingQueryResponse rankings(AnalyticsQueryRequestParams params);

    List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query);

}
