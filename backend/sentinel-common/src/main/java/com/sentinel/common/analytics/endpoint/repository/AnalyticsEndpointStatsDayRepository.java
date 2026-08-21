package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsEndpointStatsDayRepository
        extends CassandraRepository<AnalyticsEndpointStatsDay,
        AnalyticsEndpointStatsDay.PrimaryKeyComposite> {
    @Query("""
    SELECT *
    FROM analytics_endpoint_stats_day
    WHERE endpoint_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsEndpointStatsDay> findByEndpointIdAndBucketStartBetween(
            UUID endpointId,
            Instant from,
            Instant to
    );
}