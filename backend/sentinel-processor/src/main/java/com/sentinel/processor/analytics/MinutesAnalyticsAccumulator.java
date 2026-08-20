package com.sentinel.processor.analytics;

import com.sentinel.common.analytics.AnalyticsStatsMetrics;
import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsMinute;
import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsMinute;
import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsMinute;
import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsMinute;
import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.processor.analytics.dto.AnalyticsAccumulatorResponse;
import lombok.RequiredArgsConstructor;
import org.HdrHistogram.Histogram;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MinutesAnalyticsAccumulator {

    AnalyticsAccumulatorResponse accumulate(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items, Instant minuteBucket){
        AnalyticsAccumulatorResponse response = new AnalyticsAccumulatorResponse();
        response.getTenantMinuteStats().addAll(this.getTenantMinuteAnalyticsStats(items, minuteBucket));
        response.getProductMinuteStats().addAll(this.getProductMinuteAnalyticsStats(items, minuteBucket));
        response.getServiceMinuteStats().addAll(this.getServiceMinuteAnalyticsStats(items, minuteBucket));
        response.getEndpointMinuteStats().addAll(this.getEndpointMinuteAnalyticsStats(items, minuteBucket));
        return response;
    }

    private List<AnalyticsTenantStatsMinute> getTenantMinuteAnalyticsStats(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items, Instant minuteBucket) {
        Map<UUID, List<RequestLogKafkaMessage.RequestLogKafkaMessageItem>> dividedItems = items.stream()
                .collect(Collectors.groupingBy(
                        RequestLogKafkaMessage.RequestLogKafkaMessageItem::tenantId
                ));
        List<AnalyticsTenantStatsMinute> tenantStats = new ArrayList<>();
        for(UUID tenantId : dividedItems.keySet()) {
            AnalyticsStatsMetrics statsMetrics = this.accumulateMetrics(dividedItems.get(tenantId));
            tenantStats.add(new AnalyticsTenantStatsMinute(statsMetrics, tenantId, minuteBucket));
        }
        return tenantStats;
    }

    private List<AnalyticsProductStatsMinute> getProductMinuteAnalyticsStats(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items, Instant minuteBucket) {
        Map<UUID, List<RequestLogKafkaMessage.RequestLogKafkaMessageItem>> dividedItems = items.stream()
                .collect(Collectors.groupingBy(
                        RequestLogKafkaMessage.RequestLogKafkaMessageItem::productId
                ));
        List<AnalyticsProductStatsMinute> productStats = new ArrayList<>();
        for(UUID productId : dividedItems.keySet()) {
            AnalyticsStatsMetrics statsMetrics = this.accumulateMetrics(dividedItems.get(productId));
            productStats.add(new AnalyticsProductStatsMinute(statsMetrics, productId, minuteBucket));
        }
        return productStats;
    }

    private List<AnalyticsServiceStatsMinute> getServiceMinuteAnalyticsStats(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items, Instant minuteBucket) {
        Map<UUID, List<RequestLogKafkaMessage.RequestLogKafkaMessageItem>> dividedItems = items.stream()
                .collect(Collectors.groupingBy(
                        RequestLogKafkaMessage.RequestLogKafkaMessageItem::serviceId
                ));
        List<AnalyticsServiceStatsMinute> serviceStats = new ArrayList<>();
        for(UUID serviceId : dividedItems.keySet()) {
            AnalyticsStatsMetrics statsMetrics = this.accumulateMetrics(dividedItems.get(serviceId));
            serviceStats.add(new AnalyticsServiceStatsMinute(statsMetrics, serviceId, minuteBucket));
        }
        return serviceStats;
    }

    private List<AnalyticsEndpointStatsMinute> getEndpointMinuteAnalyticsStats(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items, Instant minuteBucket) {
        Map<UUID, List<RequestLogKafkaMessage.RequestLogKafkaMessageItem>> dividedItems = items.stream()
                .collect(Collectors.groupingBy(
                        RequestLogKafkaMessage.RequestLogKafkaMessageItem::endpointId
                ));
        List<AnalyticsEndpointStatsMinute> endpointStats = new ArrayList<>();
        for(UUID endpointId : dividedItems.keySet()) {
            AnalyticsStatsMetrics statsMetrics = this.accumulateMetrics(dividedItems.get(endpointId));
            endpointStats.add(new AnalyticsEndpointStatsMinute(statsMetrics, endpointId, minuteBucket));
        }
        return endpointStats;
    }

    private AnalyticsStatsMetrics accumulateMetrics(List<RequestLogKafkaMessage.RequestLogKafkaMessageItem> items) {
        AnalyticsStatsMetrics metrics = new AnalyticsStatsMetrics();
        Histogram histogram = new Histogram(60_000_000_000L, 3);
        for (RequestLogKafkaMessage.RequestLogKafkaMessageItem item : items) {
            int status = item.statusCode();
            int latency = item.durationMs();

            // Request count
            metrics.setRequestCount(metrics.getRequestCount() + 1);

            // Status counts
            if (status >= 200 && status < 300) {
                metrics.setStatus2xx(metrics.getStatus2xx() + 1);
            } else if (status >= 300 && status < 400) {
                metrics.setStatus3xx(metrics.getStatus3xx() + 1);
            } else if (status >= 400 && status < 500) {
                metrics.setStatus4xx(metrics.getStatus4xx() + 1); metrics.setErrorCount(metrics.getErrorCount() + 1);
            } else if (status >= 500 && status < 600) {
                metrics.setStatus5xx(metrics.getStatus5xx() + 1); metrics.setErrorCount(metrics.getErrorCount() + 1);
            }

            // Latency
            metrics.setLatencySumMs(metrics.getLatencySumMs() + latency);
            metrics.setLatencyMinMs(Math.min(metrics.getLatencyMinMs(), latency));
            metrics.setLatencyMaxMs(Math.max(metrics.getLatencyMaxMs(), latency));

            // Payload sizes
            metrics.setRequestBytesTotal(metrics.getRequestBytesTotal() + item.requestSizeBytes());
            metrics.setResponseBytesTotal(metrics.getResponseBytesTotal() + item.responseSizeBytes());

            //to calculate p50, p95 and p99
            histogram.recordValue(item.durationMs());
        }
        //store p50, p95 and p99 latencies
        metrics.setLatencyP50Ms(histogram.getValueAtPercentile(50));
        metrics.setLatencyP50Ms(histogram.getValueAtPercentile(95));
        metrics.setLatencyP50Ms(histogram.getValueAtPercentile(99));
        return metrics;
    }
}
