import { useQuery } from '@tanstack/react-query'
import { AuthApi } from '../api/AuthApi'

export const profileQueryKey = ['auth', 'profile'] as const

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () => AuthApi.getProfile(),
  })
}
