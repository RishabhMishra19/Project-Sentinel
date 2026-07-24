import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../api/authApi'

export const profileQueryKey = ['auth', 'profile'] as const

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
  })
}
