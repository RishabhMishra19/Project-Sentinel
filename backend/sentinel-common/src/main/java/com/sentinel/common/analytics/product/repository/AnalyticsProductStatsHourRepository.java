package com.sentinel.common.analytics.product.repository;

import com.sentinel.common.analytics.product.entity.AnalyticsProductStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsProductStatsHourRepository
        extends CassandraRepository<
        AnalyticsProductStatsHour,
        AnalyticsProductStatsHour.PrimaryKeyComposite> {
}