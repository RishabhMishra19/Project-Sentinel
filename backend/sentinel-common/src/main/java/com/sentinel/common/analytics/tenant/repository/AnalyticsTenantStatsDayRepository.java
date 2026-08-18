package com.sentinel.common.analytics.tenant.repository;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsTenantStatsDayRepository
        extends CassandraRepository<
        AnalyticsTenantStatsDay,
        AnalyticsTenantStatsDay.PrimaryKeyComposite> {
}