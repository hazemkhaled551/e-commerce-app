import { useState, useEffect, useRef } from 'react'
import type { FormEvent, KeyboardEvent, ClipboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Shield,
  KeyRound,
  Mail,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Lock,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'

export type VerificationViewMode = 'otp' | 'success' | 'expired'

export function VerifyPage() {
  const navigate = useNavigate()
  const { user, verifyEmail, resendVerification } = useAuth()
  const [searchParams] = useSearchParams()

  const emailFromUrl = searchParams.get('email')

  // Determine initial state from API / query parameters
  const initialStatus = searchParams.get('status') || searchParams.get('state')
  const [verificationView, setVerificationView] = useState<VerificationViewMode>(() => {
    if (initialStatus === 'expired' || initialStatus === 'invalid') return 'expired'
    if (initialStatus === 'success' || initialStatus === 'verified') return 'success'
    return 'otp'
  })

  // Target email dynamically resolved from registration or active session
  const targetEmail = emailFromUrl || user?.email || ''

  // OTP inputs (6 digits)
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP
  const [timeLeft, setTimeLeft] = useState(60)
  const isResendActive = timeLeft <= 0

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  // Toast trigger helper
  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }
    setToastMessage(message)
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Focus slot 0 on initial mount without calling setState inside effect
  useEffect(() => {
    if (verificationView === 'otp') {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [verificationView])

  // Format countdown mm:ss
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Expired'
    const s = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `00:${s}`
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, '')
    setOtpError(null)

    if (!digitsOnly) {
      const newOtp = [...otpValues]
      newOtp[index] = ''
      setOtpValues(newOtp)
      return
    }

    // If typed into an already-filled slot (e.g. length is 2)
    if (digitsOnly.length === 2 && otpValues[index]) {
      const nextChar = digitsOnly[digitsOnly.length - 1]
      const newOtp = [...otpValues]
      newOtp[index] = nextChar
      setOtpValues(newOtp)
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
      return
    }

    // If pasted or multi-char input
    if (digitsOnly.length > 1) {
      const newOtp = [...otpValues]
      const chars = digitsOnly.slice(0, 6).split('')
      let lastFilled = index
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char
          lastFilled = index + i
        }
      })
      setOtpValues(newOtp)
      const nextFocus = Math.min(lastFilled + 1, 5)
      inputRefs.current[nextFocus]?.focus()
      return
    }

    // Single digit entered
    const newOtp = [...otpValues]
    newOtp[index] = digitsOnly
    setOtpValues(newOtp)

    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace and keyboard navigation
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        e.preventDefault()
        const newOtp = [...otpValues]
        newOtp[index - 1] = ''
        setOtpValues(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle clipboard paste
  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData) {
      const newOtp = [...otpValues]
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char
      })
      setOtpValues(newOtp)
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
      showToast('Auto-filled security PIN from clipboard')
    }
  }

  // Submit OTP form
  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const enteredCode = otpValues.join('').trim()
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of your security PIN.')
      return
    }

    if (!targetEmail) {
      setOtpError('Please provide a valid email address first.')
      return
    }

    try {
      setIsVerifying(true)
      setOtpError(null)
      await verifyEmail({ email: targetEmail, otp: enteredCode })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired verification code'
      setOtpError(msg)
      showToast(msg)
    } finally {
      setIsVerifying(false)
    }
  }

  // Resend OTP email handler
  const handleResendOtp = async () => {
    if (!isResendActive || isResending) return
    if (!targetEmail) {
      showToast('Please specify an email address first.')
      return
    }

    try {
      setIsResending(true)
      const res = await resendVerification(targetEmail)
      setTimeLeft(60)
      showToast(res.message || `Fresh verification code sent to ${targetEmail}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend verification code'
      showToast(msg)
    } finally {
      setIsResending(false)
    }
  }

  // Mask email for display
  const getMaskedEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr
    const [name, domain] = emailStr.split('@')
    if (name.length <= 3) return `${name}***@${domain}`
    return `${name.slice(0, 4)}***@${domain}`
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Content Stage */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-xl mx-auto space-y-6">
          {/* Top Context Header */}
          <div className="w-full flex flex-col items-center text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Two-Factor Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Account Verification
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              Confirm your identity to finalize activation and safeguard your orders.
            </p>
          </div>

          {/* Verification Main Stage */}
          <div className="w-full flex flex-col space-y-6">
            {/* STATE 1: OTP Input Module (Default & Interactive) */}
            {verificationView === 'otp' && (
              <section className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(36,51,49,0.05)] border border-outline-variant/60 text-left animate-fade-in">
                {/* Card Header with Identity Chip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3 border-b border-outline-variant/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                        Step 2 of 2 • Activation
                      </span>
                      <h2 className="text-lg font-bold text-on-surface">
                        Enter 6-Digit PIN
                      </h2>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Awaiting Input</span>
                  </div>
                </div>

                {/* Target Destination Alert / Banner */}
                <div className="mt-4 p-3.5 bg-surface-container-low/70 rounded-xl flex items-center gap-3 border border-outline-variant/50 text-on-surface">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm text-on-surface-variant">
                    Code dispatched to{' '}
                    <strong className="text-on-surface font-semibold">
                      {getMaskedEmail(targetEmail)}
                    </strong>
                  </span>
                </div>

                {/* Code Input Form */}
                <form className="mt-6 space-y-6" onSubmit={handleOtpSubmit}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="otp-input-0"
                        className="text-xs font-semibold text-on-surface"
                      >
                        Verification PIN
                      </label>
                      <span className="text-[11px] text-on-surface-variant">
                        Paste 6 digits anywhere
                      </span>
                    </div>

                    {/* 6 PIN inputs */}
                    <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto py-2">
                      {otpValues.map((val, idx) => {
                        const isFocused = focusedIndex === idx
                        const isFilled = Boolean(val)
                        return (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            ref={(el) => {
                              inputRefs.current[idx] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]*"
                            maxLength={2}
                            value={val}
                            onFocus={(e) => {
                              setFocusedIndex(idx)
                              e.target.select()
                            }}
                            onBlur={() => {
                              setFocusedIndex(-1)
                            }}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={handleOtpPaste}
                            className={`w-full aspect-square text-center font-mono text-xl sm:text-2xl font-bold text-on-surface rounded-xl transition-all outline-none ${
                              isFocused
                                ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-xs'
                                : isFilled
                                  ? 'bg-surface-container-lowest border-primary/50 text-primary'
                                  : 'bg-surface-container-low/60 border border-outline-variant/70 hover:border-outline-variant'
                            }`}
                          />
                        )
                      })}
                    </div>

                    {/* Dynamic validation note */}
                    <p
                      className={`text-center text-xs ${
                        otpError ? 'text-error font-medium' : 'text-on-surface-variant'
                      }`}
                    >
                      {otpError || 'Numeric digits only. Use Tab or Backspace to navigate.'}
                    </p>
                  </div>

                  {/* Countdown and Dispatch triggers */}
                  <div className="bg-surface-container-low/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-outline-variant/50">
                    <div className="flex items-center gap-2.5 text-on-surface">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] text-on-surface-variant">Active token lifespan</p>
                        <p className="text-xs font-semibold text-on-surface">
                          Resend in{' '}
                          <span className="text-primary font-mono font-bold">
                            {formatTime(timeLeft)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        disabled={!isResendActive || isResending}
                        onClick={handleResendOtp}
                        className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isResendActive && !isResending
                            ? 'text-primary hover:text-primary-hover cursor-pointer'
                            : 'text-outline cursor-not-allowed opacity-60'
                        }`}
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`}
                        />
                        <span>{isResending ? 'Sending...' : 'Resend PIN'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className={`w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isVerifying ? 'opacity-70 cursor-wait' : ''
                    }`}
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Security PIN...</span>
                      </div>
                    ) : (
                      <>
                        <span>Verify &amp; Activate Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer security strip inside card */}
                <div className="mt-6 pt-4 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/50">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span>Hardware-backed TLS Session</span>
                  </span>
                  <span>Strict SSL Enforced</span>
                </div>
              </section>
            )}

            {/* STATE 2: Verified Success State Card */}
            {verificationView === 'success' && (
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(36,51,49,0.05)] border border-outline-variant/60 text-left animate-fade-in">
                <div className="max-w-md mx-auto text-center flex flex-col items-center space-y-4 py-4">
                  {/* Success Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Identity Confirmed
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                      Email Address Verified!
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                      Your account is fully activated. You now enjoy member privileges, faster checkout, and parcel tracking.
                    </p>
                  </div>

                  {/* Tier Perks Bento */}
                  <div className="w-full grid grid-cols-2 gap-3 p-4 bg-surface-container-low/60 rounded-xl text-left border border-outline-variant/50">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-on-surface">Complimentary Shipping</p>
                        <p className="text-[11px] text-on-surface-variant">Applied automatically</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-on-surface">100 Welcome Points</p>
                        <p className="text-[11px] text-on-surface-variant">Ready for checkout</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-2 flex flex-col gap-2.5">
                    <Link
                      to="/"
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold shadow-xs text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Continue to Store</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: Expired / Invalid State Card */}
            {verificationView === 'expired' && (
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(36,51,49,0.05)] border border-outline-variant/60 text-left animate-fade-in">
                <div className="max-w-md mx-auto text-center flex flex-col items-center space-y-4 py-4">
                  {/* Alert Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      Token Stale
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                      Verification Link Expired
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                      For your security, verification links expire after 24 hours. Request a fresh code below to activate your account.
                    </p>
                  </div>

                  <div className="w-full pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={async () => {
                        if (!targetEmail) {
                          setVerificationView('otp')
                          return
                        }
                        try {
                          setIsResending(true)
                          const res = await resendVerification(targetEmail)
                          showToast(res.message || 'Fresh PIN dispatched to mailbox.')
                          setTimeLeft(60)
                          setVerificationView('otp')
                        } catch (err: unknown) {
                          const msg =
                            err instanceof Error ? err.message : 'Failed to request new code'
                          showToast(msg)
                        } finally {
                          setIsResending(false)
                        }
                      }}
                      className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Sending...' : 'Request Fresh Code'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationView('otp')}
                      className="flex-1 h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Enter Code Manually</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assistance Notice */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Didn&apos;t receive a code?</p>
                  <p className="text-[11px] text-on-surface-variant">Check your spam folder or contact customer support.</p>
                </div>
              </div>
              <a
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors whitespace-nowrap"
                href="mailto:support@nexastore.com"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reusable Auth Footer */}
      <AuthFooter />
    </div>
  )
}
