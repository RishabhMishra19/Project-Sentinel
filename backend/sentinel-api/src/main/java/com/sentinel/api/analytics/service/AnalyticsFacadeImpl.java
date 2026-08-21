package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsQueryRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsRankingQueryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryQueryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.common.analytics.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsMetrics;
import com.sentinel.api.analytics.service.core.AnalyticsRankingSort;
import com.sentinel.common.analytics.AnalyticsRepository;
import com.sentinel.common.analytics.AnalyticsScope;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandler;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandlerRegistry;
import com.sentinel.api.analytics.service.core.EndpointService;
import com.sentinel.api.analytics.utils.AnalyticsUtils;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.query.ListQueryFilterReader;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.common.analytics.AnalyticsStatsMetrics;
import com.sentinel.common.observability.repository.EndpointRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    private final EndpointRepository endpointRepository;
    private final EndpointService endpointService;
    private final AnalyticsRepository  analyticsRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryQueryResponse summary(AnalyticsQueryRequestParams params) {
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        AnalyticsStatsMetrics metrics = analyticsRepository.findStats(params.entityId(), params.from(), params.to(), params.scope(), bucket);
        long activeEndpoints = endpointService.countEndPoints(params.entityId(), params.scope());
        return new AnalyticsSummaryQueryResponse(bucket, params.entityId(), metrics, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query) {
        AnalyticsQueryParams params = parseParams(query);
        requireRange(params.from(), params.to());
        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
        List<AnalyticsMetrics> rows = handler.timeseries(
                tenantId, params.productId(), params.serviceId(), params.endpointId(), params.from(), params.to(),
                params.bucket()
        );
//        return analyticsMapper.toTimeseries(rows, params.bucket());
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsRankingQueryResponse rankings(AnalyticsQueryRequestParams params) {
        if(params.scope().equals(AnalyticsScope.TENANT)) {
            throw new BadRequestException("Ranking scope can not be tenant");
        }
//        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
//        AnalyticsBucketService bucketService = bucketServiceFactory.getAnalyticsService(AnalyticsScope.PRODUCT, bucket);
//
//        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
//        AnalyticsRankingSort sort = ListQueryFilterReader.optionalEnum(
//                query, "sortBy", AnalyticsRankingSort.class,
//                AnalyticsRankingSort.TRAFFIC
//        );
//        Pageable pageable = query.toPageable(RANKING_SORTABLE);
//        List<AnalyticsRankingQueryResponse> content = handler.rankings(
//                tenantId, params.productId(), params.serviceId(), params.endpointId(), params.from(), params.to(),
//                params.bucket(), sort, pageable
//        ).stream().map(analyticsMapper::toRankingItem).toList();
//        long total = handler.rankingsCount(
//                tenantId, params.productId(), params.serviceId(), params.endpointId(), params.from(), params.to(),
//                params.bucket()
//        );
//        return new PageResponse<>(content, pageable.getPageNumber(), pageable.getPageSize(), total);
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusBreakdownItem> statusBreakdown(UUID tenantId, UUID endpointId, ListQueryRequest query) {
//        Instant from = query != null ? query.getFrom() : null;
//        Instant to = query != null ? query.getTo() : null;
//        requireRange(from, to);
//        endpointRepository
//                .findById_ServiceIdAndId_EndpointId(tenantId, endpointId)
//                .orElseThrow(() -> new ResourceNotFoundException("Endpoint not found"));
//        return queryService
//                .statusBreakdown(endpointId, tenantId, from, to)
//                .stream()
//                .map(analyticsMapper::toStatusItem)
//                .toList();
        return null;
    }

    private AnalyticsQueryParams parseParams(ListQueryRequest query) {
        if (query == null) {
            throw new BadRequestException("Query body is required");
        }
        return new AnalyticsQueryParams(
                ListQueryFilterReader.requireEnum(query, "scope", AnalyticsScope.class), this.decideBucket(query),
                ListQueryFilterReader.optionalUuid(query, "productId"),
                ListQueryFilterReader.optionalUuid(query, "serviceId"),
                ListQueryFilterReader.optionalUuid(query, "endpointId"), query.getFrom(), query.getTo()
        );
    }

    private AnalyticsBucket decideBucket(ListQueryRequest query) {
        Instant from = query.getFrom();
        Instant to = query.getTo();
        if (from.truncatedTo(ChronoUnit.DAYS).isBefore(to.truncatedTo(ChronoUnit.DAYS))) {
            return AnalyticsBucket.DAY;
        }
        if (from.truncatedTo(ChronoUnit.HOURS).isBefore(to.truncatedTo(ChronoUnit.HOURS))) {
            return AnalyticsBucket.HOUR;
        }
        return AnalyticsBucket.MINUTE;
    }

    private void requireRange(Instant from, Instant to) {
        if (from == null || to == null || !from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
    }

    private record AnalyticsQueryParams(AnalyticsScope scope, AnalyticsBucket bucket, UUID productId, UUID serviceId,
                                        UUID endpointId, Instant from, Instant to) {}

}
