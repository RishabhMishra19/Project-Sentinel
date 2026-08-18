package com.sentinel.api.analytics.mapper;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.analytics.service.core.AnalyticsBucket;
import com.sentinel.server.analytics.service.core.AnalyticsMetricsAggregate;
import com.sentinel.server.analytics.service.core.AnalyticsStatsQueryService;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsMapper {

    public AnalyticsSummaryResponse toSummary(
            AnalyticsMetricsAggregate agg, AnalyticsBucket bucket, UUID scopeId, Long activeEndpointCount) {
        return new AnalyticsSummaryResponse(
                bucket,
                scopeId,
                agg.requestCount(),
                agg.errorCount(),
                agg.errorRate(),
                agg.status2xx(),
                agg.status3xx(),
                agg.status4xx(),
                agg.status5xx(),
                agg.latencyMinMs(),
                agg.latencyMaxMs(),
                agg.latencyP50Ms(),
                agg.latencyP95Ms(),
                agg.latencyP99Ms(),
                agg.requestBytesTotal(),
                agg.responseBytesTotal(),
                activeEndpointCount);
    }

    public AnalyticsTimeseriesResponse toTimeseries(List<AnalyticsMetricsAggregate> rows, AnalyticsBucket bucket) {
        List<AnalyticsTimeseriesResponse.Point> points =
                rows.stream()
                        .map(
                                r -> new AnalyticsTimeseriesResponse.Point(
                                        r.bucketStart(),
                                        r.requestCount(),
                                        r.errorCount(),
                                        r.errorRate(),
                                        r.status2xx(),
                                        r.status3xx(),
                                        r.status4xx(),
                                        r.status5xx(),
                                        r.latencyMinMs(),
                                        r.latencyMaxMs(),
                                        r.latencyP50Ms(),
                                        r.latencyP95Ms(),
                                        r.latencyP99Ms(),
                                        r.requestBytesTotal(),
                                        r.responseBytesTotal()))
                        .toList();
        return new AnalyticsTimeseriesResponse(bucket, points);
    }

    public AnalyticsRankingItem toRankingItem(AnalyticsMetricsAggregate agg) {
        return new AnalyticsRankingItem(
                agg.grainId(),
                agg.name(),
                agg.method(),
                agg.pathTemplate(),
                agg.requestCount(),
                agg.errorRate(),
                agg.latencyP95Ms());
    }

    public StatusBreakdownItem toStatusItem(AnalyticsStatsQueryService.StatusCount c) {
        return new StatusBreakdownItem(c.statusCode(), c.requestCount());
    }

    public ExceptionMetricItem toExceptionItem(AnalyticsStatsQueryService.ExceptionCount c) {
        return new ExceptionMetricItem(c.exceptionType(), c.exceptionCount());
    }
}
