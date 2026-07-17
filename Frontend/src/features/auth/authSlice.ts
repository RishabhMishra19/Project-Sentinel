import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "./dto/response/AuthResponse";

export interface AuthState {
  currentUser: AuthResponse["user"] | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate(state, action: PayloadAction<{ currentUser: AuthResponse["user"] }>) {
      state.currentUser = action.payload.currentUser;
      state.isLoading = false;
    },
    logout(state) {
      state.currentUser = null;
      state.isLoading = false;
    },
    finishLoading(state) {
      state.isLoading = false;
    },
  },
});

export const { authenticate, logout, finishLoading } = authSlice.actions;

export default authSlice.reducer;
