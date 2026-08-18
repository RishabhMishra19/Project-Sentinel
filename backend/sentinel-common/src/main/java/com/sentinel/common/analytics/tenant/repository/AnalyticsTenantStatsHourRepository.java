package com.sentinel.common.analytics.tenant.repository;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsTenantStatsHourRepository
        extends CassandraRepository<
        AnalyticsTenantStatsHour,
        AnalyticsTenantStatsHour.PrimaryKeyComposite> {
}