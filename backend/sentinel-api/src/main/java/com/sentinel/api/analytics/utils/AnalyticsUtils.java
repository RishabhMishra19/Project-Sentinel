package com.sentinel.api.analytics.utils;

import com.sentinel.common.analytics.AnalyticsBucket;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class AnalyticsUtils {

    public static AnalyticsBucket getAnalyticsBucket(Instant from, Instant to) {
        if(from.truncatedTo(ChronoUnit.DAYS).isBefore(to.truncatedTo(ChronoUnit.DAYS))) {
            return AnalyticsBucket.DAY;
        }
        if(from.truncatedTo(ChronoUnit.HOURS).isBefore(to.truncatedTo(ChronoUnit.HOURS))) {
            return AnalyticsBucket.HOUR;
        }
        return AnalyticsBucket.MINUTE;
    }

}
