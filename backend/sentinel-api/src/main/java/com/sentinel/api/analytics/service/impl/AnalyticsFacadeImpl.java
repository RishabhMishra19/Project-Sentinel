package com.sentinel.api.analytics.service.impl;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;
import com.sentinel.api.analytics.service.AnalyticsFacade;
import com.sentinel.api.product.entity.ProductStatus;
import com.sentinel.api.product.repository.ProductRepository;
import com.sentinel.api.service.entity.ServiceStatus;
import com.sentinel.api.service.repository.ServiceRepository;
import com.sentinel.api.tenant.entity.TenantStatus;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.common.analytics.dto.response.EntityAggregatedStatsResponse;
import com.sentinel.common.analytics.dto.response.TimeSeriesStatsResponse;
import com.sentinel.common.analytics.dto.response.TotalStatsResponse;
import com.sentinel.common.analytics.service.AnalyticsService;
import com.sentinel.common.analytics.utils.AnalyticsBucket;
import com.sentinel.common.analytics.utils.AnalyticsScope;
import com.sentinel.common.analytics.utils.AnalyticsUtils;
import com.sentinel.common.observability.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsFacadeImpl implements AnalyticsFacade {

    private final AnalyticsService analyticsService;
    private final TenantRepository tenantRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EndpointRepository endpointRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary(AnalyticsSummaryRequestParams params) {
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        TotalStatsResponse totalStats = analyticsService.findTotalStats(
                params.entityId(),
                params.from(),
                params.to(),
                params.scope(),
                bucket
        );
        long activeEndpoints = this.countEndPoints(params.entityId(), params.scope());
        return new AnalyticsSummaryResponse(totalStats, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsTimeSeriesResponse getTimeSeries(AnalyticsTimeSeriesRequestParams params) {
        TimeSeriesStatsResponse timeSeriesStatsResponse = analyticsService.findTimeSeriesStats(
                params.entityId(),
                params.from(),
                params.to(),
                params.scope(),
                params.bucket()
        );
        long activeEndpoints = this.countEndPoints(params.entityId(), params.scope());
        return new AnalyticsTimeSeriesResponse(timeSeriesStatsResponse, activeEndpoints);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsEntityAggregatedResponse getEntityAggregated(
            UUID activeTenantId,
            AnalyticsEntityAggregatedRequestParams params
    ) {
        List<UUID> entityIds = this.getScopeEntityIds(activeTenantId, params);
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        EntityAggregatedStatsResponse entityAggregatedStatsResponse = analyticsService.findEntityAggregatedStats(entityIds,
                params.from(),
                params.to(),
                params.scope(),
                bucket
        );
        Map<UUID, Long> endpointCountMap = new HashMap<>();
        for (UUID entityId : entityIds) {
            long activeEndpoints = this.countEndPoints(entityId, params.scope());
            endpointCountMap.put(entityId, activeEndpoints);
        }
        return new AnalyticsEntityAggregatedResponse(entityAggregatedStatsResponse, endpointCountMap);
    }

    private List<UUID> getScopeEntityIds(UUID activeTenantId, AnalyticsEntityAggregatedRequestParams params) {
        UUID tenantId = params.tenantId() != null ? params.tenantId() : activeTenantId;
        List<UUID> productIds = params.productId() != null ? List.of(params.productId()) : productRepository.findIdsByTenantIdAndStatus(tenantId,
                ProductStatus.ACTIVE
        );
        List<UUID> serviceIds = params.serviceId() != null ? List.of(params.serviceId()) : serviceRepository.findIdsByProductIdsAndStatus(productIds,
                ServiceStatus.ACTIVE
        );
        switch (params.scope()) {
            case TENANT -> {
                return tenantRepository.findIdsByStatus(TenantStatus.ACTIVE);
            }
            case PRODUCT -> {
                return productRepository.findIdsByTenantIdAndStatus(tenantId, ProductStatus.ACTIVE);
            }
            case SERVICE -> {
                return serviceRepository.findIdsByProductIdsAndStatus(productIds, ServiceStatus.ACTIVE);
            }
            case ENDPOINT -> {
                return endpointRepository.findIdsByServiceIds(serviceIds);
            }
        }
        return new ArrayList<>();
    }

    private long countEndPoints(UUID entityId, AnalyticsScope scope) {
        List<UUID> serviceIds = null;
        switch (scope) {
            case TENANT:
                serviceIds = serviceRepository.findIdsByTenantIdAndStatus(entityId, ServiceStatus.ACTIVE);
                break;
            case PRODUCT:
                serviceIds = serviceRepository.findIdsByProductIdAndStatus(entityId, ServiceStatus.ACTIVE);
                break;
            case SERVICE:
                serviceIds = List.of(entityId);
                break;
            case ENDPOINT:
                return 1L;
        }
        return endpointRepository.countById_ServiceIdIn(serviceIds);
    }

}
