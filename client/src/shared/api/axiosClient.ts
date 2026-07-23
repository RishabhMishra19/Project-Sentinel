import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { store } from '../../app/store'
import { clearAuth, setCredentials } from '../../features/auth/slices/authSlice'
import type { TokenResponse } from '../../features/auth/dto/auth.dto'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post<TokenResponse>(
      '/api/auth/refresh-token',
      {},
      { withCredentials: true },
    )
    store.dispatch(setCredentials({ accessToken: data.accessToken }))
    return data.accessToken
  } catch {
    store.dispatch(clearAuth())
    return null
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const token = await refreshPromise
      if (token) {
        original.headers.Authorization = `Bearer ${token}`
        return axiosClient(original)
      }
    }
    return Promise.reject(error)
  },
)
