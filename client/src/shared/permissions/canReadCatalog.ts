import type { RoleSummary } from '../../features/auth/dto/response/auth.response'

const CATALOG_SCOPE_TYPES = new Set(['TENANT', 'PRODUCT', 'SERVICE'])
const READ_PERMISSIONS = new Set(['READ', 'READ_AND_WRITE', 'ALL'])

/** Sentinel admin or any role with product/service/tenant scope at read level. */
export function canReadCatalog(
  sentinelAdmin: boolean | undefined,
  roles: RoleSummary[],
): boolean {
  if (sentinelAdmin) {
    return true
  }
  return roles.some((role) =>
    role.scopes.some(
      (scope) =>
        CATALOG_SCOPE_TYPES.has(scope.scopeType) &&
        READ_PERMISSIONS.has(scope.permission),
    ),
  )
}
