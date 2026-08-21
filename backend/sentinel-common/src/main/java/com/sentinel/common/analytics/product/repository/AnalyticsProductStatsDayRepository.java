package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsProductStatsDayRepository
        extends CassandraRepository<
        AnalyticsProductStatsDay,
        AnalyticsProductStatsDay.PrimaryKeyComposite> {

    @Query("""
    SELECT *
    FROM analytics_product_stats_day
    WHERE product_id = ?0
      AND bucket_start >= ?1
      AND bucket_start < ?2
    """)
    List<AnalyticsProductStatsDay> findByProductIdAndBucketStartBetween(
            UUID productId,
            Instant from,
            Instant to
    );

}