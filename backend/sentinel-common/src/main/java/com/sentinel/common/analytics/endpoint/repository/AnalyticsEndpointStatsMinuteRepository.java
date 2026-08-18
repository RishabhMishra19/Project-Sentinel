package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsMinute;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsEndpointStatsMinuteRepository
        extends CassandraRepository<
        AnalyticsEndpointStatsMinute,
        AnalyticsEndpointStatsMinute.PrimaryKeyComposite> {
}