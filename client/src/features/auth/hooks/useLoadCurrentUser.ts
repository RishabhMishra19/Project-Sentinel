import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { me } from '../api/authApi'
import { clearAuth, setMe, setMeError, setMeLoading } from '../slices/authSlice'

/**
 * Whenever an access token exists and /me has not been loaded yet, fetch /me into Redux.
 * Independent of which page the user lands on after login.
 */
export function useLoadCurrentUser() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const meStatus = useAppSelector((state) => state.auth.meStatus)

  useEffect(() => {
    if (!accessToken || meStatus !== 'idle') {
      return
    }

    let cancelled = false
    dispatch(setMeLoading())

    void me()
      .then((data) => {
        if (!cancelled) {
          dispatch(setMe(data))
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(setMeError())
          dispatch(clearAuth())
        }
      })

    return () => {
      cancelled = true
    }
  }, [accessToken, meStatus, dispatch])
}
