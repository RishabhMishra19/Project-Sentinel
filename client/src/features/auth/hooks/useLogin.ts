import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../redux/hooks'
import { SHARED_ROUTES } from '../../../routes/paths'
import { setAuthSession } from '../../../redux/session/sessionSlice'
import { AuthApi } from '../api/AuthApi'
import type { LoginRequest } from '../dto/request/auth.request'

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginRequest) => AuthApi.login(payload),
    onSuccess: (data) => {
      dispatch(setAuthSession(data))
      navigate(SHARED_ROUTES.PROFILE, { replace: true })
    },
  })
}
