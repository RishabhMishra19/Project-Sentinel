package com.sentinel.common.cassandra.analytics.service;

import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;
import com.sentinel.common.cassandra.analytics.dto.response.EntityAggregatedStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TimeSeriesStatsResponse;
import com.sentinel.common.cassandra.analytics.dto.response.TotalStatsResponse;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsUtils;
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

    public Long getCount(List<UUID> entityIds, AnalyticsScope scope, AnalyticsBucket bucket){
        String cql = AnalyticsUtils.getCountSql(scope, bucket);
        return (Long)cqlTemplate.queryForObject(
            cql,
            Long.class,
            entityIds
        );
    }

    @Override
    public void deleteByEntityIds(List<UUID> entityIds, AnalyticsScope scope, AnalyticsBucket bucket) {
        String cql = AnalyticsUtils.getDeleteSql(scope, bucket);
        cqlTemplate.execute(
            cql,
            entityIds
        );
    }

    public TotalStatsResponse findTotalStats(
        UUID entityId,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getTotalStatCql(scope, bucket);
        AnalyticsStatsMetrics totalStats = cqlTemplate.query(
                cql,
                AnalyticsUtils::statsMetricsRowMapper,
                entityId,
                from,
                to
            )
            .stream()
            .findFirst()
            .orElse(null);
        return new TotalStatsResponse(bucket, scope, entityId, totalStats);
    }

    public EntityAggregatedStatsResponse findEntityAggregatedStats(
        List<UUID> entityIds,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getEntityAggregatedStatsCql(scope, bucket);
        List<AnalyticsStatsMetrics> entityAggregatedStats = cqlTemplate.query(
            cql,
            AnalyticsUtils::statsMetricsRowMapper,
            entityIds,
            from,
            to
        );
        return new EntityAggregatedStatsResponse(bucket, scope, entityIds, entityAggregatedStats);
    }

    public TimeSeriesStatsResponse findTimeSeriesStats(
        UUID entityId,
        Instant from,
        Instant to,
        AnalyticsScope scope,
        AnalyticsBucket bucket
    ) {
        String cql = AnalyticsUtils.getTimeSeriesStatsCql(scope, bucket);
        List<AnalyticsStatsMetrics> timeSeriesStats = cqlTemplate.query(
            cql,
            AnalyticsUtils::statsMetricsRowMapper,
            entityId,
            from,
            to
        );
        return new TimeSeriesStatsResponse(bucket, scope, entityId, timeSeriesStats);
    }

}
