package com.sentinel.api.analytics.service.core;

import java.util.UUID;

public interface EndpointService {

    long countEndPoints(UUID entityId, com.sentinel.common.analytics.AnalyticsScope scope);

}
