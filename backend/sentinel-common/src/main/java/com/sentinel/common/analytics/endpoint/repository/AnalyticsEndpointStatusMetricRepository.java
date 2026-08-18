package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointStatusMetric;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsEndpointStatusMetricRepository
        extends CassandraRepository<
        AnalyticsEndpointStatusMetric,
        AnalyticsEndpointStatusMetric.PrimaryKeyComposite> {
}