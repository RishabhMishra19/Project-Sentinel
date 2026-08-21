package com.sentinel.api.analytics.controller;

import com.sentinel.api.analytics.dto.request.AnalyticsEntityAggregatedRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsSummaryRequestParams;
import com.sentinel.api.analytics.dto.request.AnalyticsTimeSeriesRequestParams;
import com.sentinel.api.analytics.dto.response.AnalyticsEntityAggregatedResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsSummaryResponse;
import com.sentinel.api.analytics.dto.response.AnalyticsTimeSeriesResponse;
import com.sentinel.api.analytics.service.AnalyticsFacade;
import com.sentinel.api.common.response.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsFacade analyticsFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(@Valid @ModelAttribute AnalyticsSummaryRequestParams params) {
        return ApiResponses.ok(analyticsFacade.getSummary(params));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/timeseries")
    public ResponseEntity<AnalyticsTimeSeriesResponse> getTimeSeries(@Valid @ModelAttribute AnalyticsTimeSeriesRequestParams params) {
        return ApiResponses.ok(analyticsFacade.getTimeSeries(params));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/entityAggregated")
    public ResponseEntity<AnalyticsEntityAggregatedResponse> getEntityAggregated(@Valid @ModelAttribute AnalyticsEntityAggregatedRequestParams params) {
        return ApiResponses.ok(analyticsFacade.getEntityAggregated(params));
    }

}
