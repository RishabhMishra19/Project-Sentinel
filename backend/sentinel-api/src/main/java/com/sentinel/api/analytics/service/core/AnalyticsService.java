package com.sentinel.api.analytics.service.core;

import java.time.Instant;
import java.util.UUID;

public interface AnalyticsService {

    AnalyticsMetricsAggregate summary(UUID tenantId, Instant from, Instant to, AnalyticsBucket bucket);

}
