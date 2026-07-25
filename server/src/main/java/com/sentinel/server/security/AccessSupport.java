package com.sentinel.server.security;

import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.RoleScopeType;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Shared access helpers for {@code @PreAuthorize}.
 * {@link #isSentinelAdmin()} is platform-wide — not tenant-specific.
 * {@link #isTenantAdmin()} is company-wide inside the user's home tenant only.
 */
@Component("accessSupport")
public class AccessSupport {

    private static final Set<RoleScopeType> PRODUCT_SERVICE_SCOPE_TYPES =
            EnumSet.of(RoleScopeType.TENANT, RoleScopeType.PRODUCT, RoleScopeType.SERVICE);

    private static final Set<PermissionType> READ_PERMISSIONS =
            EnumSet.of(PermissionType.READ, PermissionType.READ_AND_WRITE, PermissionType.ALL);

    private static final Set<PermissionType> WRITE_PERMISSIONS =
            EnumSet.of(PermissionType.READ_AND_WRITE, PermissionType.ALL);

    public boolean isSentinelAdmin() {
        return currentPrincipal().isSentinelAdmin();
    }

    /**
     * Tenant admin for the active tenant (must match home tenant). Never grants platform access.
     */
    public boolean isTenantAdmin() {
        UserPrincipal principal = currentPrincipal();
        if (!principal.isTenantAdmin()) {
            return false;
        }
        if (principal.getActiveTenantId() == null || principal.getHomeTenantId() == null) {
            return false;
        }
        return Objects.equals(principal.getActiveTenantId(), principal.getHomeTenantId());
    }

    /** Sentinel admin, tenant admin, or active tenant with read-level permission. */
    public boolean canReadTenant() {
        if (isSentinelAdmin() || isTenantAdmin()) {
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

    /** Sentinel admin, tenant admin, or active tenant with write-level permission. */
    public boolean canWriteTenant() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasAnyAuthority(PermissionType.READ_AND_WRITE.name(), PermissionType.ALL.name());
    }

    /** Sentinel admin, tenant admin, or active tenant with product/service scope at read level. */
    public boolean canReadProductsAndServices() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasProductsAndServicesPermission(READ_PERMISSIONS);
    }

    /** Sentinel admin, tenant admin, or active tenant with product/service scope at write level. */
    public boolean canWriteProductsAndServices() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasProductsAndServicesPermission(WRITE_PERMISSIONS);
    }

    /**
     * Sentinel admin, tenant admin, or active tenant with a TENANT-scoped grant at read level.
     */
    public boolean canReadUsers() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasTenantScopePermission(READ_PERMISSIONS);
    }

    /**
     * Sentinel admin, tenant admin, or active tenant with a TENANT-scoped grant at write level.
     */
    public boolean canWriteUsers() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasTenantScopePermission(WRITE_PERMISSIONS);
    }

    private boolean hasTenantScopePermission(Set<PermissionType> allowed) {
        return currentPrincipal().getScopeGrants().stream()
                .anyMatch(grant -> grant.scopeType() == RoleScopeType.TENANT
                        && allowed.contains(grant.permission()));
    }

    private boolean hasProductsAndServicesPermission(Set<PermissionType> allowed) {
        return currentPrincipal().getScopeGrants().stream()
                .anyMatch(grant -> PRODUCT_SERVICE_SCOPE_TYPES.contains(grant.scopeType())
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
