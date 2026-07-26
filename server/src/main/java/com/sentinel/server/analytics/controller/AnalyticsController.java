package com.sentinel.server.analytics.controller;

import com.sentinel.server.analytics.dto.response.AnalyticsRankingItem;
import com.sentinel.server.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.server.analytics.dto.response.AnalyticsTimeseriesResponse;
import com.sentinel.server.analytics.dto.response.ExceptionMetricItem;
import com.sentinel.server.analytics.dto.response.StatusBreakdownItem;
import com.sentinel.server.analytics.service.AnalyticsFacade;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsFacade analyticsFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary(
            @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.ok(analyticsFacade.summary(principal.getActiveTenantId(), query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/timeseries")
    public ResponseEntity<AnalyticsTimeseriesResponse> timeseries(
            @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.ok(analyticsFacade.timeseries(principal.getActiveTenantId(), query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/rankings")
    public ResponseEntity<PageResponse<AnalyticsRankingItem>> rankings(
            @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(analyticsFacade.rankings(principal.getActiveTenantId(), query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/endpoints/{endpointId}/status-breakdown")
    public ResponseEntity<List<StatusBreakdownItem>> statusBreakdown(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID endpointId,
            @RequestBody ListQueryRequest query) {
        return ApiResponses.ok(
                analyticsFacade.statusBreakdown(principal.getActiveTenantId(), endpointId, query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/endpoints/{endpointId}/exceptions")
    public ResponseEntity<List<ExceptionMetricItem>> exceptions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID endpointId,
            @RequestBody ListQueryRequest query) {
        return ApiResponses.ok(
                analyticsFacade.exceptions(principal.getActiveTenantId(), endpointId, query));
    }
}
