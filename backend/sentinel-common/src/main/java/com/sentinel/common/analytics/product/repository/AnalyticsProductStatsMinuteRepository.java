package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsProductStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsProductStatsMinute,
        AnalyticsProductStatsMinute.PrimaryKeyComposite> {
}