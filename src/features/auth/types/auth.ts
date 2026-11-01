export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role?: 'CUSTOMER' | 'ADMIN' | 'member' | 'vip' | 'staff' | string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface TokenData {
  accessToken: string
  refreshToken?: string
  user?: User
  [key: string]: unknown
}

export interface LoginResponse {
  success: boolean
  status: number
  message?: string | null
  data: TokenData
  meta?: unknown
}

export interface RegisterCredentials {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms?: boolean
  marketingOptIn?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  success: boolean
  status: number
  message?: string | null
  data?: unknown
  meta?: unknown
}

export interface VerifyEmailPayload {
  email: string
  otp: string
}

export interface VerifyEmailResponse {
  success: boolean
  status: number
  message?: string | null
  data: TokenData
  meta?: unknown
}

export interface ResendVerificationPayload {
  email: string
}

export interface ResendVerificationResponse {
  success: boolean
  status: number
  message: string
  data?: unknown
  meta?: unknown
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  status: number
  message: string
  data?: unknown
  meta?: unknown
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  newPassword: string
  confirmNewPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  status: number
  message: string
  data?: unknown
  meta?: unknown
}

export interface RefreshResponse {
  success: boolean
  status: number
  message: string
  data?: {
    accessToken: string
    refreshToken?: string
    [key: string]: unknown
  }
  meta?: unknown
}

export interface LogoutResponse {
  success: boolean
  status: number
  message: string
  data?: unknown
  meta?: unknown
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export type AuthPreviewState =
  | 'default'
  | 'validation_error'
  | 'unverified'
  | 'rate_limited'
  | 'expired'
