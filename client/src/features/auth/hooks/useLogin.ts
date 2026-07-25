import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../redux/hooks'
import { setAuthSession } from '../../../redux/session/sessionSlice'
import { resolvePostLoginPath } from '../../../shared/session/sessionUtils'
import { AuthApi } from '../api/AuthApi'
import type { LoginRequest } from '../dto/request/auth.request'

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginRequest) => AuthApi.login(payload),
    onSuccess: (data) => {
      dispatch(setAuthSession(data))
      navigate(resolvePostLoginPath(data.user), { replace: true })
    },
  })
}
