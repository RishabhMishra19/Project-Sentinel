package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsProductStatsHourRepository
        extends CassandraRepository<
        AnalyticsProductStatsHour,
        AnalyticsProductStatsHour.PrimaryKeyComposite> {

    @Query("""
    SELECT *
    FROM analytics_product_stats_hour
    WHERE product_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsProductStatsHour> findByProductIdAndBucketStartBetween(
            UUID productId,
            Instant from,
            Instant to
    );
}