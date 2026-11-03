import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export function AuthFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest/80 border-t border-outline-variant/60 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>© 2026 NexaStore Inc. All authentication sessions are 256-bit encrypted.</span>
        </div>

        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="/" className="hover:text-primary transition-colors">
            Security Overview
          </Link>
          <Link to="/" className="hover:text-primary transition-colors">
            Help Center
          </Link>
        </nav>
      </div>
    </footer>
  )
}
