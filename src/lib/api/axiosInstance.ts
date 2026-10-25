import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

export interface ApiErrorResponse {
  message: string
  status?: number
  details?: unknown
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor for cross-cutting logic (e.g., auth tokens, request tracking)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add custom request tracking or authorization headers if present
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// Response interceptor for centralized error normalization
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const normalizedError: ApiErrorResponse = {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred',
      status: error.response?.status,
      details: error.response?.data,
    }
    return Promise.reject(normalizedError)
  }
)
