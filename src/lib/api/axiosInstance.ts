import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import {
  getCookie,
  setCookie,
  deleteCookie,
  ACCESS_TOKEN_COOKIE,
} from '@/lib/utils/cookies'

export interface ApiErrorResponse {
  message: string
  status?: number
  errors?: string[]
  details?: unknown
}

export class ApiError extends Error {
  status?: number
  errors?: string[]
  details?: unknown

  constructor(message: string, status?: number, errors?: string[], details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1').trim()
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT Access Token from Cookies or localStorage
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      getCookie(ACCESS_TOKEN_COOKIE) ||
      (typeof window !== 'undefined' ? localStorage.getItem('nexa_auth_token') : null)

    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

interface QueuedPromise {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueuedPromise[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor with centralized normalization and automatic Refresh Token rotation
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[]; errors?: string[]; statusCode?: number }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const responseData = error.response?.data
    const status = error.response?.status

    let message = 'An unexpected network error occurred'
    let errorsList: string[] | undefined

    if (responseData) {
      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        errorsList = responseData.errors
        message = responseData.errors.join('. ')
      } else if (typeof responseData.message === 'string') {
        message = responseData.message
      } else if (Array.isArray(responseData.message) && responseData.message.length > 0) {
        errorsList = responseData.message
        message = responseData.message.join('. ')
      } else if (error.message) {
        message = error.message
      }
    } else if (error.message) {
      message = error.message
    }

    const apiError = new ApiError(message, status, errorsList, responseData)

    // Handle 401 Unauthorized token refresh rotation
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const requestUrl = originalRequest.url || ''
      const isAuthExempt =
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/verify-email')

      if (isAuthExempt) {
        return Promise.reject(apiError)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post<{
          success?: boolean
          status?: number
          data?: { accessToken?: string; [key: string]: unknown }
          accessToken?: string
        }>(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
            },
          }
        )

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken

        if (!newAccessToken) {
          throw new Error('Refresh token rotation failed: No access token returned')
        }

        // Store new access token in Cookies (not localStorage)
        setCookie(ACCESS_TOKEN_COOKIE, newAccessToken, 7)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nexa_auth_token')
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)
        return axiosInstance(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        deleteCookie(ACCESS_TOKEN_COOKIE)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nexa_auth_token')
          localStorage.removeItem('nexa_auth_user')
          localStorage.removeItem('user')
        }
        return Promise.reject(apiError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(apiError)
  }
)
