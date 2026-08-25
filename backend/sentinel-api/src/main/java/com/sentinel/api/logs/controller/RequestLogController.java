package com.sentinel.api.logs.controller;

import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;
import com.sentinel.api.logs.service.RequestLogFacade;
import com.sentinel.api.security.UserPrincipal;
import com.sentinel.common.cassandra.paginator.dto.CursorPaginationRequest;
import com.sentinel.common.cassandra.paginator.dto.CursorPaginationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/services/{serviceId}/logs/requests")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogFacade requestLogFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("")
    public ResponseEntity<CursorPaginationResponse<RequestLogListResponse>> getAll(
        @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID serviceId,
        @Valid @RequestBody CursorPaginationRequest request) {

        return ApiResponses.okPage(requestLogFacade.getAll(
            GetRequestLogsListRequest.builder()
                .tenantId(principal.getActiveTenantId())
                .serviceId(serviceId)
                .cursor(request.getCursor())
                .pageSize(request.getPageSize())
                .direction(request.getDirection())
                .build()
        ));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<RequestLogListResponse> getById(
        @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID serviceId, @PathVariable UUID id) {
        return ApiResponses.ok(requestLogFacade.getById(principal.getActiveTenantId(), serviceId, id));
    }
}
