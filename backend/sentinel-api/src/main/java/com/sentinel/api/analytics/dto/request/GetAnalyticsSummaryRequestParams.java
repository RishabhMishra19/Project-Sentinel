package com.sentinel.api.analytics.dto.request;

import com.sentinel.api.analytics.service.core.AnalyticsBucket;
import com.sentinel.api.analytics.service.core.AnalyticsScope;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record GetAnalyticsSummaryRequestParams(@NotNull AnalyticsScope scope, @NotNull AnalyticsBucket bucket, @NotNull Instant from,  @NotNull Instant to,
                                               @NotNull UUID entityId) {}
