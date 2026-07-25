import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '../../../redux/hooks'
import { setAuthSession } from '../../../redux/session/sessionSlice'
import { AuthApi } from '../api/AuthApi'
import type { ChangePasswordRequest } from '../dto/request/auth.request'

export function useChangePassword() {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => AuthApi.changePassword(payload),
    onSuccess: (data) => {
      dispatch(setAuthSession(data))
    },
  })
}
