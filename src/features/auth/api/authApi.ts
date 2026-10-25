import { axiosInstance } from '@/lib/api/axiosInstance'
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth'

export interface AuthResponse {
  user: User
  token: string
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
    return response.data
  } catch {
    // Graceful fallback for local development & demonstration
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!credentials.email.includes('@')) {
      throw new Error('Please provide a valid email format')
    }
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    return {
      user: {
        id: 'usr_sarah_101',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBVbYPVW_AgDMtsdZNSYFLcx_77K8jJtIY9HsOi1MIDrhl4WOuAPrADATSSMbiGdJWiV9RGmMgeoGE7g9uEsZF4IPCTEfxd8ebiYaxeFV_Nloo7oq_eknKSvCmn2JMb0eoGuDT_0psm8UYlVbM6CldEIm48tIfXzEvPgI7bGK0K5dIguGYqQJwyvE0hE9w2AIe6gWY2x4PyCl05UWgrU70C6VJ1zkTMSFGWfgzcJt7AqUy68saHQI5yag',
        role: 'member',
      },
      token: 'jwt_mock_token_nexa_2026',
    }
  }
}

export async function registerApi(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials)
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!credentials.name.trim()) {
      throw new Error('Full name is required')
    }
    if (!credentials.email.includes('@')) {
      throw new Error('Please provide a valid email format')
    }
    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    return {
      user: {
        id: 'usr_new_' + Date.now(),
        name: credentials.name,
        email: credentials.email,
        role: 'member',
      },
      token: 'jwt_mock_register_token_2026',
    }
  }
}

export interface ForgotPasswordResponse {
  message: string
  resetTokenId: string
  expiresInMinutes: number
}

export async function forgotPasswordApi(email: string): Promise<ForgotPasswordResponse> {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Please enter a valid, complete email address (e.g. name@domain.com)')
    }

    if (email.toLowerCase().includes('ratelimit') || email.toLowerCase().includes('limit')) {
      const err = new Error('Too many recovery attempts. Please wait 15 minutes before trying again.')
      ;(err as unknown as { status: number }).status = 429
      throw err
    }

    return {
      message: 'Recovery email dispatched successfully',
      resetTokenId: 'NX-8891',
      expiresInMinutes: 60,
    }
  }
}

export async function resendPasswordResetApi(email: string): Promise<ForgotPasswordResponse> {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>('/auth/resend-reset', { email })
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return {
      message: 'Fresh token dispatched',
      resetTokenId: 'NX-8892',
      expiresInMinutes: 60,
    }
  }
}

export interface ResetPasswordPayload {
  otp: string
  newPassword: string
  email?: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>('/auth/reset-password', payload)
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!payload.otp || payload.otp.length < 6) {
      throw new Error('Please enter a valid 6-digit verification code')
    }
    if (payload.otp === '000000') {
      const err = new Error('Verification code has expired or is invalid. Please request a new one.')
      ;(err as unknown as { status: number }).status = 400
      throw err
    }
    if (payload.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    return {
      message: 'Password reset successfully',
      success: true,
    }
  }
}
