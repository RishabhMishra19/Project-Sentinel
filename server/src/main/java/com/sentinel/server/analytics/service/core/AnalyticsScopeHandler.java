package com.sentinel.server.analytics.service.core;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface AnalyticsScopeHandler {

    AnalyticsScope scope();

    AnalyticsMetricsAggregate summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket);

    List<AnalyticsMetricsAggregate> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket);

    List<AnalyticsMetricsAggregate> rankings(
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
