import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { FullPageLoader } from '@/components/feedback/PageLoader'

/**
 * AdminRoute Guard
 * Protects administrative routes by verifying:
 * 1. The user is actively authenticated.
 * 2. The user has the ADMIN role (case-insensitive check).
 *
 * If unauthenticated: Redirects to /login preserving the requested location.
 * If authenticated as non-admin (e.g. CUSTOMER): Redirects to storefront root (/).
 */
export function AdminRoute() {
  const { user, isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <FullPageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = String(user?.role || '').trim().toUpperCase()
  const isAdmin = role === 'ADMIN'

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

