import { axiosInstance } from '@/lib/api/axiosInstance'
import type {
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterCredentials,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ResendVerificationResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '../types/auth'

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', {
    email: (credentials.email || '').trim().toLowerCase(),
    password: credentials.password || '',
  })
  return response.data
}

export async function registerApi(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const payload: RegisterPayload = {
    name: (credentials.name || '').trim(),
    email: (credentials.email || '').trim().toLowerCase(),
    phone: (credentials.phone || '').trim(),
    password: credentials.password || '',
    confirmPassword: credentials.confirmPassword || credentials.password || '',
  }

  const response = await axiosInstance.post<RegisterResponse>('/api/v1/auth/register', payload)
  return response.data
}

export async function verifyEmailApi(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
  const response = await axiosInstance.post<VerifyEmailResponse>('/api/v1/auth/verify-email', {
    email: (payload.email || '').trim().toLowerCase(),
    otp: (payload.otp || '').trim(),
  })
  return response.data
}

export async function resendVerificationApi(email: string): Promise<ResendVerificationResponse> {
  const response = await axiosInstance.post<ResendVerificationResponse>('/api/v1/auth/resend-verification', {
    email: (email || '').trim().toLowerCase(),
  })
  return response.data
}

export async function refreshTokenApi(): Promise<RefreshResponse> {
  const response = await axiosInstance.post<RefreshResponse>('/api/v1/auth/refresh')
  return response.data
}

export async function logoutApi(): Promise<LogoutResponse> {
  const response = await axiosInstance.post<LogoutResponse>('/api/v1/auth/logout')
  return response.data
}

export async function forgotPasswordApi(email: string): Promise<ForgotPasswordResponse> {
  const response = await axiosInstance.post<ForgotPasswordResponse>('/api/v1/auth/forgot-password', {
    email: (email || '').trim().toLowerCase(),
  })
  return response.data
}

export async function resendPasswordResetApi(email: string): Promise<ForgotPasswordResponse> {
  return forgotPasswordApi(email)
}

export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const response = await axiosInstance.post<ResetPasswordResponse>('/api/v1/auth/reset-password', {
    email: (payload.email || '').trim().toLowerCase(),
    otp: (payload.otp || '').trim(),
    newPassword: payload.newPassword || '',
    confirmNewPassword: payload.confirmNewPassword || payload.newPassword || '',
  })
  return response.data
}
