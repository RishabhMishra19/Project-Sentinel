package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsTenantStatsMinute;
import com.sentinel.common.analytics.entity.AnalyticsTenantStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsTenantStatsMinuteRepository extends JpaRepository<AnalyticsTenantStatsMinute, AnalyticsTenantStatsId> {}
