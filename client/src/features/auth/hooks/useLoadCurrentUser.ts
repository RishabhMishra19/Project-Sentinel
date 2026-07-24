import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { me } from '../api/authApi'
import { clearAuth, setMe, setMeError, setMeLoading } from '../slices/authSlice'

/**
 * Whenever an access token exists, fetch /me into Redux.
 * Independent of which page the user lands on after login.
 *
 * Intentionally depends only on `accessToken` (not `meStatus`): including
 * `meStatus` re-ran this effect after `setMeLoading()`, which cancelled the
 * in-flight request and then bailed because status was no longer `idle` —
 * leaving the sidebar stuck on "Fetching account".
 */
export function useLoadCurrentUser() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  useEffect(() => {
    if (!accessToken) {
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
  }, [accessToken, dispatch])
}
