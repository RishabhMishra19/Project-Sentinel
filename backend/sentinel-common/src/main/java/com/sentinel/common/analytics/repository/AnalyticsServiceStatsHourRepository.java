package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsServiceStatsHour;
import com.sentinel.common.analytics.entity.AnalyticsServiceStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsServiceStatsHourRepository extends JpaRepository<AnalyticsServiceStatsHour, AnalyticsServiceStatsId> {}
