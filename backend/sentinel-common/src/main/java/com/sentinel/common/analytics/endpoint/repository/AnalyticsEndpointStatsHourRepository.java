package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsEndpointStatsHourRepository
        extends CassandraRepository<
        AnalyticsEndpointStatsHour,
        AnalyticsEndpointStatsHour.PrimaryKeyComposite> {
    @Query("""
    SELECT *
    FROM analytics_endpoint_stats_hour
    WHERE endpoint_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsEndpointStatsHour> findByEndpointIdAndBucketStartBetween(
            UUID endpointId,
            Instant from,
            Instant to
    );
}