package com.sentinel.api.analytics.dto.response;

import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import java.util.UUID;

public record AnalyticsSummaryResponse(
        AnalyticsBucket bucket,
        UUID scopeId,
        long requestCount,
        long errorCount,
        double errorRate,
        long status2xx,
        long status3xx,
        long status4xx,
        long status5xx,
        Long latencyMinMs,
        Long latencyMaxMs,
        Long latencyP50Ms,
        Long latencyP95Ms,
        Long latencyP99Ms,
        long requestBytesTotal,
        long responseBytesTotal,
        Long activeEndpointCount) {}
