package com.sentinel.ingest.security;

import jakarta.servlet.http.HttpServletRequest;

public final class ServicePrincipalHolder {

    public static final String REQUEST_ATTR = "sentinel.servicePrincipal";

    private ServicePrincipalHolder() {}

    public static void set(HttpServletRequest request, ServicePrincipal principal) {
        request.setAttribute(REQUEST_ATTR, principal);
    }

    public static ServicePrincipal require(HttpServletRequest request) {
        Object value = request.getAttribute(REQUEST_ATTR);
        if (!(value instanceof ServicePrincipal principal)) {
            throw new IllegalStateException("Service principal missing from request");
        }
        return principal;
    }
}
