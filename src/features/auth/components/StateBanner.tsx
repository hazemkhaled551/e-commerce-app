import { AlertCircle, Mail, ShieldAlert, Clock, X } from 'lucide-react'
import type { AuthPreviewState } from '../types/auth'

export interface StateBannerProps {
  state: AuthPreviewState
  title?: string
  message?: string
  onClose?: () => void
  onResendVerification?: () => void
}

export function StateBanner({
  state,
  title,
  message,
  onClose,
  onResendVerification,
}: StateBannerProps) {
  if (state === 'default') return null

  if (state === 'validation_error') {
    return (
      <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-on-surface flex items-start justify-between gap-3 shadow-xs animate-fade-in">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-error">
              {title || 'Sign In Failed'}
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5">
              {message || 'Invalid email format or password combination missing.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  if (state === 'unverified') {
    return (
      <div className="mb-4 p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-on-surface flex items-start justify-between gap-3 shadow-xs animate-fade-in">
        <div className="flex items-start gap-2.5 text-left">
          <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface">
              {title || 'Verify your email address'}
            </span>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {message || 'We sent an activation link to your inbox.'}
              {onResendVerification && (
                <button
                  type="button"
                  onClick={onResendVerification}
                  className="text-primary font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Resend email →
                </button>
              )}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  if (state === 'rate_limited') {
    return (
      <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-on-surface flex items-start justify-between gap-3 shadow-xs animate-fade-in">
        <div className="flex items-start gap-2.5 text-left">
          <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-error">
              {title || 'Security Lock Activated'}
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5">
              {message ||
                'Too many failed login attempts from this network. Account temporarily locked for 15 minutes.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  if (state === 'expired') {
    return (
      <div className="mb-4 p-3.5 rounded-xl bg-surface-container-high border border-outline-variant/60 text-on-surface flex items-start justify-between gap-3 shadow-xs animate-fade-in">
        <div className="flex items-start gap-2.5 text-left">
          <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface">
              {title || 'Session Expired'}
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5">
              {message ||
                'Your shopping session expired after inactivity. Please sign in again.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  return null
}
