package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatsHour;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsEndpointStatsHourRepository
        extends CassandraRepository<
        AnalyticsEndpointStatsHour,
        AnalyticsEndpointStatsHour.PrimaryKeyComposite> {
}