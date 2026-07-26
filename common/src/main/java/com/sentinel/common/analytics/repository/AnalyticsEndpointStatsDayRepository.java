package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsDay;
import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEndpointStatsDayRepository extends JpaRepository<AnalyticsEndpointStatsDay, AnalyticsEndpointStatsId> {}
