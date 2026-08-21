package com.sentinel.api.analytics.service.core;

import java.time.Instant;
import java.util.UUID;

public interface AnalyticsService {

    AnalyticsMetrics findStats(UUID entityId, Instant from, Instant to);

}
