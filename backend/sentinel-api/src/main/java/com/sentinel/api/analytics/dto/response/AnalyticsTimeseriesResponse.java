package com.sentinel.api.analytics.dto.response;

import com.sentinel.server.analytics.service.core.AnalyticsBucket;
import java.time.Instant;
import java.util.List;

public record AnalyticsTimeseriesResponse(AnalyticsBucket bucket, List<Point> points) {

    public record Point(
            Instant bucketStart,
            long requestCount,
            long errorCount,
            double errorRate,
            long status2xx,
            long status3xx,
            long status4xx,
            long status5xx,
            Integer latencyMinMs,
            Integer latencyMaxMs,
            Integer latencyP50Ms,
            Integer latencyP95Ms,
            Integer latencyP99Ms,
            long requestBytesTotal,
            long responseBytesTotal) {}
}
