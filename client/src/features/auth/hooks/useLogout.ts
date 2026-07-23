import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { clearAuth } from '../slices/authSlice'
import { logout } from '../api/authApi'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      dispatch(clearAuth())
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}
