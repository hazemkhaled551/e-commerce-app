import { Link } from 'react-router-dom'

export function AuthFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-auto">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 Nexa Store Inc. All transactions end-to-end encrypted.
          </span>
        </div>
        <div className="flex items-center gap-space-lg">
          <nav className="flex flex-wrap items-center gap-space-lg">
            <Link
              to="/"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="terms-of-service"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="security-center"
            >
              Security Center
            </Link>
            <Link
              to="/"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="customer-support"
            >
              Need Help?
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
