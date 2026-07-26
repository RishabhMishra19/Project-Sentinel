package com.sentinel.server.analytics.service;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.analytics.service.core.AnalyticsRankingSort;
import com.sentinel.server.analytics.service.core.AnalyticsScope;
import com.sentinel.server.common.response.PageResponse;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface AnalyticsFacade {

    AnalyticsSummaryResponse summary(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to);

    AnalyticsTimeseriesResponse timeseries(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to);

    PageResponse<AnalyticsRankingItem> rankings(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsRankingSort sortBy,
            Pageable pageable);

    List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, Instant from, Instant to);

    List<ExceptionMetricItem> exceptions(UUID tenantId, UUID endpointId, Instant from, Instant to);
}
