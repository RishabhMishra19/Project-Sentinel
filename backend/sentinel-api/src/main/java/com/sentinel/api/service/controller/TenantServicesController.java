package com.sentinel.api.service.controller;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.security.UserPrincipal;
import com.sentinel.api.service.dto.response.ServiceResponse;
import com.sentinel.api.service.service.ServiceFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class TenantServicesController {

    private final ServiceFacade serviceFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/search")
    public ResponseEntity<PageResponse<ServiceResponse>> search(
        @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(serviceFacade.listAll(principal.getActiveTenantId(), query));
    }
}
