package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.AnalyticsBucket;
import com.sentinel.common.analytics.AnalyticsStatsMetrics;

import java.util.UUID;

public record AnalyticsSummaryQueryResponse(
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
        Long activeEndpointCount
) {

    public AnalyticsSummaryQueryResponse(
            AnalyticsBucket bucket,
            UUID scopeId,
            AnalyticsStatsMetrics statsMetrics,
            long activeEndpointCount
    ) {
        this(
                bucket,
                scopeId,
                statsMetrics.getRequestCount(),
                statsMetrics.getErrorCount(),
                statsMetrics.getRequestCount() == 0 ? 0 : ((double) statsMetrics.getErrorCount() / statsMetrics.getRequestCount()) * 100,
                statsMetrics.getStatus2xx(),
                statsMetrics.getStatus3xx(),
                statsMetrics.getStatus4xx(),
                statsMetrics.getStatus5xx(),
                statsMetrics.getLatencyMinMs(),
                statsMetrics.getLatencyMaxMs(),
                statsMetrics.getLatencyP50Ms(),
                statsMetrics.getLatencyP95Ms(),
                statsMetrics.getLatencyP99Ms(),
                statsMetrics.getRequestBytesTotal(),
                statsMetrics.getResponseBytesTotal(),
                activeEndpointCount
        );
    }

}
