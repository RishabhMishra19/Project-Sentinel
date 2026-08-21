package com.sentinel.api.analytics.service;

import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsScope;
import com.sentinel.api.analytics.service.core.AnalyticsService;
import com.sentinel.api.analytics.service.core.impl.AnalyticsEndpointStatsDayServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsEndpointStatsHourServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsEndpointStatsMinuteServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsProductStatsDayServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsProductStatsHourServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsProductStatsMinuteServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsServiceStatsDayServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsServiceStatsHourServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsServiceStatsMinuteServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsTenantStatsDayServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsTenantStatsHourServiceImpl;
import com.sentinel.api.analytics.service.core.impl.AnalyticsTenantStatsMinuteServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsServiceFactory {

    // Tenant
    private final AnalyticsTenantStatsMinuteServiceImpl tenantStatsMinuteServiceImpl;
    private final AnalyticsTenantStatsHourServiceImpl tenantStatsHourServiceImpl;
    private final AnalyticsTenantStatsDayServiceImpl tenantStatsDayServiceImpl;

    // Product
    private final AnalyticsProductStatsMinuteServiceImpl productStatsMinuteServiceImpl;
    private final AnalyticsProductStatsHourServiceImpl productStatsHourServiceImpl;
    private final AnalyticsProductStatsDayServiceImpl productStatsDayServiceImpl;

    // Service
    private final AnalyticsServiceStatsMinuteServiceImpl serviceStatsMinuteServiceImpl;
    private final AnalyticsServiceStatsHourServiceImpl serviceStatsHourServiceImpl;
    private final AnalyticsServiceStatsDayServiceImpl serviceStatsDayServiceImpl;

    // Endpoint
    private final AnalyticsEndpointStatsMinuteServiceImpl endpointStatsMinuteServiceImpl;
    private final AnalyticsEndpointStatsHourServiceImpl endpointStatsHourServiceImpl;
    private final AnalyticsEndpointStatsDayServiceImpl endpointStatsDayServiceImpl;

    public AnalyticsService getAnalyticsService(
            AnalyticsScope scope,
            AnalyticsBucket bucket) {

        return switch (scope) {
            case TENANT -> switch (bucket) {
                case MINUTE -> tenantStatsMinuteServiceImpl;
                case HOUR -> tenantStatsHourServiceImpl;
                case DAY -> tenantStatsDayServiceImpl;
            };

            case PRODUCT -> switch (bucket) {
                case MINUTE -> productStatsMinuteServiceImpl;
                case HOUR -> productStatsHourServiceImpl;
                case DAY -> productStatsDayServiceImpl;
            };

            case SERVICE -> switch (bucket) {
                case MINUTE -> serviceStatsMinuteServiceImpl;
                case HOUR -> serviceStatsHourServiceImpl;
                case DAY -> serviceStatsDayServiceImpl;
            };

            case ENDPOINT -> switch (bucket) {
                case MINUTE -> endpointStatsMinuteServiceImpl;
                case HOUR -> endpointStatsHourServiceImpl;
                case DAY -> endpointStatsDayServiceImpl;
            };
        };
    }

}