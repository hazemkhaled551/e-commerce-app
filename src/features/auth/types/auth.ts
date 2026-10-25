export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role?: 'member' | 'vip' | 'staff'
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
  acceptTerms?: boolean
  marketingOptIn?: boolean
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
