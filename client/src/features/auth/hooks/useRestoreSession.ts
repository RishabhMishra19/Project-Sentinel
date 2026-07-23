import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { clearAuth, setCredentials } from '../slices/authSlice'
import { refresh } from '../api/authApi'

export function useRestoreSession() {
  const dispatch = useAppDispatch()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function restore() {
      try {
        const data = await refresh()
        if (!cancelled) {
          dispatch(setCredentials({ accessToken: data.accessToken }))
        }
      } catch {
        if (!cancelled) {
          dispatch(clearAuth())
        }
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [dispatch])

  return ready
}
