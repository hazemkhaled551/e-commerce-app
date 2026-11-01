import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  loginUser,
  registerUser,
  verifyEmailUser,
  resendVerificationCode,
  forgotPasswordUser,
  resetPasswordUser,
  refreshTokenThunk,
  logoutUser,
  clearError,
  setDemoUser,
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
} from '../store/authSlice'
import type {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '../types/auth'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const resultAction = await dispatch(loginUser(credentials))
      if (loginUser.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error(resultAction.payload as string)
    },
    [dispatch]
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const resultAction = await dispatch(registerUser(credentials))
      if (registerUser.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error((resultAction.payload as string) || 'Registration failed')
    },
    [dispatch]
  )

  const verifyEmail = useCallback(
    async (payload: VerifyEmailPayload) => {
      const resultAction = await dispatch(verifyEmailUser(payload))
      if (verifyEmailUser.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error((resultAction.payload as string) || 'Verification failed')
    },
    [dispatch]
  )

  const resendVerification = useCallback(
    async (email: string) => {
      const resultAction = await dispatch(resendVerificationCode(email))
      if (resendVerificationCode.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error((resultAction.payload as string) || 'Resending verification failed')
    },
    [dispatch]
  )

  const forgotPassword = useCallback(
    async (email: string) => {
      const resultAction = await dispatch(forgotPasswordUser(email))
      if (forgotPasswordUser.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error((resultAction.payload as string) || 'Password recovery failed')
    },
    [dispatch]
  )

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload) => {
      const resultAction = await dispatch(resetPasswordUser(payload))
      if (resetPasswordUser.fulfilled.match(resultAction)) {
        return resultAction.payload
      }
      throw new Error((resultAction.payload as string) || 'Password reset failed')
    },
    [dispatch]
  )

  const refreshToken = useCallback(async () => {
    const resultAction = await dispatch(refreshTokenThunk())
    if (refreshTokenThunk.fulfilled.match(resultAction)) {
      return resultAction.payload
    }
    throw new Error((resultAction.payload as string) || 'Refresh failed')
  }, [dispatch])

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSetDemoUser = useCallback(
    (demoUser: User) => {
      dispatch(setDemoUser(demoUser))
    },
    [dispatch]
  )

  return {
    user,
    isAuthenticated,
    status,
    error,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout: handleLogout,
    clearError: handleClearError,
    setDemoUser: handleSetDemoUser,
  }
}
