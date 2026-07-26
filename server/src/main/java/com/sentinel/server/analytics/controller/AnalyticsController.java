package com.sentinel.server.analytics.controller;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.analytics.service.AnalyticsFacade;
import com.sentinel.server.analytics.service.core.AnalyticsBucket;
import com.sentinel.server.analytics.service.core.AnalyticsRankingSort;
import com.sentinel.server.analytics.service.core.AnalyticsScope;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsFacade analyticsFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam AnalyticsScope scope,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) UUID serviceId,
            @RequestParam(required = false) UUID endpointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam AnalyticsBucket bucket) {
        return ApiResponses.ok(analyticsFacade.summary(
                principal.getActiveTenantId(), scope, productId, serviceId, endpointId, from, to, bucket));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/timeseries")
    public ResponseEntity<AnalyticsTimeseriesResponse> timeseries(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam AnalyticsScope scope,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) UUID serviceId,
            @RequestParam(required = false) UUID endpointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam AnalyticsBucket bucket) {
        return ApiResponses.ok(analyticsFacade.timeseries(
                principal.getActiveTenantId(), scope, productId, serviceId, endpointId, from, to, bucket));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/rankings")
    public ResponseEntity<PageResponse<AnalyticsRankingItem>> rankings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam AnalyticsScope scope,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) UUID serviceId,
            @RequestParam(required = false) UUID endpointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(required = false, defaultValue = "TRAFFIC") AnalyticsRankingSort sortBy,
            @RequestParam AnalyticsBucket bucket,
            Pageable pageable) {
        return ApiResponses.okPage(analyticsFacade.rankings(
                principal.getActiveTenantId(),
                scope,
                productId,
                serviceId,
                endpointId,
                from,
                to,
                sortBy,
                pageable,
                bucket));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/endpoints/{endpointId}/status-breakdown")
    public ResponseEntity<List<StatusBreakdownItem>> statusBreakdown(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID endpointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ApiResponses.ok(
                analyticsFacade.statusBreakdown(principal.getActiveTenantId(), endpointId, from, to));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/endpoints/{endpointId}/exceptions")
    public ResponseEntity<List<ExceptionMetricItem>> exceptions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID endpointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ApiResponses.ok(analyticsFacade.exceptions(principal.getActiveTenantId(), endpointId, from, to));
    }
}
