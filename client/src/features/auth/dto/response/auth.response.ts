export interface RoleSummary {
  id: string;
  name: string;
  scopes: RoleSummaryScope[];
}

export interface RoleSummaryScope {
  id: string;
  scopeType: string;
  scopeId: string | null;
  permission: string;
}

export interface TenantSummary {
  id: string;
  name: string;
}

type AuthSessionUserBase = {
  id: string;
  email: string;
  name: string;
  roles: RoleSummary[];
};

/** Sentinel admin: no home tenant. Non-admin: tenant is always present. */
export type AuthSessionUser =
  | (AuthSessionUserBase & {
      sentinelAdmin: true;
      tenant: null;
    })
  | (AuthSessionUserBase & {
      sentinelAdmin: false;
      tenant: TenantSummary;
    });

export interface AuthSessionResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthSessionUser;
}

export type UserStatus = "ACTIVE" | "INACTIVE";

/** Session user fields plus account metadata. */
export type ProfileResponse = AuthSessionUser & {
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};
