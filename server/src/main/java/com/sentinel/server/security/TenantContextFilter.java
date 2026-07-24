package com.sentinel.server.security;

import com.sentinel.server.tenant.repository.TenantRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** After JWT: set {@code activeTenantId} from {@code X-Tenant-Id}; non-admins must match home. */
@Component
@RequiredArgsConstructor
public class TenantContextFilter extends OncePerRequestFilter {

    public static final String TENANT_ID_HEADER = "X-Tenant-Id";

    private final TenantRepository tenantRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String raw = request.getHeader(TENANT_ID_HEADER);
        if (raw == null || raw.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            filterChain.doFilter(request, response);
            return;
        }

        UUID tenantId;
        try {
            tenantId = UUID.fromString(raw.trim());
        } catch (IllegalArgumentException ex) {
            reject(response, HttpServletResponse.SC_BAD_REQUEST, "BAD_REQUEST", "Invalid X-Tenant-Id");
            return;
        }

        if (principal.isSentinelAdmin()) {
            if (!tenantRepository.existsById(tenantId)) {
                reject(response, HttpServletResponse.SC_NOT_FOUND, "NOT_FOUND", "Tenant not found");
                return;
            }
        } else if (!tenantId.equals(principal.getHomeTenantId())) {
            reject(response, HttpServletResponse.SC_FORBIDDEN, "FORBIDDEN", "Access Denied");
            return;
        }

        UserPrincipal updated = principal.withActiveTenantId(tenantId);
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(
                        updated, null, updated.getAuthorities()));

        filterChain.doFilter(request, response);
    }

    private static void reject(HttpServletResponse response, int status, String code, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter()
                .write("{\"errorCode\":\"" + code + "\",\"message\":\"" + message + "\"}");
    }
}
