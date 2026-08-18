package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsDay;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsEndpointStatsDayRepository
        extends CassandraRepository<AnalyticsEndpointStatsDay,
        AnalyticsEndpointStatsDay.PrimaryKeyComposite> {
}