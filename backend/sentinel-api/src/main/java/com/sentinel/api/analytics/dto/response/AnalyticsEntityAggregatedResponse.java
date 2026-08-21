package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.AnalyticsEntityAggregatedMetrics;

import java.util.List;
import java.util.UUID;

public record AnalyticsEntityAggregatedResponse(List<AnalyticsEntityAggregatedItem> items) {

    public record AnalyticsEntityAggregatedItem(
            UUID id,
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

        public AnalyticsEntityAggregatedItem(AnalyticsEntityAggregatedMetrics aggMetrics, long activeEndpointCount) {
            this(
                    aggMetrics.getScopeId(),
                    aggMetrics.getStatsMetrics()
                            .getRequestCount(),
                    aggMetrics.getStatsMetrics()
                            .getErrorCount(),
                    aggMetrics.getStatsMetrics()
                            .getRequestCount() == 0 ? 0 : ((double) aggMetrics.getStatsMetrics()
                            .getErrorCount() / aggMetrics.getStatsMetrics()
                            .getRequestCount()),
                    aggMetrics.getStatsMetrics()
                            .getStatus2xx(),
                    aggMetrics.getStatsMetrics()
                            .getStatus3xx(),
                    aggMetrics.getStatsMetrics()
                            .getStatus4xx(),
                    aggMetrics.getStatsMetrics()
                            .getStatus5xx(),
                    aggMetrics.getStatsMetrics()
                            .getLatencyMinMs(),
                    aggMetrics.getStatsMetrics()
                            .getLatencyMaxMs(),
                    aggMetrics.getStatsMetrics()
                            .getLatencyP50Ms(),
                    aggMetrics.getStatsMetrics()
                            .getLatencyP95Ms(),
                    aggMetrics.getStatsMetrics()
                            .getLatencyP99Ms(),
                    aggMetrics.getStatsMetrics()
                            .getRequestBytesTotal(),
                    aggMetrics.getStatsMetrics()
                            .getResponseBytesTotal(),
                    activeEndpointCount
            );
        }

    }

}
