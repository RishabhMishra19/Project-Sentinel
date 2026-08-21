package com.sentinel.common.analytics.tenant.repository;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsTenantStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsTenantStatsMinute,
        AnalyticsTenantStatsMinute.PrimaryKeyComposite> {

    @Query("""
    SELECT *
    FROM analytics_tenant_stats_minute
    WHERE tenant_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsTenantStatsMinute> findByTenantIdAndBucketStartBetween(
            UUID tenantId,
            Instant from,
            Instant to
    );

}