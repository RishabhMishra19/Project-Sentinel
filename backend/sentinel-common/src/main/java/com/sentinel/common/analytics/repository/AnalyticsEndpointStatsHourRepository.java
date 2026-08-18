package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsHour;
import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEndpointStatsHourRepository extends JpaRepository<AnalyticsEndpointStatsHour, AnalyticsEndpointStatsId> {}
