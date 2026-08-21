package com.sentinel.common.analytics.tenant.repository;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsTenantStatsDayRepository
        extends CassandraRepository<
        AnalyticsTenantStatsDay,
        AnalyticsTenantStatsDay.PrimaryKeyComposite> {
    @Query("""
    SELECT *
    FROM analytics_tenant_stats_day
    WHERE tenant_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsTenantStatsDay> findByTenantIdAndBucketStartBetween(
            UUID tenantId,
            Instant from,
            Instant to
    );
}