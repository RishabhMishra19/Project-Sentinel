package com.sentinel.common.analytics.service;

import com.sentinel.common.analytics.dto.AnalyticsEntityAggregatedMetrics;
import com.sentinel.common.analytics.dto.AnalyticsTimeSeriesMetrics;
import com.sentinel.common.analytics.entity.AnalyticsStatsMetrics;
import com.sentinel.common.analytics.utils.AnalyticsBucket;
import com.sentinel.common.analytics.utils.AnalyticsScope;
import com.sentinel.common.analytics.utils.AnalyticsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.cql.CqlTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CqlTemplate cqlTemplate;

    public AnalyticsStatsMetrics findStats(
            UUID entityId,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getStatCql(scope, bucket);
        AnalyticsStatsMetrics statsMetrics = cqlTemplate.query(
                        cql,
                        AnalyticsUtils::statsMetricsRowMapper,
                        entityId,
                        from,
                        to
                )
                .stream()
                .findFirst()
                .orElse(null);
        AnalyticsUtils.updateMetricsLatencies(statsMetrics);
        return statsMetrics;
    }

    public List<AnalyticsEntityAggregatedMetrics> findAggregatedMetrics(
            List<UUID> entityIds,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getEntityAggregatedStatsCql(scope, bucket);
        List<AnalyticsEntityAggregatedMetrics> entityAggregatedMetricsList = cqlTemplate.query(
                cql,
                AnalyticsUtils::entityAggregatedMetricsRowMapper,
                entityIds,
                from,
                to
        );
        for (AnalyticsEntityAggregatedMetrics metrics : entityAggregatedMetricsList) {
            AnalyticsUtils.updateMetricsLatencies(metrics.getStatsMetrics());
        }
        return entityAggregatedMetricsList;
    }

    public List<AnalyticsTimeSeriesMetrics> findTimeSeriesMetrics(
            UUID entityId,
            Instant from,
            Instant to,
            AnalyticsScope scope,
            AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getTimeSeriesStatsCql(scope, bucket);
        List<AnalyticsTimeSeriesMetrics> entityTimeSeriesMetricsList = cqlTemplate.query(
                cql,
                AnalyticsUtils::entityTimeSeriesRowMapper,
                entityId,
                from,
                to
        );
        for (AnalyticsTimeSeriesMetrics metrics : entityTimeSeriesMetricsList) {
            AnalyticsUtils.updateMetricsLatencies(metrics.getStatsMetrics());
        }
        return entityTimeSeriesMetricsList;
    }

}
