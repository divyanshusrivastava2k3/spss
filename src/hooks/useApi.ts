"use client";

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

/**
 * Extended Axios config with metadata
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * API error structure
 */
export interface ApiError {
  error: string;
  details?: Record<string, any>;
  code?: string;
}

/**
 * Create an Axios instance with:
 * - Base URL from environment
 * - Automatic JWT token attachment
 * - Request/response logging
 * - Standardized error handling
 * - Retry logic with exponential backoff
 */
class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach auth token
    this.client.interceptors.request.use(
      async (config: ExtendedAxiosRequestConfig) => {
        // Try to get token from NextAuth session
        if (!this.accessToken) {
          try {
            const session = await getSession();
            this.accessToken = (session as any)?.accessToken || null;
          } catch {
            // Session not available, continue without token
          }
        }

        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors, retry logic
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.url}`, error.response?.data);
        }

        // Handle 401 - token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.accessToken = null; // Clear cached token

          try {
            // Try to refresh session
            const session = await getSession();
            this.accessToken = (session as any)?.accessToken || null;

            if (this.accessToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.client(originalRequest);
            }
          } catch {
            // Session refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              signOut({ callbackUrl: '/admin/login' });
            }
          }
        }

        // Retry logic for network errors (5xx, timeout, network error)
        const shouldRetry =
          !originalRequest._retry &&
          (error.code === 'ECONNABORTED' || // timeout
            !error.response || // network error
            (error.response.status >= 500 && error.response.status < 600)); // server error

        if (shouldRetry) {
          originalRequest._retry = true;
          const delay = Math.min(1000 * 2 ** (originalRequest._retry ? 1 : 0), 10000); // exponential backoff: 2s, 4s, 8s...
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.client(originalRequest);
        }

        // Format error for consistent handling
        const apiError: ApiError = {
          error: error.response?.data?.error || error.message || 'An error occurred',
          details: error.response?.data?.details,
          code: error.response?.data?.code || error.code,
        };

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Update access token (call after login)
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  /**
   * Upload file with progress
   */
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export helper to get typed API client
export function useApi() {
  return api;
}