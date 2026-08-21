package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsServiceStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsServiceStatsMinute,
        AnalyticsServiceStatsMinute.PrimaryKeyComposite> {
    @Query("""
    SELECT *
    FROM analytics_service_stats_minute
    WHERE service_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsServiceStatsMinute> findByServiceIdAndBucketStartBetween(
            UUID serviceId,
            Instant from,
            Instant to
    );
}