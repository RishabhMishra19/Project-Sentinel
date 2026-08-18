package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsServiceStatsDayRepository
        extends CassandraRepository<
        AnalyticsServiceStatsDay,
        AnalyticsServiceStatsDay.PrimaryKeyComposite> {
}