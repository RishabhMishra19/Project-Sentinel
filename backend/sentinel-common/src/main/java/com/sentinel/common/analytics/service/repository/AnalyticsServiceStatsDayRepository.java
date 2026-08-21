package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsServiceStatsDayRepository
        extends CassandraRepository<
        AnalyticsServiceStatsDay,
        AnalyticsServiceStatsDay.PrimaryKeyComposite> {

    @Query("""
    SELECT *
    FROM analytics_service_stats_day
    WHERE service_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsServiceStatsDay> findByServiceIdAndBucketStartBetween(
            UUID serviceId,
            Instant from,
            Instant to
    );
}