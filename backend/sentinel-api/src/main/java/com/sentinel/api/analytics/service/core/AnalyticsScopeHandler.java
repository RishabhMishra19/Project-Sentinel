package com.sentinel.api.analytics.service.core;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.sentinel.common.analytics.AnalyticsBucket;
import org.springframework.data.domain.Pageable;

public interface AnalyticsScopeHandler {

    com.sentinel.common.analytics.AnalyticsScope scope();

    AnalyticsMetrics summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket);

    List<AnalyticsMetrics> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket);

    List<AnalyticsMetrics> rankings(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable);

    long rankingsCount(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket);
}
