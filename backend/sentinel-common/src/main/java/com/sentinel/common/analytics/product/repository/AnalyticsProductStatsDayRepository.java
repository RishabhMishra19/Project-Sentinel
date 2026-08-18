package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsProductStatsDayRepository
        extends CassandraRepository<
        AnalyticsProductStatsDay,
        AnalyticsProductStatsDay.PrimaryKeyComposite> {
}