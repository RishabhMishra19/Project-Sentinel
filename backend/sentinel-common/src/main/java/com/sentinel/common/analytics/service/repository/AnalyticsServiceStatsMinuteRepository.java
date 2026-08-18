package com.sentinel.common.analytics.service.repository;

import com.sentinel.common.analytics.service.entity.AnalyticsServiceStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsServiceStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsServiceStatsMinute,
        AnalyticsServiceStatsMinute.PrimaryKeyComposite> {
}