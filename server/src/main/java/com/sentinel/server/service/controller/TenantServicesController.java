package com.sentinel.server.service.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.entity.ServiceStatus;
import com.sentinel.server.service.service.ServiceFacade;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class TenantServicesController {

    private final ServiceFacade serviceFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<PageResponse<ServiceResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable,
            @RequestParam(required = false) ServiceStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String searchBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdTo) {
        return ApiResponses.okPage(serviceFacade.listAll(
                principal.getActiveTenantId(),
                pageable,
                status,
                q,
                searchBy,
                createdFrom,
                createdTo));
    }
}
