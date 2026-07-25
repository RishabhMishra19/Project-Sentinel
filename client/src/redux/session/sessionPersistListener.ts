import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import type { TenantSummary } from '../../features/auth/dto/response/auth.response'
import { SessionStorage } from './SessionStorage'
import {
  clearActiveTenant,
  clearSession,
  setActiveTenant,
  setAuthSession,
} from './sessionSlice'

export const sessionPersistListener = createListenerMiddleware()

sessionPersistListener.startListening({
  matcher: isAnyOf(
    setAuthSession,
    setActiveTenant,
    clearActiveTenant,
    clearSession,
  ),
  effect: (_action, listenerApi) => {
    const { isLoggedIn, activeTenant } = (
      listenerApi.getState() as {
        session: {
          isLoggedIn: boolean
          activeTenant: TenantSummary | null
        }
      }
    ).session

    if (!isLoggedIn) {
      SessionStorage.clearPersistedSession()
      return
    }

    SessionStorage.savePersistedSession({
      isLoggedIn,
      activeTenant,
    })
  },
})
