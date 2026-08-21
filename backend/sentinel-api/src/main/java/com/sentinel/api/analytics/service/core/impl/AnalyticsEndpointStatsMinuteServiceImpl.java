package com.sentinel.api.analytics.service.core.impl;

import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsMetricsAggregate;
import com.sentinel.api.analytics.service.core.AnalyticsService;
import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsMinute;
import com.sentinel.common.analytics.endpoint.repository.AnalyticsEndpointStatsMinuteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsEndpointStatsMinuteServiceImpl implements AnalyticsService {

    private final AnalyticsEndpointStatsMinuteRepository EndpointStatsMinuteRepository;

    @Override
    public AnalyticsMetricsAggregate summary(UUID EndpointId, Instant from, Instant to, AnalyticsBucket bucket) {
        List<AnalyticsEndpointStatsMinute> statsList = EndpointStatsMinuteRepository.findByEndpointIdAndBucketStartBetween(
                EndpointId,
                from,
                to);
        AnalyticsMetricsAggregate aggregate = new AnalyticsMetricsAggregate(EndpointId, from);
        this.accumulate(aggregate, statsList);
        return aggregate;
    }

    private void accumulate(AnalyticsMetricsAggregate aggregate, List<AnalyticsEndpointStatsMinute> statsList) {
        long latencyP50 = 0;
        long latencyP95 = 0;
        long latencyP99 = 0;
        for (AnalyticsEndpointStatsMinute stats : statsList) {
            aggregate.incrRequestCount(stats.getRequestCount());
            aggregate.incrErrorCount(stats.getErrorCount());
            aggregate.incrStatus2xx(stats.getStatus2xx());
            aggregate.incrStatus3xx(stats.getStatus3xx());
            aggregate.incrStatus4xx(stats.getStatus4xx());
            aggregate.incrStatus5xx(stats.getStatus5xx());
            aggregate.incrLatencySumMs(stats.getLatencySumMs());
            aggregate.updateLatencyMinMs(stats.getLatencyMinMs());
            aggregate.updateLatencyMaxMs(stats.getLatencyMaxMs());
            aggregate.incrRequestBytesTotal(stats.getRequestBytesTotal());
            aggregate.incrResponseBytesTotal(stats.getResponseBytesTotal());
            latencyP50 += stats.getLatencyP50Ms() * stats.getRequestCount();
            latencyP95 += stats.getLatencyP95Ms() * stats.getRequestCount();
            latencyP99 += stats.getLatencyP99Ms() * stats.getRequestCount();
        }
        if (aggregate.getRequestCount() > 0) {
            aggregate.setLatencyP50Ms(latencyP50 / aggregate.getRequestCount());
            aggregate.setLatencyP95Ms(latencyP95 / aggregate.getRequestCount());
            aggregate.setLatencyP99Ms(latencyP99 / aggregate.getRequestCount());
        }
    }

}
