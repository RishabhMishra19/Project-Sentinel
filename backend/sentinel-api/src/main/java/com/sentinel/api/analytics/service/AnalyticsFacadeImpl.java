package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.analytics.mapper.AnalyticsMapper;
import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsMetricsAggregate;
import com.sentinel.api.analytics.service.core.AnalyticsRankingSort;
import com.sentinel.api.analytics.service.core.AnalyticsScope;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandler;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandlerRegistry;
import com.sentinel.api.analytics.service.core.AnalyticsStatsQueryService;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.query.ListQueryFilterReader;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.common.observability.repository.EndpointRepository;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsFacadeImpl implements AnalyticsFacade {

    private static final Set<String> RANKING_SORTABLE = Set.of();

    private final AnalyticsScopeHandlerRegistry handlerRegistry;
    private final AnalyticsStatsQueryService queryService;
    private final AnalyticsMapper analyticsMapper;
    private final EndpointRepository endpointRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse summary(UUID tenantId, ListQueryRequest query) {
        AnalyticsQueryParams params = parseParams(query);
        requireRange(params.from(), params.to());
        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
        AnalyticsMetricsAggregate agg =
                handler.summary(
                        tenantId,
                        params.productId(),
                        params.serviceId(),
                        params.endpointId(),
                        params.from(),
                        params.to(),
                        params.bucket());
        Long activeEndpoints =
                params.scope() == AnalyticsScope.TENANT
                        ? queryService.countActiveEndpoints(tenantId, params.from(), params.to())
                        : null;
        UUID scopeId =
                switch (params.scope()) {
                    case TENANT -> tenantId;
                    case PRODUCT -> params.productId();
                    case SERVICE -> params.serviceId();
                    case ENDPOINT -> params.endpointId();
                };
        return analyticsMapper.toSummary(agg, params.bucket(), scopeId, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query) {
        AnalyticsQueryParams params = parseParams(query);
        requireRange(params.from(), params.to());
        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
        List<AnalyticsMetricsAggregate> rows =
                handler.timeseries(
                        tenantId,
                        params.productId(),
                        params.serviceId(),
                        params.endpointId(),
                        params.from(),
                        params.to(),
                        params.bucket());
        return analyticsMapper.toTimeseries(rows, params.bucket());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AnalyticsRankingItem> rankings(UUID tenantId, ListQueryRequest query) {
        AnalyticsQueryParams params = parseParams(query);
        if (params.scope() == AnalyticsScope.ENDPOINT) {
            throw new BadRequestException("Rankings are not available for ENDPOINT scope");
        }
        requireRange(params.from(), params.to());
        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
        AnalyticsRankingSort sort =
                ListQueryFilterReader.optionalEnum(
                        query, "sortBy", AnalyticsRankingSort.class, AnalyticsRankingSort.TRAFFIC);
        Pageable pageable = query.toPageable(RANKING_SORTABLE);
        List<AnalyticsRankingItem> content =
                handler.rankings(
                                tenantId,
                                params.productId(),
                                params.serviceId(),
                                params.endpointId(),
                                params.from(),
                                params.to(),
                                params.bucket(),
                                sort,
                                pageable)
                        .stream()
                        .map(analyticsMapper::toRankingItem)
                        .toList();
        long total =
                handler.rankingsCount(
                        tenantId,
                        params.productId(),
                        params.serviceId(),
                        params.endpointId(),
                        params.from(),
                        params.to(),
                        params.bucket());
        return new PageResponse<>(content, pageable.getPageNumber(), pageable.getPageSize(), total);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusBreakdownItem> statusBreakdown(
            UUID tenantId, UUID endpointId, ListQueryRequest query) {
        Instant from = query != null ? query.getFrom() : null;
        Instant to = query != null ? query.getTo() : null;
        requireRange(from, to);
        endpointRepository
                .findById_ServiceIdAndId_EndpointId(tenantId, endpointId)
                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
        return queryService.statusBreakdown(endpointId, tenantId, from, to).stream()
                .map(analyticsMapper::toStatusItem)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExceptionMetricItem> exceptions(
            UUID tenantId, UUID endpointId, ListQueryRequest query) {
        Instant from = query != null ? query.getFrom() : null;
        Instant to = query != null ? query.getTo() : null;
        requireRange(from, to);
        endpointRepository
                .findById_ServiceIdAndId_EndpointId(tenantId, endpointId)
                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
        return queryService.exceptionBreakdown(endpointId, tenantId, from, to).stream()
                .map(analyticsMapper::toExceptionItem)
                .toList();
    }

    private AnalyticsQueryParams parseParams(ListQueryRequest query) {
        if (query == null) {
            throw new BadRequestException("Query body is required");
        }
        return new AnalyticsQueryParams(
                ListQueryFilterReader.requireEnum(query, "scope", AnalyticsScope.class),
                ListQueryFilterReader.requireEnum(query, "bucket", AnalyticsBucket.class),
                ListQueryFilterReader.optionalUuid(query, "productId"),
                ListQueryFilterReader.optionalUuid(query, "serviceId"),
                ListQueryFilterReader.optionalUuid(query, "endpointId"),
                query.getFrom(),
                query.getTo());
    }

    private void requireRange(Instant from, Instant to) {
        if (from == null || to == null || !from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
    }

    private record AnalyticsQueryParams(
            AnalyticsScope scope,
            AnalyticsBucket bucket,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Instant from,
            Instant to) {}
}
