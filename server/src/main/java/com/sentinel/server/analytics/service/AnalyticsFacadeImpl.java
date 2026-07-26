package com.sentinel.server.analytics.service;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.analytics.mapper.AnalyticsMapper;
import com.sentinel.server.analytics.service.core.AnalyticsBucket;
import com.sentinel.server.analytics.service.core.AnalyticsMetricsAggregate;
import com.sentinel.server.analytics.service.core.AnalyticsRankingSort;
import com.sentinel.server.analytics.service.core.AnalyticsScope;
import com.sentinel.server.analytics.service.core.AnalyticsScopeHandler;
import com.sentinel.server.analytics.service.core.AnalyticsScopeHandlerRegistry;
import com.sentinel.server.analytics.service.core.AnalyticsStatsQueryService;
import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.observability.repository.EndpointRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsFacadeImpl implements AnalyticsFacade {

    private final AnalyticsScopeHandlerRegistry handlerRegistry;
    private final AnalyticsStatsQueryService queryService;
    private final AnalyticsMapper analyticsMapper;
    private final EndpointRepository endpointRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse summary(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket) {
        requireRange(from, to);
        AnalyticsScopeHandler handler = handlerRegistry.get(scope);
        AnalyticsMetricsAggregate agg =
                handler.summary(tenantId, productId, serviceId, endpointId, from, to, bucket);
        Long activeEndpoints =
                scope == AnalyticsScope.TENANT ? queryService.countActiveEndpoints(tenantId, from, to) : null;
        UUID scopeId =
                switch (scope) {
                    case TENANT -> tenantId;
                    case PRODUCT -> productId;
                    case SERVICE -> serviceId;
                    case ENDPOINT -> endpointId;
                };
        return analyticsMapper.toSummary(agg, bucket, scopeId, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTimeseriesResponse timeseries(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsBucket bucket) {
        requireRange(from, to);
        AnalyticsScopeHandler handler = handlerRegistry.get(scope);
        List<AnalyticsMetricsAggregate> rows =
                handler.timeseries(tenantId, productId, serviceId, endpointId, from, to, bucket);
        return analyticsMapper.toTimeseries(rows, bucket);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AnalyticsRankingItem> rankings(
            UUID tenantId,
            AnalyticsScope scope,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to,
            AnalyticsRankingSort sortBy,
            Pageable pageable,
            AnalyticsBucket bucket) {
        if (scope == AnalyticsScope.ENDPOINT) {
            throw new BadRequestException("Rankings are not available for ENDPOINT scope");
        }
        requireRange(from, to);
        AnalyticsScopeHandler handler = handlerRegistry.get(scope);
        AnalyticsRankingSort sort = sortBy == null ? AnalyticsRankingSort.TRAFFIC : sortBy;
        List<AnalyticsRankingItem> content =
                handler.rankings(tenantId, productId, serviceId, endpointId, from, to, bucket, sort, pageable)
                        .stream()
                        .map(analyticsMapper::toRankingItem)
                        .toList();
        long total =
                handler.rankingsCount(tenantId, productId, serviceId, endpointId, from, to, bucket);
        return new PageResponse<>(content, pageable.getPageNumber(), pageable.getPageSize(), total);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, Instant from, Instant to) {
        requireRange(from, to);
        endpointRepository
                .findByIdAndServiceProductTenantId(endpointId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
        return queryService.statusBreakdown(endpointId, tenantId, from, to).stream()
                .map(analyticsMapper::toStatusItem)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExceptionMetricItem> exceptions(UUID tenantId, UUID endpointId, Instant from, Instant to) {
        requireRange(from, to);
        endpointRepository
                .findByIdAndServiceProductTenantId(endpointId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
        return queryService.exceptionBreakdown(endpointId, tenantId, from, to).stream()
                .map(analyticsMapper::toExceptionItem)
                .toList();
    }

    private void requireRange(Instant from, Instant to) {
        if (from == null || to == null || !from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
    }
}
