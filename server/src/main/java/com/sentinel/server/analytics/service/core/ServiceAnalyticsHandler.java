package com.sentinel.server.analytics.service.core;

import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.service.repository.ServiceRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceAnalyticsHandler implements AnalyticsScopeHandler {

    private final AnalyticsStatsQueryService queryService;
    private final ServiceRepository serviceRepository;

    @Override
    public AnalyticsScope scope() {
        return AnalyticsScope.SERVICE;
    }

    @Override
    public AnalyticsMetricsAggregate summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireService(tenantId, serviceId);
        return queryService.summarize(AnalyticsScope.SERVICE, id, from, to, bucket);
    }

    @Override
    public List<AnalyticsMetricsAggregate> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireService(tenantId, serviceId);
        return queryService.timeseries(AnalyticsScope.SERVICE, id, from, to, bucket);
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
        UUID id = requireService(tenantId, serviceId);
        return queryService.rankings(AnalyticsScope.SERVICE, id, tenantId, from, to, bucket, sortBy, pageable);
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
        UUID id = requireService(tenantId, serviceId);
        return queryService.rankingsCount(AnalyticsScope.SERVICE, id, tenantId, from, to, bucket);
    }

    private UUID requireService(UUID tenantId, UUID serviceId) {
        if (serviceId == null) {
            throw new BadRequestException("serviceId is required for SERVICE scope");
        }
        var service =
                serviceRepository
                        .findWithAuditById(serviceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!tenantId.equals(service.getProduct().getTenant().getId())) {
            throw new ResourceNotFoundException("Service not found");
        }
        return serviceId;
    }
}
