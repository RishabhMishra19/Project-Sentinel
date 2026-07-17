interface CurrentUser {
  id: string;
  name: string;
  email: string;
  status: string;
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
}
