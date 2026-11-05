import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  AuthState,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterCredentials,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ResendVerificationResponse,
  User,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '../types/auth'
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  refreshTokenApi,
  registerApi,
  resendVerificationApi,
  resetPasswordApi,
  verifyEmailApi,
} from '../api/authApi'
import {
  getCookie,
  setCookie,
  deleteCookie,
  ACCESS_TOKEN_COOKIE,
} from '@/lib/utils/cookies'

const TOKEN_KEY = 'nexa_auth_token'
const USER_KEY = 'nexa_auth_user'

const savedToken =
  getCookie(ACCESS_TOKEN_COOKIE) ||
  (typeof window !== 'undefined'
    ? localStorage.getItem(TOKEN_KEY) || localStorage.getItem('access_token') || localStorage.getItem('token')
    : null)

const savedUser =
  typeof window !== 'undefined'
    ? (JSON.parse(
        localStorage.getItem(USER_KEY) || localStorage.getItem('user') || 'null'
      ) as User | null)
    : null

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken && savedUser),
  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk<
  LoginResponse & { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials)
      const token = data.data?.accessToken || (data as unknown as { accessToken?: string }).accessToken
      const user = data.data?.user || (data as unknown as { user?: User }).user || {
        id: 'usr_' + Date.now(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'CUSTOMER',
      }

      // Store accessToken in Cookies and localStorage for persistence
      if (token) {
        setCookie(ACCESS_TOKEN_COOKIE, token, 7)
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token)
        }
      }

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        localStorage.setItem('user', JSON.stringify(user))
      }

      return {
        ...data,
        token: token || '',
        user,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const data = await registerApi(credentials)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      return rejectWithValue(message)
    }
  }
)

export const verifyEmailUser = createAsyncThunk<
  VerifyEmailResponse & { user: User; token: string },
  VerifyEmailPayload,
  { rejectValue: string }
>(
  'auth/verifyEmailUser',
  async (payload: VerifyEmailPayload, { rejectWithValue }) => {
    try {
      const data = await verifyEmailApi(payload)
      const token = data.data?.accessToken
      const user = data.data?.user || {
        id: 'usr_' + Date.now(),
        name: payload.email.split('@')[0],
        email: payload.email,
        role: 'CUSTOMER',
      }

      // Store accessToken in Cookies (not localStorage)
      if (token) {
        setCookie(ACCESS_TOKEN_COOKIE, token, 7)
      }

      // Store user data in localStorage (separate from token)
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.removeItem(TOKEN_KEY)
      }

      return {
        ...data,
        token: token || '',
        user,
        data: {
          ...data.data,
          user,
        },
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email verification failed'
      return rejectWithValue(message)
    }
  }
)

export const resendVerificationCode = createAsyncThunk<
  ResendVerificationResponse,
  string,
  { rejectValue: string }
>(
  'auth/resendVerificationCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await resendVerificationApi(email)
      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Resending verification code failed'
      return rejectWithValue(message)
    }
  }
)

export const forgotPasswordUser = createAsyncThunk<
  ForgotPasswordResponse,
  string,
  { rejectValue: string }
>(
  'auth/forgotPasswordUser',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordApi(email)
      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password recovery request failed'
      return rejectWithValue(message)
    }
  }
)

export const resetPasswordUser = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload,
  { rejectValue: string }
>(
  'auth/resetPasswordUser',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const data = await resetPasswordApi(payload)
      // When password is reset, sessions are invalidated
      deleteCookie(ACCESS_TOKEN_COOKIE)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem('user')
      }
      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed'
      return rejectWithValue(message)
    }
  }
)

export const refreshTokenThunk = createAsyncThunk<
  RefreshResponse,
  void,
  { rejectValue: string }
>(
  'auth/refreshTokenThunk',
  async (_, { rejectWithValue }) => {
    try {
      const data = await refreshTokenApi()
      const newToken = data.data?.accessToken
      if (newToken) {
        setCookie(ACCESS_TOKEN_COOKIE, newToken, 7)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
        }
      }
      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Token refresh failed'
      deleteCookie(ACCESS_TOKEN_COOKIE)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem('user')
      }
      return rejectWithValue(message)
    }
  }
)

export const logoutUser = createAsyncThunk<
  LogoutResponse | null,
  void,
  { rejectValue: string }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutApi()
      return data
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Logout error')
    } finally {
      deleteCookie(ACCESS_TOKEN_COOKIE)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      }
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
      deleteCookie(ACCESS_TOKEN_COOKIE)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setDemoUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.token = 'demo_jwt_token'
      state.isAuthenticated = true
      state.status = 'succeeded'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Authentication failed'
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Registration failed'
      })
      // Verify Email
      .addCase(verifyEmailUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(verifyEmailUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const token = action.payload.token || action.payload.data?.accessToken || null
        const user = action.payload.user || action.payload.data?.user || null
        if (token) {
          state.token = token
          state.isAuthenticated = true
        }
        if (user) {
          state.user = user
        }
        state.error = null
      })
      .addCase(verifyEmailUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Email verification failed'
      })
      // Resend Verification Code
      .addCase(resendVerificationCode.pending, (state) => {
        state.error = null
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Resending verification code failed'
      })
      // Forgot Password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Password recovery failed'
      })
      // Reset Password
      .addCase(resetPasswordUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Password reset failed'
      })
      // Refresh Token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        const token = action.payload.data?.accessToken
        if (token) {
          state.token = token
          state.isAuthenticated = true
        }
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.status = 'idle'
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.status = 'idle'
        state.error = null
      })
  },
})

export const { logout, clearError, setDemoUser } = authSlice.actions
export const authReducer = authSlice.reducer
export default authSlice.reducer

export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
