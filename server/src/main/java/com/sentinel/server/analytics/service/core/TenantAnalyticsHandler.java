package com.sentinel.server.analytics.service.core;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TenantAnalyticsHandler implements AnalyticsScopeHandler {

    private final AnalyticsStatsQueryService queryService;

    @Override
    public AnalyticsScope scope() {
        return AnalyticsScope.TENANT;
    }

    @Override
    public AnalyticsMetricsAggregate summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        return queryService.summarize(AnalyticsScope.TENANT, tenantId, from, to, bucket);
    }

    @Override
    public List<AnalyticsMetricsAggregate> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        return queryService.timeseries(AnalyticsScope.TENANT, tenantId, from, to, bucket);
    }

    @Override
    public List<AnalyticsMetricsAggregate> rankings(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket,
            AnalyticsRankingSort sortBy,
            Pageable pageable) {
        return queryService.rankings(AnalyticsScope.TENANT, tenantId, tenantId, from, to, bucket, sortBy, pageable);
    }

    @Override
    public long rankingsCount(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket) {
        return queryService.rankingsCount(AnalyticsScope.TENANT, tenantId, tenantId, from, to, bucket);
    }
}
