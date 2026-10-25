import { Link, useLocation } from 'react-router-dom'

export function AuthHeader() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <Link to="/" className="flex items-center gap-space-xs group">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              Nexa<span className="text-on-surface font-normal">Store</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
              256-Bit SSL Encrypted
            </span>
          </div>
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
