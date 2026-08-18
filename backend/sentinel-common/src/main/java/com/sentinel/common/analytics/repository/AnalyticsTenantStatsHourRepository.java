package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsTenantStatsHour;
import com.sentinel.common.analytics.entity.AnalyticsTenantStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsTenantStatsHourRepository extends JpaRepository<AnalyticsTenantStatsHour, AnalyticsTenantStatsId> {}
