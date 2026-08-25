package com.sentinel.loadEngine.dataGenerator.dto.response;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

public record LoadTestRelatedEntities(
    String loadTestId,
    List<IdName> tenants,
    List<IdName> products,
    List<IdName> services,
    List<IdName> endpoints,
    long requestLogCount,
    AnalyticsCount analyticsCount
) {

    public static record IdName(UUID id, String name) {
    }

    @Builder
    public static record AnalyticsCount(
        long endpointMinuteAnalyticsCount,
        long endpointHourAnalyticsCount,
        long endpointDayAnalyticsCount,

        long serviceMinuteAnalyticsCount,
        long serviceHourAnalyticsCount,
        long serviceDayAnalyticsCount,

        long productMinuteAnalyticsCount,
        long productHourAnalyticsCount,
        long productDayAnalyticsCount,

        long tenantMinuteAnalyticsCount,
        long tenantHourAnalyticsCount,
        long tenantDayAnalyticsCount
    ) {
    }
}
