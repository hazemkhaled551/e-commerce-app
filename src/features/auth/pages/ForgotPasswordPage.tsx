import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { forgotPasswordApi, resendPasswordResetApi } from '../api/authApi'

interface ForgotPasswordFormData {
  email: string
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 's***@example.com'
  const [name, domain] = email.split('@')
  const maskedName = name.length > 3 ? name.substring(0, 3) + '***' : name + '***'
  return `${maskedName}@${domain}`
}

function getEmailProviderUrl(email: string): string {
  if (!email || !email.includes('@')) return 'https://mail.google.com'
  const domain = email.split('@')[1].toLowerCase()
  if (domain.includes('gmail')) return 'https://mail.google.com'
  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) {
    return 'https://outlook.live.com'
  }
  if (domain.includes('yahoo')) return 'https://mail.yahoo.com'
  if (domain.includes('icloud')) return 'https://www.icloud.com/mail'
  return `https://${domain}`
}

export function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get('email') || ''

  // Flow State: 'form' | 'success'
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState(initialEmail)
  const [authRef, setAuthRef] = useState('Auth Ref: NX-8891')

  // Rate Limiting & Cooldown
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitSeconds, setRateLimitSeconds] = useState(898) // ~14m 58s

  // Resend Countdown
  const [resendCooldown, setResendCooldown] = useState(45)
  const [isResending, setIsResending] = useState(false)
  const [resendToast, setResendToast] = useState<string | null>(null)

  const emailInputRef = useRef<HTMLInputElement | null>(null)

  const [currentEmail, setCurrentEmail] = useState(initialEmail || 'sarah.jenkins@workmail.io')

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: initialEmail || 'sarah.jenkins@workmail.io',
    },
    mode: 'onTouched',
  })

  // Rate Limit Countdown Timer
  useEffect(() => {
    if (!isRateLimited || rateLimitSeconds <= 0) return
    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isRateLimited, rateLimitSeconds])

  // Resend Button Countdown Timer
  useEffect(() => {
    if (!isSuccess || resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isSuccess, resendCooldown])

  // Format seconds to mm:ss
  const formatCooldown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`
  }

  // Clear Input Action
  const handleClearEmail = () => {
    setCurrentEmail('')
    setValue('email', '', { shouldValidate: false })
    clearErrors('email')
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }

  // Handle Form Submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isRateLimited) return

    try {
      clearErrors('email')
      const response = await forgotPasswordApi(data.email)
      setSubmittedEmail(data.email)
      if (response.resetTokenId) {
        setAuthRef(`Auth Ref: ${response.resetTokenId}`)
      }
      setIsSuccess(true)
      setResendCooldown(45)
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string }
      if (errorObj?.status === 429 || errorObj?.message?.toLowerCase().includes('rate')) {
        setIsRateLimited(true)
        setRateLimitSeconds(898)
      } else {
        setError('email', {
          type: 'manual',
          message: errorObj?.message || 'Please enter a valid, complete email address (e.g. name@domain.com)',
        })
      }
    }
  }

  // Handle Resend Trigger
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return

    setIsResending(true)
    try {
      const response = await resendPasswordResetApi(submittedEmail)
      setAuthRef(`Auth Ref: ${response.resetTokenId}`)
      setResendToast('A fresh reset token has been dispatched to your inbox.')
      setResendCooldown(45)
      setTimeout(() => setResendToast(null), 3500)
    } catch {
      setResendToast('Failed to resend token. Please try again.')
      setTimeout(() => setResendToast(null), 3500)
    } finally {
      setIsResending(false)
    }
  }

  const { ref: formRefRegister, ...emailFieldProps } = register('email', {
    required: 'Please enter a valid, complete email address',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid, complete email address (e.g. name@domain.com)',
    },
  })

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main recovery page container */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 bg-background flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin items-center">
          {/* Top Breadcrumb & Metadata */}
          <div className="w-full max-w-xl flex items-center justify-between mb-space-lg text-on-surface-variant">
            <div className="flex items-center gap-space-xs font-label-caps text-label-caps uppercase tracking-wider">
              <span>Account Access</span>
              <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
              <span className="text-primary font-semibold">Credential Recovery</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Live Verification</span>
            </div>
          </div>

          {/* Main Recovery Card Wrapper */}
          <div className="w-full max-w-xl flex flex-col items-center">
            {/* Elevated Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-2px_rgba(19,27,46,0.06),0_1px_3px_0_rgba(19,27,46,0.04)] p-space-lg sm:p-space-xl relative overflow-hidden transition-all duration-300">
              {/* Top Subtle Security Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

              {/* STATE 1: RECOVERY FORM PANEL */}
              {!isSuccess && (
                <div className="flex flex-col" id="state-form-panel">
                  {/* Visual Icon Header */}
                  <div className="flex items-center justify-between mb-space-lg">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm shadow-primary/10">
                      <span className="material-symbols-outlined text-[26px]">lock_reset</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                      {authRef}
                    </span>
                  </div>

                  {/* Typography Heading */}
                  <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mb-space-xs text-left">
                    Forgot your password?
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg text-left">
                    Enter the email address associated with your Nexa Store account and we&apos;ll send you a secure link to reset your credentials.
                  </p>

                  {/* Rate Limit Alert Banner (Displayed when rate-limited) */}
                  {isRateLimited && (
                    <div
                      className="mb-space-md p-space-md rounded-lg bg-surface-container-high text-on-surface flex items-start gap-space-sm shadow-sm transition-all duration-200"
                      id="rate-limit-banner"
                    >
                      <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5">
                        timer_off
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-headline-sm text-headline-sm text-sm font-semibold">
                          Too Many Attempts
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          For security reasons, recovery requests are temporarily locked. Please retry in{' '}
                          <strong className="text-on-surface font-semibold" id="cooldown-timer">
                            {formatCooldown(rateLimitSeconds)}
                          </strong>{' '}
                          or verify your phone via SMS.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Recovery Form */}
                  <form
                    className="flex flex-col gap-space-md"
                    id="recovery-form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <label
                          className="font-body-md text-body-md font-semibold text-on-surface"
                          htmlFor="recovery-email"
                        >
                          Email Address
                        </label>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                          Required
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <span
                          className={`material-symbols-outlined absolute left-3 text-[20px] pointer-events-none transition-colors ${
                            errors.email ? 'text-error' : 'text-on-surface-variant'
                          }`}
                          id="email-icon"
                        >
                          mail
                        </span>
                        <input
                          id="recovery-email"
                          type="email"
                          autoComplete="email"
                          placeholder="name@example.com"
                          disabled={isSubmitting || isRateLimited}
                          ref={(el) => {
                            formRefRegister(el)
                            emailInputRef.current = el
                          }}
                          {...emailFieldProps}
                          onChange={(e) => {
                            setCurrentEmail(e.target.value)
                            emailFieldProps.onChange(e)
                          }}
                          className={`w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:outline-none focus:ring-2 shadow-sm transition-all ${
                            errors.email
                              ? 'border border-error text-error focus:ring-error bg-error-container/10'
                              : 'border border-outline-variant/40 focus:ring-primary'
                          } ${isSubmitting || isRateLimited ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />

                        {currentEmail && !isSubmitting && !isRateLimited && (
                          <button
                            className="absolute right-3 text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
                            onClick={handleClearEmail}
                            title="Clear input"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        )}
                      </div>

                      {/* Error message container */}
                      {errors.email && (
                        <div className="flex items-center gap-1.5 mt-1 text-error" id="email-error-msg">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span className="font-body-sm text-body-sm font-medium">
                            {errors.email.message}
                          </span>
                        </div>
                      )}

                      {/* Hint helper */}
                      <div className="flex items-center gap-1.5 text-on-surface-variant mt-0.5" id="email-hint">
                        <span className="material-symbols-outlined text-[15px] opacity-70">schedule</span>
                        <span className="font-body-sm text-body-sm">
                          Link expires after 60 minutes for security
                        </span>
                      </div>
                    </div>

                    {/* Primary Submit Button */}
                    <button
                      className={`w-full h-11 rounded-lg bg-primary hover:bg-secondary active:scale-[0.99] text-on-primary font-headline-sm text-headline-sm text-sm font-semibold flex items-center justify-center gap-space-xs shadow-md shadow-primary/25 transition-all duration-150 ${
                        isSubmitting || isRateLimited
                          ? 'opacity-80 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      id="submit-btn"
                      type="submit"
                      disabled={isSubmitting || isRateLimited}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2" id="btn-spinner">
                          <svg
                            className="animate-spin h-4 w-4 text-on-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <span>Verifying and Dispatching...</span>
                        </span>
                      ) : (
                        <>
                          <span id="btn-text">Send Reset Link</span>
                          <span className="material-symbols-outlined text-[18px]" id="btn-icon">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Privacy & Anti-Enumeration Notice */}
                  <div className="mt-space-lg p-space-md rounded-lg bg-surface-container-low flex items-start gap-space-sm text-on-surface-variant text-left">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                      privacy_tip
                    </span>
                    <p className="font-body-sm text-body-sm leading-relaxed">
                      <strong className="font-semibold text-on-surface">Data Privacy &amp; Anti-Enumeration:</strong> If
                      an active Nexa Store account matches the provided address, an automated recovery email
                      will be generated without disclosing user existence.
                    </p>
                  </div>
                </div>
              )}

              {/* STATE 2: SUCCESS / LINK SENT PANEL */}
              {isSuccess && (
                <div
                  className="flex flex-col items-center text-center animate-fadeIn"
                  id="state-success-panel"
                >
                  <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-space-md shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
                  </div>

                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold px-3 py-1 rounded-full bg-primary-fixed mb-space-xs">
                    Recovery Email Dispatched
                  </span>

                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mb-space-xs">
                    Check your inbox
                  </h2>

                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-space-md">
                    We&apos;ve sent a one-time credential reset link to:
                  </p>

                  {/* Masked Email Display Card */}
                  <div className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface font-headline-sm text-headline-sm text-sm font-semibold flex items-center gap-2 mb-space-lg shadow-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary">alternate_email</span>
                    <span id="masked-email-slot">{maskEmail(submittedEmail)}</span>
                  </div>

                  {/* Toast Alert for Resend */}
                  {resendToast && (
                    <div className="mb-space-md px-space-md py-2 bg-primary-fixed text-primary font-body-sm text-body-sm rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">info</span>
                      <span>{resendToast}</span>
                    </div>
                  )}

                  {/* Action Grid */}
                  <div className="w-full flex flex-col gap-space-sm mb-space-lg">
                    <a
                      className="w-full h-11 rounded-lg bg-primary hover:bg-secondary text-on-primary font-headline-sm text-headline-sm text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-colors"
                      href={getEmailProviderUrl(submittedEmail)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Open Email Provider</span>
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>

                    <Link
                      to={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                      className="w-full h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-headline-sm text-headline-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Enter 6-Digit Code &amp; Reset Password</span>
                      <span className="material-symbols-outlined text-[18px]">key</span>
                    </Link>

                    <button
                      className={`w-full h-11 rounded-lg bg-surface-container-low text-on-surface-variant font-headline-sm text-headline-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                        resendCooldown > 0 || isResending
                          ? 'opacity-75 cursor-not-allowed'
                          : 'hover:bg-surface-container text-primary cursor-pointer'
                      }`}
                      disabled={resendCooldown > 0 || isResending}
                      id="resend-btn"
                      onClick={handleResend}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      <span id="resend-label">
                        {isResending
                          ? 'Sending fresh token...'
                          : resendCooldown > 0
                          ? `Resend email in ${resendCooldown}s`
                          : 'Resend Reset Link Now'}
                      </span>
                    </button>
                  </div>

                  {/* Edit Email option & Help notice */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="text-primary hover:underline font-body-sm text-body-sm font-medium cursor-pointer"
                    >
                      Entered the wrong email? Click here to change it
                    </button>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Didn&apos;t receive it? Check your spam folder or verify with our{' '}
                      <Link to="/" className="text-primary font-semibold hover:underline">
                        Security Concierge
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* Card Footer Navigation Links */}
              <div className="mt-space-lg pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant bg-surface-container-lowest border-t border-outline-variant/20">
                <Link
                  className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors group cursor-pointer"
                  to="/login"
                >
                  <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
                    arrow_back
                  </span>
                  <span>
                    Remember password? <strong className="text-primary font-semibold">Sign in</strong>
                  </span>
                </Link>

                <Link
                  className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  to="/"
                >
                  <span className="material-symbols-outlined text-[16px] text-tertiary">support_agent</span>
                  <span>Concierge Support</span>
                </Link>
              </div>
            </div>

            {/* Security & Trust Highlights Strip */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg text-left">
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(19,27,46,0.03)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                  <span className="font-headline-sm text-headline-sm text-xs font-semibold text-on-surface">
                    Zero-Knowledge Token
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  256-bit single-use cryptographic hashes valid for strictly 60 minutes.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(19,27,46,0.03)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                  <span className="font-headline-sm text-headline-sm text-xs font-semibold text-on-surface">
                    Anti-Hijack Guard
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Active sessions across all mobile and web devices invalidate immediately upon credential
                  update.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(19,27,46,0.03)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[20px]">headset_mic</span>
                  <span className="font-headline-sm text-headline-sm text-xs font-semibold text-on-surface">
                    24/7 Identity Desk
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Lost email mailbox access? Reach verified store officers directly via priority hotline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Footer */}
      <AuthFooter />
    </div>
  )
}
