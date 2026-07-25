import type {
  AuthSessionUser,
  TenantSummary,
} from "../../features/auth/dto/response/auth.response";

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
  const isSentinelAdmin = user.sentinelAdmin === true;
  const isImpersonating = isSentinelAdmin && activeTenant != null;

  if (isSentinelAdmin && !isImpersonating) {
    return "only_admin";
  }

  return "tenant_context";
}
