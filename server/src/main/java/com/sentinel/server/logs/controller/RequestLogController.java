package com.sentinel.server.logs.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import com.sentinel.server.logs.service.RequestLogFacade;
import com.sentinel.server.security.UserPrincipal;
import java.time.Instant;
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
@RequestMapping("/api/logs/requests")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogFacade requestLogFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<PageResponse<RequestLogResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) UUID serviceId,
            @RequestParam(required = false) UUID endpointId,
            @RequestParam(required = false) Integer statusCode,
            @RequestParam(required = false) String statusClass,
            @RequestParam(required = false) Integer minDurationMs,
            @RequestParam(required = false) String traceId,
            @RequestParam(required = false) String requestId,
            Pageable pageable) {
        return ApiResponses.okPage(requestLogFacade.list(
                principal.getActiveTenantId(),
                from,
                to,
                productId,
                serviceId,
                endpointId,
                statusCode,
                statusClass,
                minDurationMs,
                traceId,
                requestId,
                pageable));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<RequestLogResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
        return ApiResponses.ok(requestLogFacade.getById(principal.getActiveTenantId(), id));
    }
}
