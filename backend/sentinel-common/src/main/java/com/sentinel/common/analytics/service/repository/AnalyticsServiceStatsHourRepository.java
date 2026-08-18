package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsServiceStatsHourRepository
        extends CassandraRepository<
        AnalyticsServiceStatsHour,
        AnalyticsServiceStatsHour.PrimaryKeyComposite> {
}