import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
 import {
  loginUser,
  registerUser,
  logout,
  clearError,
  setDemoUser,
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
} from '../store/authSlice'
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth'

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
      throw new Error(resultAction.payload as string)
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
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
    logout: handleLogout,
    clearError: handleClearError,
    setDemoUser: handleSetDemoUser,
  }
}
