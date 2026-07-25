import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../redux/hooks'
import { ROUTES } from '../../../routes/paths'
import { clearSession } from '../../../redux/session/sessionSlice'
import { AuthApi } from '../api/AuthApi'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => AuthApi.logout(),
    onSettled: () => {
      dispatch(clearSession())
      queryClient.clear()
      navigate(ROUTES.LOGIN, { replace: true })
    },
  })
}
