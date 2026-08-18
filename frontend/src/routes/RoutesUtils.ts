import type { AuthSessionResponse } from "../features/auth/dto/response/auth.response";
import type { TenantSummary } from "../features/tenants/dto/response/tenant.response";

export class RoutesUtils {
  static isUserSentinelAdmin = (auth: AuthSessionResponse): boolean => {
    return auth.user.sentinelAdmin === true;
  };

  static isSentinelAdminTenantLoggedIn = (
    auth: AuthSessionResponse,
    activeTenant: TenantSummary | undefined,
  ): boolean => {
    return this.isUserSentinelAdmin(auth) && activeTenant != null;
  };

  static isActiveTenantSet = (activeTenant: TenantSummary | undefined): boolean => {
    return activeTenant != null;
  };
}
