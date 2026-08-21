package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsServiceStatsHourRepository
        extends CassandraRepository<
        AnalyticsServiceStatsHour,
        AnalyticsServiceStatsHour.PrimaryKeyComposite> {
    @Query("""
    SELECT *
    FROM analytics_service_stats_hour
    WHERE service_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsServiceStatsHour> findByServiceIdAndBucketStartBetween(
            UUID serviceId,
            Instant from,
            Instant to
    );
}