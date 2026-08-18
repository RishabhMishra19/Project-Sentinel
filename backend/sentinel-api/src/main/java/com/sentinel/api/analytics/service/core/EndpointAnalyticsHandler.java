package com.sentinel.api.analytics.service.core;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.repository.EndpointRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EndpointAnalyticsHandler implements AnalyticsScopeHandler {

    private final AnalyticsStatsQueryService queryService;
    private final EndpointRepository endpointRepository;

    @Override
    public AnalyticsScope scope() {
        return AnalyticsScope.ENDPOINT;
    }

    @Override
    public AnalyticsMetricsAggregate summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireEndpoint(serviceId, endpointId);
        return queryService.summarize(AnalyticsScope.ENDPOINT, id, from, to, bucket);
    }

    @Override
    public List<AnalyticsMetricsAggregate> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireEndpoint(serviceId, endpointId);
        return queryService.timeseries(AnalyticsScope.ENDPOINT, id, from, to, bucket);
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
        requireEndpoint(serviceId, endpointId);
        return List.of();
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
        requireEndpoint(serviceId, endpointId);
        return 0L;
    }

    private UUID requireEndpoint(UUID serviceId, UUID endpointId) {
        if (endpointId == null) {
            throw new BadRequestException("endpointId is required for ENDPOINT scope");
        }
        endpointRepository
                .findById(new Endpoint.PrimaryKeyComposite(serviceId, endpointId))
                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
        return endpointId;
    }
}
