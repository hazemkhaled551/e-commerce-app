import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

export function AuthHeader() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <Logo size="md" />
       
        </div>

        <div className="flex items-center gap-space-md">
          <nav className="flex items-center gap-space-md">
            <Link
              to="/"
              className={`font-body-md text-body-md transition-colors ${
                pathname === '/'
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Return to Store
            </Link>
            <Link
              to="/login"
              className={`font-body-md text-body-md transition-colors ${
                pathname === '/login'
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`font-body-md text-body-md transition-colors ${
                pathname === '/register'
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Create Account
            </Link>
          </nav>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
