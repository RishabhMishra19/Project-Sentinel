import { apiClient } from "./apiClient";
import type { AxiosRequestConfig } from "axios";

class ApiService {
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.get<T>(url, config);
    return data;
  }

  public async post<T, R>(url: string, body: T, config?: AxiosRequestConfig): Promise<R> {
    const { data } = await apiClient.post<R>(url, body, config);
    return data;
  }

  public async put<T, R>(url: string, body: T, config?: AxiosRequestConfig): Promise<R> {
    const { data } = await apiClient.put<R>(url, body, config);
    return data;
  }

  public async delete<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const { data } = await apiClient.delete<R>(url, config);
    return data;
  }
}

export default new ApiService();
