import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth'
import { loginApi, registerApi } from '../api/authApi'

const TOKEN_KEY = 'nexa_auth_token'
const USER_KEY = 'nexa_auth_user'

const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
const savedUser =
  typeof window !== 'undefined' && localStorage.getItem(USER_KEY)
    ? (JSON.parse(localStorage.getItem(USER_KEY) || 'null') as User | null)
    : null

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken && savedUser),
  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials)
      if (credentials.remember && typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const data = await registerApi(credentials)
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      return rejectWithValue(message)
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Registration failed'
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
