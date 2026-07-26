package com.sentinel.server.logs.controller;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import com.sentinel.server.logs.service.RequestLogFacade;
import com.sentinel.server.security.UserPrincipal;
import java.util.UUID;
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

@RestController
@RequestMapping("/api/logs/requests")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogFacade requestLogFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/search")
    public ResponseEntity<PageResponse<RequestLogResponse>> search(
            @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(requestLogFacade.list(principal.getActiveTenantId(), query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<RequestLogResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
        return ApiResponses.ok(requestLogFacade.getById(principal.getActiveTenantId(), id));
    }
}
