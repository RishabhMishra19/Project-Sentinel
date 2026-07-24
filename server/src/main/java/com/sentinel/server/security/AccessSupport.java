package com.sentinel.server.security;

import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.permission.entity.PermissionType;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Shared access helpers for {@code @PreAuthorize}.
 * {@link #isSentinelAdmin()} is platform-wide — not tenant-specific.
 */
@Component("accessSupport")
public class AccessSupport {

    public boolean isSentinelAdmin() {
        return currentPrincipal().isSentinelAdmin();
    }

    /** Sentinel admin, or active tenant with read-level permission. */
    public boolean canReadTenant() {
        if (isSentinelAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasAnyAuthority(
                PermissionType.READ.name(),
                PermissionType.READ_AND_WRITE.name(),
                PermissionType.ALL.name());
    }

    /** Sentinel admin, or active tenant with write-level permission. */
    public boolean canWriteTenant() {
        if (isSentinelAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasAnyAuthority(PermissionType.READ_AND_WRITE.name(), PermissionType.ALL.name());
    }

    private UserPrincipal currentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("Authentication required");
        }
        return principal;
    }

    private boolean hasAnyAuthority(String... authorities) {
        Set<String> wanted = Arrays.stream(authorities).collect(Collectors.toSet());
        return currentPrincipal().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(wanted::contains);
    }
}
