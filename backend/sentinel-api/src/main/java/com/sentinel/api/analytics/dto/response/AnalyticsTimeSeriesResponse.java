package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.AnalyticsBucket;
import com.sentinel.common.analytics.AnalyticsTimeSeriesMetrics;

import java.time.Instant;
import java.util.List;

public record AnalyticsTimeSeriesResponse(AnalyticsBucket bucket, List<Point> points, long activeEndpointCount) {

    public record Point(
            Instant bucketStart,
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
            long responseBytesTotal
    ) {}

    public static AnalyticsTimeSeriesResponse from(
            AnalyticsBucket bucket,
            List<AnalyticsTimeSeriesMetrics> metricsList,
            long activeEndpointCount
    ) {
        return new AnalyticsTimeSeriesResponse(
                bucket,
                metricsList.stream()
                        .map(metrics -> new Point(
                                metrics.getBucketStart(),
                                metrics.getStatsMetrics()
                                        .getRequestCount(),
                                metrics.getStatsMetrics()
                                        .getErrorCount(),
                                metrics.getStatsMetrics()
                                        .getRequestCount() == 0 ? 0 : ((double) metrics.getStatsMetrics()
                                        .getErrorCount() / metrics.getStatsMetrics()
                                        .getRequestCount()) * 100,
                                metrics.getStatsMetrics()
                                        .getStatus2xx(),
                                metrics.getStatsMetrics()
                                        .getStatus3xx(),
                                metrics.getStatsMetrics()
                                        .getStatus4xx(),
                                metrics.getStatsMetrics()
                                        .getStatus5xx(),
                                metrics.getStatsMetrics()
                                        .getLatencyMinMs(),
                                metrics.getStatsMetrics()
                                        .getLatencyMaxMs(),
                                metrics.getStatsMetrics()
                                        .getLatencyP50Ms(),
                                metrics.getStatsMetrics()
                                        .getLatencyP95Ms(),
                                metrics.getStatsMetrics()
                                        .getLatencyP99Ms(),
                                metrics.getStatsMetrics()
                                        .getRequestBytesTotal(),
                                metrics.getStatsMetrics()
                                        .getResponseBytesTotal()
                        ))
                        .toList(),
                activeEndpointCount
        );
    }

}
