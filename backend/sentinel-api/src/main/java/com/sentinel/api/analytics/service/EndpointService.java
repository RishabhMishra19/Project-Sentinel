        package com.sentinel.api.analytics.service;

import com.sentinel.common.analytics.utils.AnalyticsScope;

import java.util.UUID;

public interface EndpointService {

    long countEndPoints(UUID entityId, AnalyticsScope scope);

}
