package com.sentinel.api.security;

import com.sentinel.api.common.exception.UnauthorizedException;
import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.RoleScopeType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Shared access helpers for {@code @PreAuthorize}. {@link #isSentinelAdmin()} is platform-wide — not tenant-specific.
 * {@link #isTenantAdmin()} is company-wide inside the user's home tenant only.
 */
@Component("accessSupport")
public class AccessSupport {

    private static final Set<RoleScopeType> PRODUCT_SERVICE_SCOPE_TYPES =
        EnumSet.of(RoleScopeType.PRODUCT, RoleScopeType.SERVICE);

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

    /**
     * Sentinel admin, tenant admin, or active tenant with read-level permission.
     */
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

    /**
     * Same as {@link #canReadTenant()}, plus path tenant must be the active tenant (sentinel admins may access any tenant).
     */
    public boolean canReadTenant(UUID tenantId) {
        return canReadTenant() && canOperateOnTenant(tenantId);
    }

    /**
     * Sentinel admin, tenant admin, or active tenant with write-level permission.
     */
    public boolean canWriteTenant() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasAnyAuthority(PermissionType.READ_AND_WRITE.name(), PermissionType.ALL.name());
    }

    /**
     * Same as {@link #canWriteTenant()}, plus path tenant must be the active tenant (sentinel admins may access any tenant).
     */
    public boolean canWriteTenant(UUID tenantId) {
        return canWriteTenant() && canOperateOnTenant(tenantId);
    }

    /**
     * Sentinel admins: any tenant. Everyone else: path id must equal activeTenantId.
     */
    public boolean canOperateOnTenant(UUID tenantId) {
        if (isSentinelAdmin()) {
            return true;
        }
        return Objects.equals(currentPrincipal().getActiveTenantId(), tenantId);
    }

    /**
     * Sentinel admin, tenant admin, or active tenant with product/service scope at read level.
     */
    public boolean canReadProductsAndServices() {
        if (isSentinelAdmin() || isTenantAdmin()) {
            return true;
        }
        if (currentPrincipal().getActiveTenantId() == null) {
            return false;
        }
        return hasProductsAndServicesPermission(READ_PERMISSIONS);
    }

    /**
     * Sentinel admin, tenant admin, or active tenant with product/service scope at write level.
     */
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
     * Sentinel admin or tenant admin (home tenant only).
     */
    public boolean canReadUsers() {
        return isSentinelAdmin() || isTenantAdmin();
    }

    /**
     * Sentinel admin or tenant admin (home tenant only).
     */
    public boolean canWriteUsers() {
        return isSentinelAdmin() || isTenantAdmin();
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
