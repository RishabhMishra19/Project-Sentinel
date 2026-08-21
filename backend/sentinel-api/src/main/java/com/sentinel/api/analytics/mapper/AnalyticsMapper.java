package com.sentinel.api.analytics.mapper;

import com.sentinel.api.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.api.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.api.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsMetricsAggregate;
import com.sentinel.api.analytics.service.core.AnalyticsStatsQueryService;
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
                agg.getRequestCount(),
                agg.getErrorCount(),
                agg.errorRate(),
                agg.getStatus2xx(),
                agg.getStatus3xx(),
                agg.getStatus4xx(),
                agg.getStatus5xx(),
                agg.getLatencyMinMs(),
                agg.getLatencyMaxMs(),
                agg.getLatencyP50Ms(),
                agg.getLatencyP95Ms(),
                agg.getLatencyP99Ms(),
                agg.getRequestBytesTotal(),
                agg.getResponseBytesTotal(),
                activeEndpointCount);
    }

    public AnalyticsTimeseriesResponse toTimeseries(List<AnalyticsMetricsAggregate> rows, AnalyticsBucket bucket) {
        List<AnalyticsTimeseriesResponse.Point> points =
                rows.stream()
                        .map(
                                r -> new AnalyticsTimeseriesResponse.Point(
                                        r.getBucketStart(),
                                        r.getRequestCount(),
                                        r.getErrorCount(),
                                        r.errorRate(),
                                        r.getStatus2xx(),
                                        r.getStatus3xx(),
                                        r.getStatus4xx(),
                                        r.getStatus5xx(),
                                        r.getLatencyMinMs(),
                                        r.getLatencyMaxMs(),
                                        r.getLatencyP50Ms(),
                                        r.getLatencyP95Ms(),
                                        r.getLatencyP99Ms(),
                                        r.getRequestBytesTotal(),
                                        r.getResponseBytesTotal()))
                        .toList();
        return new AnalyticsTimeseriesResponse(bucket, points);
    }

    public AnalyticsRankingItem toRankingItem(AnalyticsMetricsAggregate agg) {
        return new AnalyticsRankingItem(
                agg.getGrainId(),
                agg.getName(),
                agg.getMethod(),
                agg.getPathTemplate(),
                agg.getRequestCount(),
                agg.errorRate(),
                agg.getLatencyP95Ms());
    }

    public StatusBreakdownItem toStatusItem(AnalyticsStatsQueryService.StatusCount c) {
        return new StatusBreakdownItem(c.statusCode(), c.requestCount());
    }

    public ExceptionMetricItem toExceptionItem(AnalyticsStatsQueryService.ExceptionCount c) {
        return new ExceptionMetricItem(c.exceptionType(), c.exceptionCount());
    }
}
