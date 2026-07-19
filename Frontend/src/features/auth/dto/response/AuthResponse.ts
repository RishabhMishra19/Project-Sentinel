export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  status: string;
  emailVerified: boolean;
  orgId: string;
  orgName: string;
  permissions: string[];
  roles: string[];
  lastLoginAt: Date;
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
}
