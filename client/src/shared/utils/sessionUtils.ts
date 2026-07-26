import type {
  AuthSessionUser,
  TenantSummary,
} from "../../features/auth/dto/response/auth.response";

/** Sentinel admin currently logged into a tenant (Login-as). */
export const isImpersonating = (
  user: AuthSessionUser,
  activeTenant: TenantSummary | null,
): boolean => {
  return user.sentinelAdmin === true && activeTenant != null;
};

/**
 * Keep route guards and nav in sync via this helper only.
 *
 * - "only_admin" — Sentinel admin in platform mode (no Login-as tenant)
 * - "tenant_context" — tenant user, or Sentinel admin impersonating a tenant
 */
export const resolveSessionMode = (user: AuthSessionUser, activeTenant: TenantSummary | null) => {
  if (user.sentinelAdmin === true && !isImpersonating(user, activeTenant)) {
    return "only_admin";
  }

  return "tenant_context";
};

export const isOnlySentinelAdminView = (
  isLoggedIn: boolean,
  user: AuthSessionUser | null,
  activeTenant: TenantSummary | null,
) => {
  return isLoggedIn && !!user?.sentinelAdmin && !activeTenant;
};

export const isTenantUserOrSentinelAdminView = (
  isLoggedIn: boolean,
  user: AuthSessionUser | null,
  activeTenant: TenantSummary | null,
) => {
  return isLoggedIn && (!user?.sentinelAdmin || (user?.sentinelAdmin && !!activeTenant));
};
