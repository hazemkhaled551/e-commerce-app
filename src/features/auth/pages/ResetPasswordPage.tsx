import { useState, useEffect, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Circle,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  User,
} from 'lucide-react'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { resetPasswordApi, resendPasswordResetApi } from '../api/authApi'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  // Form Field States
  const [targetEmail] = useState(emailParam || '')
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status & View States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExpiredError, setIsExpiredError] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successCountdown, setSuccessCountdown] = useState(5)

  // OTP Resend Cooldown
  const [resendCooldown, setResendCooldown] = useState(45)
  const [resendNotice, setResendNotice] = useState<string | null>(null)

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Redirect on Success Countdown
  useEffect(() => {
    if (!isSuccess || successCountdown <= 0) return
    const timer = setInterval(() => {
      setSuccessCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSuccess, successCountdown, navigate])

  // OTP input change handler
  const handleOtpChange = (index: number, val: string) => {
    const sanitized = val.replace(/\D/g, '')
    const newArr = [...otpValues]

    if (sanitized.length > 1) {
      const digits = sanitized.slice(0, 6).split('')
      digits.forEach((d, i) => {
        if (i < 6) newArr[i] = d
      })
      setOtpValues(newArr)
      const nextFocus = Math.min(digits.length, 5)
      otpInputRefs.current[nextFocus]?.focus()
      return
    }

    newArr[index] = sanitized
    setOtpValues(newArr)

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // OTP keydown handler for backspace navigation
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // OTP paste handler
  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const newArr = [...otpValues]
    pasted.split('').forEach((d, i) => {
      if (i < 6) newArr[i] = d
    })
    setOtpValues(newArr)
    const nextFocus = Math.min(pasted.length, 5)
    otpInputRefs.current[nextFocus]?.focus()
  }

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    try {
      await resendPasswordResetApi(targetEmail)
      setResendNotice(`A fresh 6-digit verification code has been dispatched to ${targetEmail}`)
      setResendCooldown(45)
      setTimeout(() => setResendNotice(null), 4000)
    } catch {
      setResendNotice('Failed to dispatch code. Please try again.')
      setTimeout(() => setResendNotice(null), 4000)
    }
  }

  // Password Strength Evaluation
  const hasLength = newPassword.length >= 8
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  let score = 0
  if (hasLength) score++
  if (hasUpper) score++
  if (hasNumber) score++
  if (hasSymbol) score++

  const getStrengthData = () => {
    if (newPassword.length === 0) {
      return {
        label: 'Awaiting Input',
        labelColor: 'text-outline',
        entropy: 0,
        dashOffset: 251.2,
        activeBars: 0,
        barColor: 'bg-surface-container-highest',
      }
    }
    if (score === 1) {
      return {
        label: 'Weak',
        labelColor: 'text-error',
        entropy: 25,
        dashOffset: 188.4,
        activeBars: 1,
        barColor: 'bg-error',
      }
    }
    if (score === 2) {
      return {
        label: 'Fair',
        labelColor: 'text-amber-500',
        entropy: 50,
        dashOffset: 125.6,
        activeBars: 2,
        barColor: 'bg-amber-500',
      }
    }
    if (score === 3) {
      return {
        label: 'Strong',
        labelColor: 'text-secondary',
        entropy: 75,
        dashOffset: 62.8,
        activeBars: 3,
        barColor: 'bg-secondary',
      }
    }
    return {
      label: 'Optimal',
      labelColor: 'text-primary',
      entropy: 100,
      dashOffset: 0,
      activeBars: 4,
      barColor: 'bg-primary',
    }
  }

  const strength = getStrengthData()
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const fullOtp = otpValues.join('')
    if (fullOtp.length < 6) {
      setFormError('Please enter all 6 digits of your verification code.')
      return
    }

    if (!hasLength) {
      setFormError('Password must contain at least 8 characters.')
      return
    }

    if (!passwordsMatch) {
      setFormError('Passwords do not match. Please ensure both fields are identical.')
      return
    }

    setIsSubmitting(true)

    try {
      await resetPasswordApi({
        email: targetEmail,
        otp: fullOtp,
        newPassword,
        confirmNewPassword: confirmPassword,
      })
      setIsSuccess(true)
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string }
      if (
        errorObj?.status === 400 &&
        errorObj?.message?.toLowerCase().includes('expired')
      ) {
        setIsExpiredError(true)
      } else {
        setFormError(errorObj?.message || 'Password update failed. Please verify your OTP.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Container */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col">
          {/* Top Context Bar */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase mb-1">
                Security Credential Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                Identity &amp; Access Recovery
              </h1>
            </div>

            {targetEmail && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-medium text-on-surface self-start md:self-auto shadow-xs">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>{targetEmail}</span>
              </div>
            )}
          </div>

          {/* Main Recovery Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Core Workflow Card Container */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              <section className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(36,51,49,0.05)] p-6 sm:p-8 border border-outline-variant/60 relative overflow-hidden transition-all text-left">
                {/* Subtle Teal Accent Glow */}
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* VIEW 1: NORMAL FORM */}
                {!isSuccess && !isExpiredError && (
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Zero-Knowledge Auth
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-1.5">
                      Reset your password
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed max-w-xl">
                      Enter the 6-digit verification code sent to your email and choose a strong new password to securely update your credentials.
                    </p>

                    {/* Resend feedback toast */}
                    {resendNotice && (
                      <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{resendNotice}</span>
                      </div>
                    )}

                    {/* Form error alert */}
                    {formError && (
                      <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error flex items-start gap-2.5 animate-fade-in">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold">Verification Error</span>
                          <span className="text-xs text-on-surface-variant mt-0.5">{formError}</span>
                        </div>
                      </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      {/* OTP Field */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-on-surface">
                            6-Digit Verification PIN (OTP)
                          </label>
                          <span className="text-[11px] text-on-surface-variant">Required</span>
                        </div>

                        {/* 6 Segmented OTP Inputs */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              id={`otp-box-${idx}`}
                              ref={(el) => {
                                otpInputRefs.current[idx] = el
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              className={`w-11 sm:w-12 h-12 text-center font-mono text-xl font-bold rounded-xl bg-surface-container-low/50 text-on-surface border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 ${
                                val
                                  ? 'border-primary text-primary focus:ring-primary/20'
                                  : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                              }`}
                            />
                          ))}
                        </div>

                        {/* OTP helper & Resend link */}
                        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                          <span>Check your inbox &amp; spam folder</span>
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0}
                            className={`font-semibold transition-colors cursor-pointer ${
                              resendCooldown > 0
                                ? 'text-outline cursor-not-allowed opacity-60'
                                : 'text-primary hover:underline'
                            }`}
                          >
                            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code Now'}
                          </button>
                        </div>
                      </div>

                      {/* New Password Field */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-on-surface" htmlFor="new-pass-main">
                            New Password
                          </label>
                          <span className={`text-[11px] font-bold uppercase ${strength.labelColor}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                          <input
                            id="new-pass-main"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full h-11 pl-10 pr-11 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border border-outline-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                          />
                          <button
                            type="button"
                            className="absolute right-3 p-1 rounded-md text-outline hover:text-on-surface cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            title={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Strength meter bar */}
                        <div className="mt-2 flex items-center gap-1.5 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 1 ? strength.barColor : 'bg-surface-container-highest'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 2 ? strength.barColor : 'bg-surface-container-highest'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 3 ? strength.barColor : 'bg-surface-container-highest'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 4 ? strength.barColor : 'bg-surface-container-highest'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Confirm New Password Field */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-on-surface" htmlFor="confirm-pass-main">
                            Confirm New Password
                          </label>
                          {passwordsMatch && (
                            <div className="flex items-center gap-1 text-primary text-[11px] font-bold uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Passwords Match</span>
                            </div>
                          )}
                        </div>
                        <div className="relative flex items-center">
                          <KeyRound className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                          <input
                            id="confirm-pass-main"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            required
                            className="w-full h-11 pl-10 pr-11 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border border-outline-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                          />
                          <button
                            type="button"
                            className="absolute right-3 p-1 rounded-md text-outline hover:text-on-surface cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Requirements Checklist */}
                      <div className="p-3.5 rounded-xl bg-surface-container-low/60 space-y-2 text-left">
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Password Requirements
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                          <div className={`flex items-center gap-1.5 ${hasLength ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                            {hasLength ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> : <Circle className="w-3.5 h-3.5 text-outline shrink-0" />}
                            <span>Minimum 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                            {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> : <Circle className="w-3.5 h-3.5 text-outline shrink-0" />}
                            <span>Uppercase letter (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                            {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> : <Circle className="w-3.5 h-3.5 text-outline shrink-0" />}
                            <span>Number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                            {hasSymbol ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> : <Circle className="w-3.5 h-3.5 text-outline shrink-0" />}
                            <span>Special symbol (!@#$%^&*)</span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Action Button */}
                      <button
                        className="w-full h-11 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                        id="btn-submit-recovery"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Encrypting &amp; Dispatching...</span>
                          </div>
                        ) : (
                          <>
                            <span>Update Password &amp; Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Bottom Nav Links */}
                    <div className="mt-6 pt-4 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/50">
                      <Link
                        className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline transition-colors"
                        to="/login"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </Link>
                      <button
                        className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 cursor-pointer"
                        onClick={() => setIsExpiredError(true)}
                        type="button"
                      >
                        <span>Code Expired or Invalid?</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 2: SUCCESS STATE */}
                {isSuccess && (
                  <div className="py-4 text-left animate-fade-in relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                      Credentials Secured
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-2 mb-1">
                      Password Reset Successfully!
                    </h2>
                    <div className="p-4 rounded-xl bg-surface-container-low/60 my-4 border border-outline-variant/50">
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                        Your account password has been updated and securely hashed. All active sessions have been invalidated for your safety.
                      </p>
                      <div className="mt-2 text-xs text-on-surface-variant font-medium">
                        Redirecting to Sign In in {successCountdown} seconds...
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        className="h-11 px-6 bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/login')}
                        type="button"
                      >
                        <span>Proceed to Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 3: EXPIRED / INVALID TOKEN ADVISORY */}
                {isExpiredError && (
                  <div className="animate-fade-in text-left relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold uppercase">
                          Security Advisory
                        </span>
                        <h2 className="text-xl font-bold text-on-surface mt-1">
                          Verification Code Expired
                        </h2>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-container-low/60 mb-6 space-y-2 text-xs text-on-surface leading-relaxed border border-outline-variant/50">
                      <p>
                        The verification code you provided has exceeded its validity window or has already been used.
                      </p>
                      <ul className="list-disc pl-5 text-on-surface-variant space-y-1">
                        <li>Single-use codes invalidate upon submission.</li>
                        <li>Token expiration time threshold reached (60 minutes).</li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        className="w-full sm:w-auto px-6 h-11 bg-primary hover:bg-primary-hover text-on-primary text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                          setIsExpiredError(false)
                          handleResendOtp()
                        }}
                        type="button"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Request Fresh Code</span>
                      </button>
                      <button
                        className="w-full sm:w-auto px-6 h-11 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer border border-outline-variant/60"
                        onClick={() => navigate('/login')}
                        type="button"
                      >
                        Log In With Password
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Security Guidance */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 text-left">
              <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(36,51,49,0.04)] p-6 border border-outline-variant/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-on-surface">Credential Guard</h3>
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low/60 mb-4 flex flex-col items-center border border-outline-variant/50">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-surface-container-highest"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                      />
                      <circle
                        className="text-primary transition-all duration-700 ease-out"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        id="entropy-circle"
                        r="40"
                        stroke="currentColor"
                        strokeDasharray="251.2"
                        strokeDashoffset={strength.dashOffset}
                        strokeLinecap="round"
                        strokeWidth="8"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-on-surface" id="entropy-percentage">
                        {strength.entropy}%
                      </span>
                      <span className="text-[10px] text-outline uppercase font-semibold">
                        Entropy
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-semibold text-on-surface">Argon2id Key Derivation</span>
                    <p className="text-[11px] text-on-surface-variant">Salted with 256-bit CSPRNG</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/50">
                    <span className="text-on-surface-variant">Brute Force Protection</span>
                    <span className="font-semibold text-on-surface">Rate limited</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/50">
                    <span className="text-on-surface-variant">Session Invalidation</span>
                    <span className="font-semibold text-on-surface">Instant on reset</span>
                  </div>
                </div>
              </div>

              {/* Security Advisory Notice */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(36,51,49,0.04)] p-5 border border-outline-variant/60">
                <div className="flex items-center gap-2.5 mb-2 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold text-on-surface">Nexa SecOps Notice</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Never share your verification code or password with anyone. NexaStore support personnel will never ask for your private credentials.
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
