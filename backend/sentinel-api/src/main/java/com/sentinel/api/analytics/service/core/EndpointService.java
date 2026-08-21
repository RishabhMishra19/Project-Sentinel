package com.sentinel.api.analytics.service.core;

import java.util.UUID;

public interface EndpointService {

    long countEndPoints(UUID entityId, AnalyticsScope scope);

}
