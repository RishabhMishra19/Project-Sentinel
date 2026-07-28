import type { AuthSessionUser } from "../../features/auth/dto/response/auth.response";
import type { TenantSummary } from "../../features/tenants/dto/response/tenant.response";

export const isImpersonating = (
  user: AuthSessionUser,
  activeTenant: TenantSummary | null,
): boolean => {
  return user.sentinelAdmin === true && activeTenant != null;
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
