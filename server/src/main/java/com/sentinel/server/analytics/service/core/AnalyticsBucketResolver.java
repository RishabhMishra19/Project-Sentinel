package com.sentinel.server.analytics.service.core;

import com.sentinel.server.common.exception.BadRequestException;
import java.time.Duration;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsBucketResolver {

    private static final Duration SIX_HOURS = Duration.ofHours(6);
    private static final Duration THIRTY_DAYS = Duration.ofDays(30);

    public AnalyticsBucket resolve(Instant from, Instant to) {
        if (from == null || to == null) {
            throw new BadRequestException("from and to are required");
        }
        if (!from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
        Duration span = Duration.between(from, to);
        if (span.compareTo(SIX_HOURS) <= 0) {
            return AnalyticsBucket.MINUTE;
        }
        if (span.compareTo(THIRTY_DAYS) <= 0) {
            return AnalyticsBucket.HOUR;
        }
        return AnalyticsBucket.DAY;
    }
}
