package com.sentinel.api.analytics.service.impl;

import com.sentinel.api.analytics.dto.request.AnalyticsChildrenAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsChildrenAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;
import com.sentinel.api.analytics.service.AnalyticsFacade;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.endpoint.service.EndpointService;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.product.entity.ProductStatus;
import com.sentinel.api.product.repository.ProductRepository;
import com.sentinel.api.service.entity.Service;
import com.sentinel.api.service.entity.ServiceStatus;
import com.sentinel.api.service.repository.ServiceRepository;
import com.sentinel.api.tenant.entity.Tenant;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.common.cassandra.analytics.dto.response.EntityAggregatedStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TimeSeriesStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TotalStatsResponse;
import com.sentinel.common.cassandra.analytics.service.AnalyticsService;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsUtils;
import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.common.postgresql.endpoint.repository.EndpointRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsFacadeImpl implements AnalyticsFacade {

    private final AnalyticsService analyticsService;
    private final TenantRepository tenantRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EndpointRepository endpointRepository;
    private final EndpointService endpointService;

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
        Map<UUID, String> idToNameMap = this.getIdToNameMap(List.of(params.entityId()), params.scope());
        return new AnalyticsSummaryResponse(totalStats, activeEndpoints, idToNameMap.get(params.entityId()));
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
        Map<UUID, String> idToNameMap = this.getIdToNameMap(List.of(params.entityId()), params.scope());
        return new AnalyticsTimeSeriesResponse(
            timeSeriesStatsResponse,
            activeEndpoints,
            idToNameMap.get(params.entityId())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsChildrenAggregatedResponse getChildrenAggregated(
        AnalyticsChildrenAggregatedRequestParams params
    ) {
        AnalyticsScope childScope = this.getChildScope(params.scope());
        List<UUID> entityIds = this.getChildEntityIds(params.scope(), params.entityId());
        AnalyticsBucket bucket = AnalyticsUtils.getAnalyticsBucket(params.from(), params.to());
        EntityAggregatedStatsResponse entityAggregatedStatsResponse = analyticsService.findEntityAggregatedStats(entityIds,
            params.from(),
            params.to(),
            childScope,
            bucket
        );
        Map<UUID, Long> endpointCountMap = new HashMap<>();
        for (UUID entityId : entityIds) {
            long activeEndpoints = this.countEndPoints(entityId, params.scope());
            endpointCountMap.put(entityId, activeEndpoints);
        }
        Map<UUID, String> idToNameMap = this.getIdToNameMap(entityIds, childScope);
        return new AnalyticsChildrenAggregatedResponse(entityAggregatedStatsResponse, endpointCountMap, idToNameMap);
    }

    private AnalyticsScope getChildScope(@NotNull AnalyticsScope scope) {
        return switch (scope) {
            case TENANT -> AnalyticsScope.PRODUCT;
            case PRODUCT -> AnalyticsScope.SERVICE;
            case SERVICE -> AnalyticsScope.ENDPOINT;
            case ENDPOINT -> throw new BadRequestException("invalid scope");
        };
    }

    private List<UUID> getChildEntityIds(AnalyticsScope scope, UUID entityId) {
        return switch (scope) {
            case TENANT -> productRepository.findIdsByTenantIdAndStatus(entityId, ProductStatus.ACTIVE);
            case PRODUCT -> serviceRepository.findIdsByProductIdAndStatus(entityId, ServiceStatus.ACTIVE);
            case SERVICE -> endpointRepository.findIdByServiceId(entityId);
            case ENDPOINT -> throw new BadRequestException("invalid scope");
        };
    }

    private long countEndPoints(UUID entityId, AnalyticsScope scope) {
        return switch (scope) {
            case TENANT -> endpointService.findCountByTenantId(entityId);
            case PRODUCT -> endpointService.findCountByProductId(entityId);
            case SERVICE -> endpointService.findCountByServiceId(entityId);
            case ENDPOINT -> 1L;
        };
    }

    private Map<UUID, String> getIdToNameMap(List<UUID> ids, AnalyticsScope scope) {
        Map<UUID, String> idToNameMap = new HashMap<>();
        switch (scope) {
            case TENANT -> {
                List<Tenant> tenants = tenantRepository.findByIdIn(ids);
                for (Tenant tenant : tenants) {
                    idToNameMap.put(tenant.getId(), tenant.getName());
                }
            }
            case PRODUCT -> {
                List<Product> products = productRepository.findByIdIn(ids);
                for (Product product : products) {
                    idToNameMap.put(product.getId(), product.getName());
                }
            }
            case SERVICE -> {
                List<Service> services = serviceRepository.findByIdIn(ids);
                for (Service service : services) {
                    idToNameMap.put(service.getId(), service.getName());
                }
            }
            case ENDPOINT -> {
                List<Endpoint> endpoints = endpointRepository.findByIdIn(ids);
                for (Endpoint endpoint : endpoints) {
                    idToNameMap.put(endpoint.getId(), endpoint.getMethod() + " :  " + endpoint.getPathTemplate());
                }
            }
        }
        return idToNameMap;
    }

}
