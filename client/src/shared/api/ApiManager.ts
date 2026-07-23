import type { AxiosRequestConfig } from 'axios'
import { axiosClient } from './axiosClient'

/**
 * Thin HTTP facade over the current client (Axios).
 * Swap the implementation here later without changing feature API modules.
 */
class ApiManager {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.get<T>(url, config).then((res) => res.data)
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.post<T>(url, data, config).then((res) => res.data)
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.put<T>(url, data, config).then((res) => res.data)
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.patch<T>(url, data, config).then((res) => res.data)
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.delete<T>(url, config).then((res) => res.data)
  }
}

export const apiManager = new ApiManager()
