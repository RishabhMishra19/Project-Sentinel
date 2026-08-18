package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsProductStatsHour;
import com.sentinel.common.analytics.entity.AnalyticsProductStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsProductStatsHourRepository extends JpaRepository<AnalyticsProductStatsHour, AnalyticsProductStatsId> {}
