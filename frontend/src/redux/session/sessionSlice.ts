import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSessionResponse } from "../../features/auth/dto/response/auth.response";
import type { TenantSummary } from "../../features/tenants/dto/response/tenant.response";

type Session =
  | {
      state: "PENDING" | "NO_AUTH" | "RESTORING_AUTH";
      auth?: undefined;
      activeTenant?: undefined;
    }
  | {
      state: "LOGGED_IN";
      auth: AuthSessionResponse;
      activeTenant?: TenantSummary;
    };

const initialState = {
  state: "PENDING",
} as Session;

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthSessionResponse>) {
      return {
        ...state,
        state: "LOGGED_IN",
        auth: action.payload,
      };
    },
    setNoAuth() {
      return {
        state: "NO_AUTH",
      } as Session;
    },
    setRestoringAuth() {
      return {
        state: "RESTORING_AUTH",
      } as Session;
    },
    setActiveTenant(state, action: PayloadAction<TenantSummary>) {
      if (state.state !== "LOGGED_IN") {
        return state;
      }
      return {
        ...state,
        activeTenant: action.payload,
      };
    },
    clearActiveTenant(state) {
      if (state.state !== "LOGGED_IN") {
        return state;
      }
      return {
        ...state,
        activeTenant: undefined,
      };
    },
  },
});

export const { setAuth, setNoAuth, setRestoringAuth, setActiveTenant, clearActiveTenant } =
  sessionSlice.actions;
export default sessionSlice.reducer;
