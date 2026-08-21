package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsProductStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsProductStatsMinute,
        AnalyticsProductStatsMinute.PrimaryKeyComposite> {

    @Query("""
            SELECT *
            FROM analytics_product_stats_day
            WHERE endpoint_id IN :endpointIds
              AND bucket_start >= :from
              AND bucket_start < :to
            """)
    List<AnalyticsProductStatsMinute> findByProductIdsAndBucketStartBetween(
            @Param("endpointIds") List<UUID> productIds,
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}