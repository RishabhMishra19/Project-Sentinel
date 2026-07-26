import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthSessionResponse,
  AuthSessionUser,
  TenantSummary,
} from "../../features/auth/dto/response/auth.response";
import { SessionStorage } from "./SessionStorage";

export interface SessionState {
  isLoading: boolean;
  isLoggedIn: boolean;
  accessToken: string | null;
  user: AuthSessionUser | null;
  activeTenant: TenantSummary | null;
}

const persisted = SessionStorage.loadPersistedSession();

const initialState: SessionState = {
  isLoading: true,
  isLoggedIn: persisted.isLoggedIn,
  accessToken: null,
  user: null,
  activeTenant: persisted.activeTenant,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    /** Login, refresh, change-password — full session + access token. */
    setAuthSession(state, action: PayloadAction<AuthSessionResponse>) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isLoggedIn = true;
      state.isLoading = false;
      // Tenant users: activeTenant is always their home tenant.
      // Sentinel admins: leave as-is (null = platform mode, or login-as override).
      if (!user.sentinelAdmin) {
        state.activeTenant = user.tenant;
      }
    },
    /** Admin Login-as-tenant: drive X-Tenant-Id. */
    setActiveTenant(state, action: PayloadAction<TenantSummary>) {
      state.activeTenant = action.payload;
    },
    /** Clear admin Login-as-tenant override (back to platform mode). */
    clearActiveTenant(state) {
      state.activeTenant = null;
    },
    /** Full sign-out: wipe in-memory session. */
    clearSession(state) {
      state.isLoading = false;
      state.accessToken = null;
      state.user = null;
      state.activeTenant = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setAuthSession, setActiveTenant, clearActiveTenant, clearSession } =
  sessionSlice.actions;
export default sessionSlice.reducer;
