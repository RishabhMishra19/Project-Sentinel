import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MeResponse, RoleSummary, UserSummary } from '../dto/auth.dto'

export type MeStatus = 'idle' | 'loading' | 'ready' | 'error'

interface AuthState {
  accessToken: string | null
  user: UserSummary | null
  roles: RoleSummary[]
  meStatus: MeStatus
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  roles: [],
  meStatus: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; user?: UserSummary | null }>) {
      state.accessToken = action.payload.accessToken
      if (action.payload.user !== undefined) {
        state.user = action.payload.user
      }
      // Force /me reload whenever a new access token is set
      state.roles = []
      state.meStatus = 'idle'
    },
    setMeLoading(state) {
      state.meStatus = 'loading'
    },
    setMe(state, action: PayloadAction<MeResponse>) {
      state.user = action.payload.user
      state.roles = action.payload.roles
      state.meStatus = 'ready'
    },
    setMeError(state) {
      state.meStatus = 'error'
    },
    clearAuth(state) {
      state.accessToken = null
      state.user = null
      state.roles = []
      state.meStatus = 'idle'
    },
  },
})

export const { setCredentials, setMeLoading, setMe, setMeError, clearAuth } = authSlice.actions
export default authSlice.reducer
