package com.sentinel.common.analytics.tenant.repository;

import com.sentinel.common.analytics.tenant.entity.AnalyticsTenantStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsTenantStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsTenantStatsMinute,
        AnalyticsTenantStatsMinute.PrimaryKeyComposite> {
}