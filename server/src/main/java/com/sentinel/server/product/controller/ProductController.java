package com.sentinel.server.product.controller;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.product.dto.request.CreateProductRequest;
import com.sentinel.server.product.dto.response.ProductResponse;
import com.sentinel.server.product.dto.request.UpdateProductRequest;
import com.sentinel.server.product.service.ProductFacade;
import com.sentinel.server.security.UserPrincipal;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductFacade productFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/search")
    public ResponseEntity<PageResponse<ProductResponse>> search(
            @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(productFacade.list(principal.getActiveTenantId(), query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
        return ApiResponses.ok(productFacade.getById(principal.getActiveTenantId(), id));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(
                productFacade.create(principal.getActiveTenantId(), request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(productFacade.update(
                principal.getActiveTenantId(), id, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        productFacade.softDelete(principal.getActiveTenantId(), id, principal.getId());
        return ApiResponses.noContent();
    }
}
