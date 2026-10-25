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
      <div className="mb-space-md p-space-md rounded-lg bg-error-container text-on-error-container flex items-start justify-between shadow-sm animate-fade-in">
        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
          <div className="flex flex-col text-left">
            <span className="font-body-md text-body-md font-semibold">
              {title || 'Sign In Failed'}
            </span>
            <span className="font-body-sm text-body-sm">
              {message || 'Invalid email format or required password credentials missing.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-error-container hover:opacity-75 cursor-pointer"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    )
  }

  if (state === 'unverified') {
    return (
      <div className="mb-space-md p-space-md rounded-lg bg-surface-container-high text-on-surface flex items-start justify-between shadow-sm animate-fade-in">
        <div className="flex items-start gap-space-sm text-left">
          <span className="material-symbols-outlined text-tertiary-container text-[20px] mt-0.5">
            mark_email_unread
          </span>
          <div className="flex flex-col">
            <span className="font-body-md text-body-md font-semibold">
              {title || 'Verify your email address'}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {message || 'We sent an authentication token to your inbox.'}
              <button
                type="button"
                onClick={onResendVerification}
                className="text-primary-container font-semibold hover:underline ml-1 cursor-pointer"
              >
                Resend email →
              </button>
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    )
  }

  if (state === 'rate_limited') {
    return (
      <div className="mb-space-md p-space-md rounded-lg bg-error-container text-on-error-container flex items-start justify-between shadow-sm animate-fade-in">
        <div className="flex items-start gap-space-sm text-left">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5">lock_clock</span>
          <div className="flex flex-col">
            <span className="font-body-md text-body-md font-semibold">
              {title || 'Security Lock Activated'}
            </span>
            <span className="font-body-sm text-body-sm">
              {message ||
                'Too many failed login attempts from this network. Account locked for 15 minutes.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-error-container hover:opacity-75 cursor-pointer"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    )
  }

  if (state === 'expired') {
    return (
      <div className="mb-space-md p-space-md rounded-lg bg-surface-container-highest text-on-surface flex items-start justify-between shadow-sm animate-fade-in">
        <div className="flex items-start gap-space-sm text-left">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">timer_off</span>
          <div className="flex flex-col">
            <span className="font-body-md text-body-md font-semibold">
              {title || 'Session Expired'}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {message ||
                'Your shopping session expired after 20 minutes of inactivity. Please sign in again.'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    )
  }

  return null
}
