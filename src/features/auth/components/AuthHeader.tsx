import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export function AuthHeader() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/60 shadow-[0_1px_8px_rgba(36,51,49,0.03)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>

            {pathname !== '/login' && (
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            )}

            {pathname !== '/register' && (
              <Link
                to="/register"
                className="hidden sm:inline-block px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-lg transition-colors"
              >
                Create Account
              </Link>
            )}
          </nav>

          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
