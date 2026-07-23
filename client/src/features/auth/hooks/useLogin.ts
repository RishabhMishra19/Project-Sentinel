import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { setCredentials } from '../slices/authSlice'
import { login } from '../api/authApi'
import type { LoginRequest } from '../dto/auth.dto'

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }))
      navigate('/', { replace: true })
    },
  })
}
