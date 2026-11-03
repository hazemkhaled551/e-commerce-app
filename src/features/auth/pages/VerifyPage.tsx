import { useState, useEffect, useRef } from 'react'
import type { FormEvent, KeyboardEvent, ClipboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'

export type VerificationViewMode = 'otp' | 'success' | 'expired'

export function VerifyPage() {
  const navigate = useNavigate()
  const { user, verifyEmail, resendVerification } = useAuth()
  const [searchParams] = useSearchParams()

  const emailFromUrl = searchParams.get('email')

  // Determine initial state from API / query parameters (e.g. /verify?status=expired or /verify?status=verified)
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
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
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

  // Focus slot 0 (or first empty slot) on initial mount
  useEffect(() => {
    if (verificationView === 'otp') {
      const firstEmptyIndex = otpValues.findIndex((val) => !val)
      const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex
      setFocusedIndex(targetIndex)
      const timer = setTimeout(() => {
        inputRefs.current[targetIndex]?.focus()
      }, 50)
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
        setFocusedIndex(index + 1)
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
      setFocusedIndex(nextFocus)
      return
    }

    // Single digit entered
    const newOtp = [...otpValues]
    newOtp[index] = digitsOnly
    setOtpValues(newOtp)

    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
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
        setFocusedIndex(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
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
      setFocusedIndex(nextIndex)
      showToast('Auto-filled security code from clipboard!')
    }
  }

  // Submit OTP form (calls verifyEmail endpoint)
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

  // Resend OTP email handler (calls resendVerification endpoint)
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
    return `${name.slice(0, 5)}***@${domain}`
  }

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Content Stage */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col w-full max-w-2xl mx-auto space-y-space-lg">
          {/* Top Context Header */}
          <div className="w-full flex flex-col items-center text-center space-y-space-xs mt-4">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>TWO-FACTOR AUTHENTICATION SYSTEM</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Identity &amp; Verification Center
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Manage your account activation and review credential authorization status in real time.
            </p>
          </div>

          {/* Verification Main Stage */}
          <div className="w-full flex flex-col space-y-space-lg">
              {/* STATE 1: OTP Input Module (Default & Interactive) */}
              {verificationView === 'otp' && (
                <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all text-left animate-fade-in">
                  {/* Card Header with Identity Chip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-lg gap-space-sm">
                    <div className="flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[26px]">key</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Step 2 of 2 • Secure Verification
                        </span>
                        <h2 className="font-headline-md text-headline-md text-on-surface">
                          Enter One-Time Passcode
                        </h2>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-stock-in animate-pulse" />
                      <span>Awaiting Input</span>
                    </div>
                  </div>

                  {/* Target Destination Alert / Banner */}
                  <div className="mt-space-sm p-space-md bg-surface-container-low rounded-lg flex items-center gap-space-sm border border-outline-variant/20 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      alternate_email
                    </span>
                    <span className="font-body-md text-body-md">
                      Code dispatched to{' '}
                      <strong className="text-on-surface font-semibold font-body-md text-body-md">
                        {getMaskedEmail(targetEmail)}
                      </strong>
                    </span>
                  </div>

                  {/* Code Input Form */}
                  <form className="mt-space-xl space-y-space-lg" onSubmit={handleOtpSubmit}>
                    <div className="space-y-space-sm">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="otp-input-0"
                          className="font-headline-sm text-headline-sm text-on-surface"
                        >
                          Authentication PIN
                        </label>
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            content_paste
                          </span>
                          <span className="font-label-caps text-label-caps">
                            Clipboard Auto-Detect Ready
                          </span>
                        </div>
                      </div>

                      {/* 6 PIN inputs */}
                      <div className="grid grid-cols-6 gap-space-xs sm:gap-space-sm md:gap-space-md max-w-xl mx-auto py-space-sm">
                        {otpValues.map((val, idx) => {
                          const isFocused = focusedIndex === idx
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
                                if (focusedIndex === idx) setFocusedIndex(-1)
                              }}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              className={`otp-box w-full aspect-square text-center font-price-lg text-price-lg text-on-surface rounded-lg transition-all outline-none ${
                                isFocused
                                  ? 'bg-surface-container-lowest ring-2 ring-primary border-transparent shadow-xs'
                                  : 'bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary'
                              }`}
                            />
                          )
                        })}
                      </div>

                      {/* Dynamic validation note */}
                      <p
                        className={`text-center font-body-sm text-body-sm ${otpError ? 'text-error font-medium' : 'text-on-surface-variant'
                          }`}
                      >
                        {otpError || 'Numeric input only. Press Tab or backspace to navigate.'}
                      </p>
                    </div>

                    {/* Countdown and Dispatch triggers */}
                    <div className="bg-surface-container-low/60 rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/20">
                      <div className="flex items-center gap-space-sm text-on-surface">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">timer</span>
                        </div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Time remaining on active token
                          </p>
                          <p className="font-headline-sm text-body-md text-on-surface flex items-center gap-1.5">
                            Resend code in{' '}
                            <span className="font-price-md text-price-md text-primary">
                              {formatTime(timeLeft)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={!isResendActive || isResending}
                          onClick={handleResendOtp}
                          className={`font-headline-sm text-body-sm flex items-center gap-1 transition-colors ${
                            isResendActive && !isResending
                              ? 'text-primary hover:text-secondary cursor-pointer'
                              : 'text-on-surface-variant opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              isResending ? 'animate-spin' : ''
                            }`}
                          >
                            refresh
                          </span>
                          <span>{isResending ? 'Transmitting...' : 'Resend OTP via Email'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Action Button */}
                    <div className="pt-space-sm">
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className={`w-full py-3.5 px-space-lg rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-headline-sm text-headline-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm cursor-pointer ${
                          isVerifying ? 'opacity-80 cursor-wait' : ''
                        }`}
                      >
                        {isVerifying ? (
                          <>
                            <span>Verifying Security Code...</span>
                            <span className="material-symbols-outlined animate-spin text-[20px]">
                              progress_activity
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">verified</span>
                            <span>Verify &amp; Activate Account</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Guarantee footer bar inside card */}
                  <div className="mt-space-lg pt-space-md flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-container">
                        lock
                      </span>
                      Hardware-backed TLS Session
                    </span>
                    <span className="text-on-surface-variant">Session ID: NX-904-7489A</span>
                  </div>
                </section>
              )}

              {/* STATE 2: Verified Success State Card */}
              {verificationView === 'success' && (
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all animate-fade-in text-left">
                  <div className="max-w-md mx-auto text-center flex flex-col items-center space-y-space-md py-space-md">
                    {/* Animated Success Icon Wrapper */}
                    <div className="w-20 h-20 rounded-full bg-stock-in-bg text-stock-in flex items-center justify-center shadow-inner relative">
                      <div className="absolute inset-0 rounded-full bg-stock-in/20 animate-ping" />
                      <span
                        className="material-symbols-outlined text-[44px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>

                    <div className="space-y-space-xs">
                      <span className="font-label-caps text-label-caps text-stock-in bg-stock-in-bg px-space-sm py-0.5 rounded-full uppercase">
                        Authenticated via Token
                      </span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                        Email Address Confirmed!
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                        Your account is now fully active. Enjoy{' '}
                        <strong className="text-on-surface font-semibold">
                          Gold Tier member perks
                        </strong>
                        , expedited 1-click checkout, and member-only pricing.
                      </p>
                    </div>

                    {/* Tier Perks Badge Bento */}
                    <div className="w-full grid grid-cols-2 gap-space-sm p-space-md bg-surface-container-low rounded-xl text-left border border-outline-variant/20">
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          local_shipping
                        </span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">
                            Free Standard Shipping
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Applied automatically
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                          military_tech
                        </span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">
                            Gold Status Initialized
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            250 welcome points
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full pt-space-sm flex flex-col gap-space-sm">
                      <Link
                        to="/"
                        className="w-full py-3.5 px-space-lg rounded-lg bg-primary hover:bg-secondary text-on-primary font-headline-sm text-body-md shadow-md text-center transition-colors flex items-center justify-center gap-space-xs"
                      >
                        <span>Continue to Storefront</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                      <Link
                        to="/"
                        className="w-full py-2.5 px-space-lg rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline-sm text-body-sm text-center transition-colors"
                      >
                        Configure Profile Preferences
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 3: Expired / Invalid State Card */}
              {verificationView === 'expired' && (
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all animate-fade-in text-left">
                  <div className="max-w-md mx-auto text-center flex flex-col items-center space-y-space-md py-space-md">
                    {/* Amber Alert Icon */}
                    <div className="w-20 h-20 rounded-full bg-stock-low-bg text-stock-low flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[42px]">gpp_maybe</span>
                    </div>

                    <div className="space-y-space-xs">
                      <span className="font-label-caps text-label-caps text-stock-low bg-stock-low-bg px-space-sm py-0.5 rounded-full uppercase">
                        Security Token Stale
                      </span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                        Verification Link Expired
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                        For your security, verification links expire after 24 hours. Request a fresh
                        verification link below to reactivate your credentials.
                      </p>
                    </div>

                    {/* Diagnostics snippet */}
                    <div className="w-full p-space-md bg-surface-container-low rounded-xl text-left flex items-start gap-space-sm border border-outline-variant/20">
                      <span className="material-symbols-outlined text-stock-low text-[20px] mt-0.5">
                        info
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-headline-sm text-body-sm text-on-surface">
                          Link timestamp exceeded threshold
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Generated yesterday at 14:22 UTC. All pending sessions for this hash have
                          been revoked.
                        </p>
                      </div>
                    </div>

                    <div className="w-full pt-space-sm flex flex-col sm:flex-row gap-space-sm">
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
                            showToast(res.message || 'Fresh verification code dispatched to mailbox.')
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
                        className="flex-1 py-3.5 px-space-md rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-headline-sm text-body-md shadow-md transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          forward_to_inbox
                        </span>
                        <span>{isResending ? 'Transmitting...' : 'Request New Link'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerificationView('otp')}
                        className="flex-1 py-3.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-md transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
                      >
                        <span>Enter Code Manually</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Assistance Notice Strip */}
              <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-md text-left">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-[20px]">help_center</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-body-md text-on-surface">
                      Didn&apos;t receive an email?
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Check your spam folder or contact 24/7 concierge support at{' '}
                      <a
                        className="text-primary hover:underline font-medium"
                        href="mailto:support@nexa-store.com"
                      >
                        support@nexa-store.com
                      </a>
                    </p>
                  </div>
                </div>
                <a
                  className="px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-sm text-body-sm transition-colors whitespace-nowrap"
                  href="mailto:support@nexa-store.com"
                >
                  Open Help Desk
                </a>
              </div>
            </div>
          </div>
        </main>

      {/* Notification Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-space-lg right-space-lg z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-2 rounded-xl shadow-xl flex items-center gap-space-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-stock-in">
            check_circle
          </span>
          <span className="font-body-sm text-body-sm">{toastMessage}</span>
        </div>
      )}

      {/* Reusable Auth Footer */}
      <AuthFooter />
    </div>
  )
}
