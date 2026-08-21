package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsEndpointStatsHourRepository extends CassandraRepository<AnalyticsEndpointStatsHour, AnalyticsEndpointStatsHour.PrimaryKeyComposite> {

    @Query("""
            SELECT *
                    FROM analytics_endpoint_stats_hour
                    WHERE endpoint_id IN :endpointIds
                      AND bucket_start >= :from
                      AND bucket_start < :to
            """)
    List<AnalyticsEndpointStatsHour> findByEndpointIdsAndBucketStartBetween(@Param("endpointIds") List<UUID> endpointIds, @Param("from") Instant from, @Param("to") Instant to);

}