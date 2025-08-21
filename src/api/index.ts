import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/auth/auth.store';
import env from '@/env';

export type APIResponse<T> = {
    errcode?: number
    status: "OK" | "ERROR",
    success?: boolean,
    message?: string,
    error?: string,
    code?: string,
    statusCode?: number,
    data: T
}

export type ListAPIResponse<T> = {
    message?: string;
    paginate: {
        from: number;
        to: number;
        total: number;
    }
    data: T[];
    status?: number;
}

export type ListNoPagingateAPIResponse<T> = {
    message?: string;
    data: T[];
    status?: number;
}

export interface UpdateParams {
    uuid: string;
    [key: string]: unknown;
}

export type CreateResponse<T> = APIResponse<T>;
export type ReadResponse<T> = APIResponse<T>;
export type DeleteResponse<T = null> = APIResponse<T>;
export type UpdateResponse<T> = APIResponse<T>;

export interface ApiClientConfig {
    endpoint: string;
    token?: boolean | null;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string;
    body?: unknown | null;
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    timeout?: number;
}



/**
 * Reusable API client that handles common API operations
 * 
 * @param {ApiClientConfig} config - The configuration object
 * @returns {Promise<any>} - The axios response data
 */
export const apiClient = async ({
    endpoint,
    token = true,
    method = 'GET',
    body = null,
    headers = {},
    params = {},
    timeout = 30000,
}: ApiClientConfig): Promise<AxiosResponse> => {
    // Create default headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add authorization header if token is provided
    if (token && useAuthStore.getState().accessToken !== null) {
        // console.log('Token ============================');
        const getToken = () => useAuthStore.getState().accessToken;
        requestHeaders.Authorization = `Bearer ${getToken()}`;
    }

    // Create request config
    const config: AxiosRequestConfig = {
        method: method.toUpperCase() as AxiosRequestConfig['method'],
        url: endpoint,
        headers: requestHeaders,
        timeout,
        params,
    };

    // Add request body for non-GET requests if provided
    if (body && method.toUpperCase() !== 'GET') {
        config.data = body;
    }

    const response = await axios(config);
    return response;
};


export const API_CONFIG = {
    buildUrl: (endpoint: string) => `${env.API_BASE_URL}${endpoint}`,
};

export const EXTERNAL_API_CONFIG = {
    buildUrl: (baseUrl: string, endpoint: string) => `${baseUrl}${endpoint}`,
}
