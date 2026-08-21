package com.sentinel.api.analytics.dto.response;

import java.util.List;
import java.util.UUID;

public record AnalyticsRankingQueryResponse(List<AnalyticsRankingItem> items) {

    public record AnalyticsRankingItem(UUID id, String name, long requestCount, long errorCount, double errorRate,
                                       long status2xx, long status3xx, long status4xx, long status5xx,
                                       Long latencyMinMs, Long latencyMaxMs, Long latencyP50Ms, Long latencyP95Ms,
                                       Long latencyP99Ms, long requestBytesTotal, long responseBytesTotal,
                                       Long activeEndpointCount) {}

}
