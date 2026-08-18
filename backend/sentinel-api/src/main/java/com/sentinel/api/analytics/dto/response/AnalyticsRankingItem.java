package com.sentinel.api.analytics.dto.response;

import java.util.UUID;

public record AnalyticsRankingItem(
        UUID id,
        String name,
        String method,
        String pathTemplate,
        long requestCount,
        double errorRate,
        Integer latencyP95Ms) {}
