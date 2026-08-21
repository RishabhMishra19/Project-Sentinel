package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.analytics.service.core.AnalyticsMetrics;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandler;
import com.sentinel.api.analytics.service.core.AnalyticsScopeHandlerRegistry;
import com.sentinel.api.analytics.service.core.EndpointService;
import com.sentinel.api.analytics.utils.AnalyticsUtils;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.query.ListQueryFilterReader;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.product.entity.ProductStatus;
import com.sentinel.api.product.repository.ProductRepository;
import com.sentinel.api.service.entity.ServiceStatus;
import com.sentinel.api.service.repository.ServiceRepository;
import com.sentinel.api.tenant.entity.TenantStatus;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.common.analytics.AnalyticsBucket;
import com.sentinel.common.analytics.AnalyticsEntityAggregatedMetrics;
import com.sentinel.common.analytics.AnalyticsRepository;
import com.sentinel.common.analytics.AnalyticsScope;
import com.sentinel.common.analytics.AnalyticsStatsMetrics;
import com.sentinel.common.observability.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsFacadeImpl implements AnalyticsFacade {

    private static final Set<String> RANKING_SORTABLE = Set.of();
    private final AnalyticsScopeHandlerRegistry handlerRegistry;
    private final EndpointService endpointService;
    private final AnalyticsRepository analyticsRepository;
    private final TenantRepository tenantRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EndpointRepository endpointRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse summary(AnalyticsSummaryRequestParams params) {
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        AnalyticsStatsMetrics metrics = analyticsRepository.findStats(
                params.entityId(),
                params.from(),
                params.to(),
                params.scope(),
                bucket
        );
        long activeEndpoints = endpointService.countEndPoints(params.entityId(), params.scope());
        return new AnalyticsSummaryResponse(bucket, params.entityId(), metrics, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTimeseriesResponse timeseries(UUID tenantId, ListQueryRequest query) {
        AnalyticsQueryParams params = parseParams(query);
        requireRange(params.from(), params.to());
        AnalyticsScopeHandler handler = handlerRegistry.get(params.scope());
        List<AnalyticsMetrics> rows = handler.timeseries(
                tenantId,
                params.productId(),
                params.serviceId(),
                params.endpointId(),
                params.from(),
                params.to(),
                params.bucket()
        );
//        return analyticsMapper.toTimeseries(rows, params.bucket());
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsEntityAggregatedResponse entityAggregated(AnalyticsEntityAggregatedRequestParams params) {
        List<UUID> entityIds = null;
        switch (params.scope()) {
            case TENANT -> {
                entityIds = tenantRepository.findIdsByStatus(TenantStatus.ACTIVE);
            }
            case PRODUCT -> {
                if (params.tenantId() != null) {
                    entityIds = productRepository.findIdsByTenantIdAndStatus(params.tenantId(), ProductStatus.ACTIVE);
                } else {
                    entityIds = productRepository.findIdsByStatus(ProductStatus.ACTIVE);
                }
            }
            case SERVICE -> {
                if (params.productId() != null) {
                    entityIds = serviceRepository.findIdsByProductIdAndStatus(params.productId(), ServiceStatus.ACTIVE);
                } else {
                    entityIds = serviceRepository.findIdsByStatus(ServiceStatus.ACTIVE);
                }
            }
            case ENDPOINT -> {
                if (params.serviceId() != null) {
                    entityIds = endpointRepository.findIdsByServiceId(params.serviceId());
                } else {
                    entityIds = endpointRepository.findAllIds();
                }
            }
        }
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        List<AnalyticsEntityAggregatedMetrics> aggregatedMetricsList = analyticsRepository.findAggregatedMetrics(
                entityIds,
                params.from(),
                params.to(),
                params.scope(),
                bucket
        );
        AnalyticsEntityAggregatedResponse response = new AnalyticsEntityAggregatedResponse(new ArrayList<>());
        for (AnalyticsEntityAggregatedMetrics entityAggregatedMetrics : aggregatedMetricsList) {
            long activeEndpoints = endpointService.countEndPoints(entityAggregatedMetrics.getScopeId(), params.scope());
            response.items()
                    .add(new AnalyticsEntityAggregatedResponse.AnalyticsEntityAggregatedItem(
                            entityAggregatedMetrics,
                            activeEndpoints
                    ));
        }
        return response;
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
                ListQueryFilterReader.requireEnum(query, "scope", AnalyticsScope.class),
                this.decideBucket(query),
                ListQueryFilterReader.optionalUuid(query, "productId"),
                ListQueryFilterReader.optionalUuid(query, "serviceId"),
                ListQueryFilterReader.optionalUuid(query, "endpointId"),
                query.getFrom(),
                query.getTo()
        );
    }

    private AnalyticsBucket decideBucket(ListQueryRequest query) {
        Instant from = query.getFrom();
        Instant to = query.getTo();
        if (from.truncatedTo(ChronoUnit.DAYS)
                .isBefore(to.truncatedTo(ChronoUnit.DAYS))) {
            return AnalyticsBucket.DAY;
        }
        if (from.truncatedTo(ChronoUnit.HOURS)
                .isBefore(to.truncatedTo(ChronoUnit.HOURS))) {
            return AnalyticsBucket.HOUR;
        }
        return AnalyticsBucket.MINUTE;
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
            Instant to
    ) {}

}
