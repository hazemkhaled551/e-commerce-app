import { useState, useEffect, useRef } from 'react'
import type { FormEvent, KeyboardEvent, ClipboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'

export type VerificationViewMode = 'otp' | 'success' | 'expired'

export function VerifyPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const emailFromUrl = searchParams.get('email')
  const nameFromUrl = searchParams.get('name')

  // Determine initial state from API / query parameters (e.g. /verify?status=expired or /verify?status=verified)
  const initialStatus = searchParams.get('status') || searchParams.get('state')
  const [verificationView, setVerificationView] = useState<VerificationViewMode>(() => {
    if (initialStatus === 'expired' || initialStatus === 'invalid') return 'expired'
    if (initialStatus === 'success' || initialStatus === 'verified') return 'success'
    return 'otp'
  })

  // Target email dynamically resolved from registration or active session
  const defaultEmail = emailFromUrl || user?.email || 'sarah.jenkins@example.com'
  const [targetEmail, setTargetEmail] = useState(defaultEmail)

  // OTP inputs (6 digits)
  const [otpValues, setOtpValues] = useState<string[]>(['4', '8', '', '', '', ''])
  const [otpError, setOtpError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP
  const [timeLeft, setTimeLeft] = useState(48)
  const isResendActive = timeLeft <= 0

  // Modal & Toast states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [newEmailInput, setNewEmailInput] = useState('')
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

  // Focus third slot on initial mount
  useEffect(() => {
    if (verificationView === 'otp' && inputRefs.current[2]) {
      inputRefs.current[2]?.focus()
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
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otpValues]
    newOtp[index] = digit
    setOtpValues(newOtp)
    setOtpError(null)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace navigation
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
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
      showToast('Auto-filled security code from clipboard!')
    }
  }

  // Submit OTP form (transitions to success state)
  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault()
    const enteredCode = otpValues.join('')
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of your security PIN.')
      return
    }

    showToast('Authentication successful! Loading profile...')
    setTimeout(() => {
      setVerificationView('success')
    }, 700)
  }

  // Resend OTP email handler
  const handleResendOtp = () => {
    if (!isResendActive) return
    setTimeLeft(60)
    showToast(`Fresh security code sent to ${targetEmail}`)
  }

  // Trigger SMS delivery
  const triggerSmsDelivery = () => {
    showToast('SMS token sent to ending in 492')
  }

  // Save new email modal handler
  const handleSaveNewEmail = () => {
    if (newEmailInput && newEmailInput.includes('@')) {
      setTargetEmail(newEmailInput)
      setIsEmailModalOpen(false)
      setTimeLeft(60)
      showToast(`Verification code re-sent to ${newEmailInput}`)
      setNewEmailInput('')
    } else {
      showToast('Please provide a valid email address')
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
        <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl">
          {/* Top Context Header & Security Metric Strip */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-space-md text-left">
            <div className="space-y-space-xs mt-5">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>TWO-FACTOR AUTHENTICATION SYSTEM</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Identity &amp; Verification Center
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Manage your account activation and review credential authorization status in real time.
              </p>
            </div>
          </div>

          {/* Bento Grid Main Stage */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* LEFT PANEL (Col 1-8): Active Verification Playground */}
            <div className="lg:col-span-8 flex flex-col space-y-space-lg">
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
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Awaiting Input</span>
                    </div>
                  </div>

                  {/* Target Destination Alert / Banner */}
                  <div className="mt-space-sm p-space-md bg-surface-container-low rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm text-on-surface">
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
                    <button
                      type="button"
                      onClick={() => {
                        setNewEmailInput(targetEmail)
                        setIsEmailModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1 text-primary hover:text-secondary font-headline-sm text-body-sm transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Change Email</span>
                    </button>
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
                          const isActiveSlot = idx === 2
                          return (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              ref={(el) => {
                                inputRefs.current[idx] = el
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              className={`otp-box w-full aspect-square text-center font-price-lg text-price-lg text-on-surface rounded-lg transition-all ${isActiveSlot
                                ? 'bg-surface-container-lowest ring-2 ring-primary shadow-xs'
                                : 'bg-surface-container-low border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary'
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

                      <div className="flex flex-wrap items-center gap-space-md">
                        <button
                          type="button"
                          disabled={!isResendActive}
                          onClick={handleResendOtp}
                          className={`font-headline-sm text-body-sm flex items-center gap-1 transition-colors ${
                            isResendActive
                              ? 'text-primary hover:text-secondary cursor-pointer'
                              : 'text-on-surface-variant opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">refresh</span>
                          <span>Resend OTP via Email</span>
                        </button>
                        <span className="text-outline-variant hidden sm:inline">•</span>
                        <button
                          type="button"
                          onClick={triggerSmsDelivery}
                          className="font-headline-sm text-body-sm text-primary hover:text-secondary flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">sms</span>
                          <span>Send to SMS instead</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Action Button */}
                    <div className="pt-space-sm">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-space-lg rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-headline-sm text-headline-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        <span>Verify &amp; Activate Account</span>
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
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-200/40 animate-ping" />
                      <span
                        className="material-symbols-outlined text-[44px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>

                    <div className="space-y-space-xs">
                      <span className="font-label-caps text-label-caps text-emerald-700 bg-emerald-100/70 px-space-sm py-0.5 rounded-full uppercase">
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
                    <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[42px]">gpp_maybe</span>
                    </div>

                    <div className="space-y-space-xs">
                      <span className="font-label-caps text-label-caps text-amber-700 bg-amber-100/70 px-space-sm py-0.5 rounded-full uppercase">
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
                      <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">
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
                        onClick={() =>
                          showToast('Fresh magic verification link dispatched to mailbox.')
                        }
                        className="flex-1 py-3.5 px-space-md rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-headline-sm text-body-md shadow-md transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          forward_to_inbox
                        </span>
                        <span>Request New Link</span>
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

            {/* RIGHT PANEL (Col 9-12): Real-Time Audit, Session Telemetry & Identity Staging */}
            <div className="lg:col-span-4 flex flex-col space-y-space-lg text-left">
              {/* User Profile Card */}
              <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/30 space-y-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="relative">
                    <img
                      className="w-14 h-14 rounded-full object-cover shadow-xs"
                      alt="User Portrait"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP3PruQ0ejZIaHk5Ehgj6wS6eU1eOE_Daop1q_I-OEwsNO1nanz6__Y97FzftAgVZlj39nXsB5MnKM-d-L9hYQeF1OD7N7aPwh_qu6xcttJ-5XhHg3rniSUQLIUdBLcwEOT-jZnZBQknYS78TTy9axbPWJJW4YERR8_YSqTl7442XduRlrSXK91HQp292Ar72suQnoQzY-upG__yH9yzDAKh0-1mlj2amOaZV15z4mJnh3hpVJUnjZhw"
                    />
                    <span
                      className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 rounded-full ring-2 ring-surface-container-lowest"
                      title="Verification Pending"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {nameFromUrl || user?.name || (targetEmail ? targetEmail.split('@')[0] : 'Sarah Jenkins')}
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Customer ID: #NX-88219
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-caps text-label-caps font-semibold">
                      PENDING CONFIRMATION
                    </span>
                  </div>
                </div>

                {/* Telemetry Breakdown */}
                <div className="space-y-space-xs pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                    <span>Primary Contact</span>
                    <span className="text-on-surface font-medium truncate max-w-[180px]">
                      {getMaskedEmail(targetEmail)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                    <span>Recovery Phone</span>
                    <span className="text-on-surface font-medium">+1 (555) ••••-492</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                    <span>Login Device</span>
                    <span className="text-on-surface font-medium">Safari on macOS 14.5</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Origin IP</span>
                    <span className="text-on-surface font-medium">198.51.100.44 (San Jose, CA)</span>
                  </div>
                </div>
              </div>

              {/* Trust & Cryptographic Verification Visual Card */}
              <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/30 space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs text-primary font-headline-sm text-body-md">
                    <span className="material-symbols-outlined text-[20px]">encrypted</span>
                    <span>Security Health</span>
                  </div>
                  <span className="font-price-md text-price-md text-primary">85% Complete</span>
                </div>

                {/* Inline SVG Ring Graph */}
                <div className="flex items-center gap-space-md bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-highest"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span className="absolute font-headline-sm text-body-sm text-on-surface">
                      5/6
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-headline-sm text-body-sm text-on-surface">
                      Multi-Factor Readiness
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Completing email auth unlocks instant transactions &amp; card vault storage.
                    </p>
                  </div>
                </div>

                {/* Safe Checklist */}
                <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      check
                    </span>
                    <span>Password complexity verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                      check
                    </span>
                    <span>Device fingerprint cataloged</span>
                  </li>
                  <li className="flex items-center gap-2 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      pending
                    </span>
                    <span>Email ownership verification (In progress)</span>
                  </li>
                </ul>
              </div>

              {/* Quick Tips Card */}
              <div className="w-full bg-surface-container rounded-xl p-space-md space-y-space-xs text-on-surface border border-outline-variant/20">
                <div className="flex items-center gap-space-xs font-headline-sm text-body-sm text-primary">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span>Security Best Practice</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nexa employees will never ask for your 6-digit one-time code over the phone or email. Keep this tab open while retrieving your code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Change Email Address Overlay */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-margin-mobile animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl space-y-space-md animate-in fade-in zoom-in-95 duration-150 border border-outline-variant/30 text-left">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  contact_mail
                </span>
                <h3 className="font-headline-sm text-headline-sm">Update Email Address</h3>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
                onClick={() => setIsEmailModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter the new email address you&apos;d like to use for Nexa Store credentials. A new
              6-digit code will be generated immediately.
            </p>

            <div className="space-y-space-xs">
              <label className="font-headline-sm text-body-sm text-on-surface" htmlFor="new-email">
                New Email Address
              </label>
              <input
                id="new-email"
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="sarah.jenkins@work.org"
                className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none text-body-md text-on-surface placeholder:text-outline"
              />
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-sm">
              <button
                type="button"
                className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm cursor-pointer"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-space-md py-2 rounded-lg bg-primary hover:bg-secondary text-on-primary font-headline-sm text-body-sm shadow-xs cursor-pointer"
                onClick={handleSaveNewEmail}
              >
                Save &amp; Dispatch Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-space-lg right-space-lg z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-2 rounded-xl shadow-xl flex items-center gap-space-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">
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
