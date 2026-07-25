import type {
  AuthSessionUser,
  TenantSummary,
} from "../../features/auth/dto/response/auth.response";
import {
  ADMIN_ONLY_ROUTES,
  TENANT_CONTEXT_ROUTES,
} from "../../routes/paths";

/** Sentinel admin currently logged into a tenant (Login-as). */
export function isImpersonating(
  user: AuthSessionUser,
  activeTenant: TenantSummary | null,
): boolean {
  return user.sentinelAdmin === true && activeTenant != null;
}

/**
 * Keep route guards and nav in sync via this helper only.
 *
 * - "only_admin" — Sentinel admin in platform mode (no Login-as tenant)
 * - "tenant_context" — tenant user, or Sentinel admin impersonating a tenant
 */
export function resolveSessionMode(
  user: AuthSessionUser,
  activeTenant: TenantSummary | null,
) {
  if (user.sentinelAdmin === true && !isImpersonating(user, activeTenant)) {
    return "only_admin";
  }

  return "tenant_context";
}

/** Default landing path after login (or when a signed-in user hits a guest route). */
export function resolvePostLoginPath(
  user: AuthSessionUser,
  activeTenant: TenantSummary | null = null,
) {
  if (resolveSessionMode(user, activeTenant) === "only_admin") {
    return ADMIN_ONLY_ROUTES.TENANTS;
  }
  return TENANT_CONTEXT_ROUTES.PRODUCTS;
}
