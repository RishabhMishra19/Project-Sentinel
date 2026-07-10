import {apiClient} from "./apiClient";
import type {AxiosRequestConfig} from "axios";

class ApiService {

    public async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {

        const response = await apiClient.get<T>(url, config);

        return response.data;
    }

    public async post<T, R>(
        url: string,
        body: T,
        config?: AxiosRequestConfig
    ): Promise<R> {

        const response = await apiClient.post<R>(
            url,
            body,
            config
        );

        return response.data;
    }

    public async put<T, R>(
        url: string,
        body: T,
        config?: AxiosRequestConfig
    ): Promise<R> {

        const response = await apiClient.put<R>(
            url,
            body,
            config
        );

        return response.data;
    }

    public async delete<R>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {

        const response = await apiClient.delete<R>(
            url,
            config
        );

        return response.data;
    }

}

export default new ApiService();