package com.sentinel.api.analytics.service.core;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.product.repository.ProductRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductAnalyticsHandler implements AnalyticsScopeHandler {

    private final AnalyticsStatsQueryService queryService;
    private final ProductRepository productRepository;

    @Override
    public AnalyticsScope scope() {
        return AnalyticsScope.PRODUCT;
    }

    @Override
    public AnalyticsMetricsAggregate summary(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireProduct(tenantId, productId);
        return queryService.summarize(AnalyticsScope.PRODUCT, id, from, to, bucket);
    }

    @Override
    public List<AnalyticsMetricsAggregate> timeseries(
            UUID tenantId, UUID productId, UUID serviceId, UUID endpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        UUID id = requireProduct(tenantId, productId);
        return queryService.timeseries(AnalyticsScope.PRODUCT, id, from, to, bucket);
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
        UUID id = requireProduct(tenantId, productId);
        return queryService.rankings(AnalyticsScope.PRODUCT, id, tenantId, from, to, bucket, sortBy, pageable);
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
        UUID id = requireProduct(tenantId, productId);
        return queryService.rankingsCount(AnalyticsScope.PRODUCT, id, tenantId, from, to, bucket);
    }

    private UUID requireProduct(UUID tenantId, UUID productId) {
        if (productId == null) {
            throw new BadRequestException("productId is required for PRODUCT scope");
        }
        productRepository
                .findWithAuditByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productId;
    }
}
