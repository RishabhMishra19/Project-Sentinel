package com.sentinel.server.security;

import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.RoleScopeType;
import java.util.Arrays;
import java.util.EnumSet;
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

    private static final Set<RoleScopeType> CATALOG_SCOPE_TYPES =
            EnumSet.of(RoleScopeType.TENANT, RoleScopeType.PRODUCT, RoleScopeType.SERVICE);

    private static final Set<PermissionType> READ_PERMISSIONS =
            EnumSet.of(PermissionType.READ, PermissionType.READ_AND_WRITE, PermissionType.ALL);

    private static final Set<PermissionType> WRITE_PERMISSIONS =
            EnumSet.of(PermissionType.READ_AND_WRITE, PermissionType.ALL);

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

    /** Sentinel admin, or active tenant with any catalog scope at read level. */
    public boolean canReadCatalog() {
        if (isSentinelAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasCatalogPermission(READ_PERMISSIONS);
    }

    /** Sentinel admin, or active tenant with any catalog scope at write level. */
    public boolean canWriteCatalog() {
        if (isSentinelAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasCatalogPermission(WRITE_PERMISSIONS);
    }

    private boolean hasCatalogPermission(Set<PermissionType> allowed) {
        return currentPrincipal().getScopeGrants().stream()
                .anyMatch(grant -> CATALOG_SCOPE_TYPES.contains(grant.scopeType())
                        && allowed.contains(grant.permission()));
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
