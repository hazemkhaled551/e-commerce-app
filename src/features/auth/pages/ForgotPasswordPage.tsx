import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  KeyRound,
  Mail,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Fingerprint,
  Headphones,
  CheckCircle2,
} from 'lucide-react'
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

  // Rate Limiting & Cooldown
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitSeconds, setRateLimitSeconds] = useState(898) // ~14m 58s

  // Resend Countdown
  const [resendCooldown, setResendCooldown] = useState(45)
  const [isResending, setIsResending] = useState(false)
  const [resendToast, setResendToast] = useState<string | null>(null)

  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const [currentEmail, setCurrentEmail] = useState(initialEmail || '')

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: initialEmail || '',
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
      await forgotPasswordApi(data.email)
      setSubmittedEmail(data.email)
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
      await resendPasswordResetApi(submittedEmail)
      setResendToast('A fresh reset link has been dispatched to your inbox.')
      setResendCooldown(45)
      setTimeout(() => setResendToast(null), 3500)
    } catch {
      setResendToast('Failed to resend link. Please try again.')
      setTimeout(() => setResendToast(null), 3500)
    } finally {
      setIsResending(false)
    }
  }

  const { ref: formRefRegister, ...emailFieldProps } = register('email', {
    required: 'Please enter a valid email address',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address (e.g. name@domain.com)',
    },
  })

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main recovery page container */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Main Recovery Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(36,51,49,0.05)] p-6 sm:p-8 relative overflow-hidden border border-outline-variant/60">
            {/* Subtle Teal Accent Glow */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            {/* STATE 1: RECOVERY FORM PANEL */}
            {!isSuccess && (
              <div className="flex flex-col text-left">
                {/* Visual Icon Header */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <KeyRound className="w-6 h-6" />
                </div>

                {/* Typography Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mb-2">
                  Forgot your password?
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Enter your email address and we&apos;ll send you a secure verification link to reset your account password.
                </p>

                {/* Rate Limit Alert Banner */}
                {isRateLimited && (
                  <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-on-surface flex items-start gap-2.5 animate-fade-in">
                    <Clock className="w-5 h-5 text-error shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-error">
                        Too Many Attempts
                      </span>
                      <span className="text-xs text-on-surface-variant mt-0.5">
                        Recovery requests are temporarily locked. Please retry in{' '}
                        <strong className="text-on-surface font-semibold">
                          {formatCooldown(rateLimitSeconds)}
                        </strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* Recovery Form */}
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-xs font-semibold text-on-surface"
                        htmlFor="recovery-email"
                      >
                        Email Address
                      </label>
                      <span className="text-[11px] text-on-surface-variant">
                        Personal or business
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
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
                        className={`w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline border transition-all focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-error bg-error/5 focus:ring-error/20'
                            : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                        } ${isSubmitting || isRateLimited ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />

                      {currentEmail && !isSubmitting && !isRateLimited && (
                        <button
                          className="absolute right-3 text-outline hover:text-on-surface p-1 transition-colors cursor-pointer"
                          onClick={handleClearEmail}
                          title="Clear input"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Error message container */}
                    {errors.email && (
                      <div className="flex items-center gap-1 text-xs text-error mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email.message}</span>
                      </div>
                    )}

                    {/* Hint helper */}
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] pt-1">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Single-use link valid for 60 minutes</span>
                    </div>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    className={`w-full h-11 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer mt-4 ${
                      isSubmitting || isRateLimited ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    type="submit"
                    disabled={isSubmitting || isRateLimited}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending reset link...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Privacy Notice */}
                <div className="mt-6 p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-on-surface-variant text-left">
                  <p className="text-xs leading-relaxed">
                    <strong className="text-on-surface font-semibold">Anti-Enumeration Guard:</strong> If an active Nexa account exists for this address, a reset notification is transmitted without revealing user existence.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 2: SUCCESS / LINK SENT PANEL */}
            {isSuccess && (
              <div className="flex flex-col items-center text-center animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10 mb-2">
                  Recovery Email Sent
                </span>

                <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-2">
                  Check your inbox
                </h2>

                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mb-4 leading-relaxed">
                  We&apos;ve sent a password reset token to:
                </p>

                {/* Masked Email Slot */}
                <div className="px-4 py-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 text-on-surface text-sm font-semibold flex items-center gap-2 mb-6">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{maskEmail(submittedEmail)}</span>
                </div>

                {/* Toast Alert for Resend */}
                {resendToast && (
                  <div className="mb-4 px-3 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resendToast}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-2.5 mb-6">
                  <a
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                    href={getEmailProviderUrl(submittedEmail)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Open Email Inbox</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    to={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                    className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-outline-variant/60"
                  >
                    <KeyRound className="w-4 h-4 text-primary" />
                    <span>Enter 6-Digit Code Manually</span>
                  </Link>

                  <button
                    className={`w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      resendCooldown > 0 || isResending
                        ? 'text-outline cursor-not-allowed opacity-60'
                        : 'text-primary hover:text-primary-hover cursor-pointer'
                    }`}
                    disabled={resendCooldown > 0 || isResending}
                    onClick={handleResend}
                    type="button"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {isResending
                        ? 'Sending fresh token...'
                        : resendCooldown > 0
                          ? `Resend link in ${resendCooldown}s`
                          : 'Resend Reset Link Now'}
                    </span>
                  </button>
                </div>

                {/* Change Email Option */}
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Entered the wrong email? Click here to change it
                </button>
              </div>
            )}

            {/* Card Footer Navigation Links */}
            <div className="mt-6 pt-4 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/50">
              <Link
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group cursor-pointer"
                to="/login"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Sign In</span>
              </Link>

              <Link
                className="hover:text-primary transition-colors cursor-pointer"
                to="/"
              >
                Help &amp; Support
              </Link>
            </div>
          </div>

          {/* Security & Trust Highlights Strip */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-left">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-on-surface">Zero-Knowledge</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Single-use cryptographic hashes valid for strictly 60 minutes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Fingerprint className="w-4 h-4" />
                <span className="text-xs font-bold text-on-surface">Anti-Hijack Guard</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Active sessions across devices invalidate upon password reset.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Headphones className="w-4 h-4" />
                <span className="text-xs font-bold text-on-surface">Concierge Desk</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Lost inbox access? Our team provides identity verification.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Footer */}
      <AuthFooter />
    </div>
  )
}
