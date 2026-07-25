import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthSessionResponse,
  AuthSessionUser,
  TenantSummary,
} from "../../features/auth/dto/response/auth.response";
import { SessionStorage } from "./SessionStorage";

interface SessionState {
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

function persist(state: SessionState) {
  SessionStorage.savePersistedSession({
    isLoggedIn: state.isLoggedIn,
    activeTenant: state.activeTenant,
  });
}

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    /** Login, refresh, change-password — full session + access token. */
    setAuthSession(state, action: PayloadAction<AuthSessionResponse>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
      persist(state);
    },
    /** Admin Login-as-tenant: persist tenant and drive X-Tenant-Id. */
    setActiveTenant(state, action: PayloadAction<TenantSummary>) {
      state.activeTenant = action.payload;
      persist(state);
    },
    /** Clear admin Login-as-tenant override (drops X-Tenant-Id). */
    clearActiveTenant(state) {
      state.activeTenant = null;
      persist(state);
    },
    /** Full sign-out: wipe in-memory session and persisted localStorage. */
    clearSession(state) {
      state.isLoading = false;
      state.accessToken = null;
      state.user = null;
      state.activeTenant = null;
      state.isLoggedIn = false;
      SessionStorage.clearPersistedSession();
    },
  },
});

export const {
  setAuthSession,
  setActiveTenant,
  clearActiveTenant,
  clearSession,
} = sessionSlice.actions;
export default sessionSlice.reducer;
