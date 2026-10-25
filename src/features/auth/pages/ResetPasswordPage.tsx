import { useState, useEffect, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { resetPasswordApi, resendPasswordResetApi } from '../api/authApi'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  // Form Field States
  const [targetEmail] = useState(emailParam || 'sarah.jenkins@workmail.io')
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
      // User pasted or typed multiple digits
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
        barColor: 'bg-surface-variant',
      }
    }
    if (score === 1) {
      return {
        label: 'Critical / Weak',
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
        labelColor: 'text-secondary-container',
        entropy: 50,
        dashOffset: 125.6,
        activeBars: 2,
        barColor: 'bg-secondary-container',
      }
    }
    if (score === 3) {
      return {
        label: 'Strong',
        labelColor: 'text-tertiary-container',
        entropy: 75,
        dashOffset: 62.8,
        activeBars: 3,
        barColor: 'bg-tertiary-container',
      }
    }
    return {
      label: 'Enterprise Grade',
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
        otp: fullOtp,
        newPassword,
        email: targetEmail,
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
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Container with generous top clearance below the fixed header */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col w-full max-w-7xl mx-auto">
          {/* Top Context Bar */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
            <div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-caps text-label-caps tracking-widest uppercase mb-1">
                <span>Account Central</span>
                <span>/</span>
                <span className="text-primary font-semibold">Security Credential Console</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Identity &amp; Access Recovery
              </h1>
            </div>

            {/* Account identifier pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-body-sm text-body-sm self-start md:self-auto shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
              <span className="font-medium text-on-surface">{targetEmail}</span>
            </div>
          </div>

          {/* Main Recovery Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Column: Core Workflow Card Container */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
              {/* Card Section */}
              <section className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-2xl transition-all duration-300">
                {/* Padlock / Security Badge Header */}
                <div className="flex items-center justify-between mb-space-lg">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      lock_reset
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    ZERO-KNOWLEDGE AUTH
                  </span>
                </div>

                {/* VIEW 1: NORMAL FORM */}
                {!isSuccess && !isExpiredError && (
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
                      Reset your password
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-xl max-w-xl">
                      Enter the 6-digit verification code sent to your email and choose a strong new password to securely update your credentials.
                    </p>

                    {/* Resend feedback toast */}
                    {resendNotice && (
                      <div className="mb-space-md p-space-sm rounded-lg bg-surface-container-high text-primary font-body-sm text-body-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                        <span>{resendNotice}</span>
                      </div>
                    )}

                    {/* Form error alert */}
                    {formError && (
                      <div className="mb-space-md p-space-md rounded-lg bg-error-container/40 text-error flex items-start gap-space-sm shadow-xs">
                        <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
                        <div className="flex flex-col text-left">
                          <span className="font-headline-sm text-headline-sm text-sm font-semibold">Verification Error</span>
                          <span className="font-body-sm text-body-sm mt-0.5">{formError}</span>
                        </div>
                      </div>
                    )}

                    <form className="space-y-space-md" onSubmit={handleSubmit}>
                      {/* OTP Field (Instead of Email, as requested by user) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                            6-Digit Verification Code (OTP)
                          </label>
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                            Required
                          </span>
                        </div>

                        {/* 6 Segmented OTP Inputs */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
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
                              className={`w-11 sm:w-13 h-12 text-center font-headline-md text-headline-md font-bold rounded-lg bg-surface-container-low text-on-surface border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 shadow-inner ${
                                val
                                  ? 'border-primary text-primary focus:ring-primary'
                                  : 'border-outline-variant/50 focus:ring-primary'
                              }`}
                            />
                          ))}
                        </div>

                        {/* OTP helper & Resend link */}
                        <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
                          <span className="flex items-center gap-1 text-[13px]">
                            <span className="material-symbols-outlined text-[15px] text-tertiary-container">info</span>
                            Check inbox &amp; spam folder
                          </span>
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0}
                            className={`font-medium transition-colors cursor-pointer ${
                              resendCooldown > 0
                                ? 'text-on-surface-variant cursor-not-allowed opacity-70'
                                : 'text-primary hover:underline'
                            }`}
                          >
                            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code Now'}
                          </button>
                        </div>
                      </div>

                      {/* New Password Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="new-pass-main">
                            New Password
                          </label>
                          <span className={`font-label-caps text-label-caps uppercase font-bold ${strength.labelColor}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                            <span className="material-symbols-outlined text-[20px]">lock</span>
                          </div>
                          <input
                            id="new-pass-main"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full h-11 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-colors shadow-inner border border-outline-variant/40"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            title={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showNewPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>

                        {/* Strength meter bar */}
                        <div className="mt-2 flex items-center gap-1.5 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 1 ? strength.barColor : 'bg-surface-variant'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 2 ? strength.barColor : 'bg-surface-variant'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 3 ? strength.barColor : 'bg-surface-variant'
                            }`}
                          />
                          <div
                            className={`h-full w-1/4 transition-colors duration-300 ${
                              strength.activeBars >= 4 ? strength.barColor : 'bg-surface-variant'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Confirm New Password Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="confirm-pass-main">
                            Confirm New Password
                          </label>
                          {passwordsMatch && (
                            <div className="flex items-center gap-1 text-primary font-label-caps text-label-caps font-semibold">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              <span>PASSWORDS MATCH</span>
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                          </div>
                          <input
                            id="confirm-pass-main"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            required
                            className="w-full h-11 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-colors shadow-inner border border-outline-variant/40"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Criteria Checklist Bento Matrix */}
                      <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-xs">
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold mb-2">
                          Password Requirements Checklist
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs font-body-sm text-body-sm">
                          <div
                            className={`flex items-center gap-space-xs ${
                              hasLength ? 'text-primary font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {hasLength ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span>Minimum 8 characters</span>
                          </div>
                          <div
                            className={`flex items-center gap-space-xs ${
                              hasUpper ? 'text-primary font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {hasUpper ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span>At least one uppercase (A-Z)</span>
                          </div>
                          <div
                            className={`flex items-center gap-space-xs ${
                              hasNumber ? 'text-primary font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span>At least one numeral (0-9)</span>
                          </div>
                          <div
                            className={`flex items-center gap-space-xs ${
                              hasSymbol ? 'text-primary font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span>At least one symbol (!@#$%^&*)</span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Action Button */}
                      <button
                        className="w-full h-12 bg-primary text-on-primary font-body-md text-body-md font-semibold rounded-lg shadow hover:bg-secondary active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                        id="btn-submit-recovery"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">
                              progress_activity
                            </span>
                            <span>Encrypting &amp; Dispatching...</span>
                          </>
                        ) : (
                          <>
                            <span>Update Password &amp; Sign In</span>
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Bottom Nav Links */}
                    <div className="mt-space-xl pt-space-lg flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
                      <Link
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:text-secondary transition-colors"
                        to="/login"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>Back to Sign In</span>
                      </Link>
                      <button
                        className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 font-body-sm text-body-sm cursor-pointer"
                        onClick={() => setIsExpiredError(true)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">help</span>
                        <span>Code Expired or Invalid?</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 2: SUCCESS STATE */}
                {isSuccess && (
                  <div className="py-space-md text-left animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-secondary-fixed text-primary flex items-center justify-center mb-space-md shadow-sm">
                      <span className="material-symbols-outlined text-[32px]">check_circle</span>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps font-semibold uppercase tracking-wider">
                      Credentials Secured
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface mt-space-sm mb-space-xs">
                      Password Reset Successfully!
                    </h2>
                    <div className="p-space-md rounded-xl bg-surface-container-low my-space-md shadow-sm">
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        Your account password has been updated and cryptographically hashed with Argon2id. All active device sessions have been invalidated for your security.
                      </p>
                      <div className="mt-space-sm flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        <span>Redirecting to Sign In in {successCountdown} seconds...</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                      <button
                        className="px-space-lg h-11 bg-primary text-on-primary font-body-md text-body-md font-semibold rounded-lg shadow hover:bg-secondary transition-all flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/login')}
                        type="button"
                      >
                        <span>Proceed to Sign In Now</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 3: EXPIRED / INVALID TOKEN ADVISORY */}
                {isExpiredError && (
                  <div className="animate-fadeIn text-left">
                    <div className="flex items-start gap-space-md mb-space-lg">
                      <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[28px]">gpp_bad</span>
                      </div>
                      <div>
                        <span className="px-space-sm py-0.5 rounded-full bg-error-container text-error font-label-caps text-label-caps font-semibold">
                          SECURITY ADVISORY: CODE INVALID
                        </span>
                        <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                          Verification Code Expired or Tampered
                        </h2>
                      </div>
                    </div>
                    <div className="p-space-md rounded-xl bg-surface-container-low mb-space-lg space-y-space-xs font-body-md text-body-md text-on-surface">
                      <p>
                        The verification code you provided has exceeded the cryptographic validity window or has already been consumed.
                      </p>
                      <ul className="list-disc pl-5 text-on-surface-variant font-body-sm text-body-sm space-y-1">
                        <li>Single-use nonce invalidated upon first submission.</li>
                        <li>Browser cookie integrity check mismatch or IP origin variance.</li>
                        <li>Token expiration time threshold reached.</li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                      <button
                        className="w-full sm:w-auto px-space-lg h-12 bg-primary text-on-primary font-body-md text-body-md font-semibold rounded-lg shadow hover:bg-secondary transition-all flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                          setIsExpiredError(false)
                          handleResendOtp()
                        }}
                        type="button"
                      >
                        <span>Request Fresh Reset Link</span>
                        <span className="material-symbols-outlined text-[18px]">cached</span>
                      </button>
                      <button
                        className="w-full sm:w-auto px-space-md h-12 bg-surface-container text-on-surface font-body-md text-body-md font-semibold rounded-lg hover:bg-surface-container-high transition-colors text-center cursor-pointer"
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

            {/* Right Column: Security Posture, Data Visualization & Trust Metrics */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-space-lg text-left">
              {/* Trust & Threat Mitigation Bento Card */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex items-center justify-between mb-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Credential Guard</h3>
                  <span className="material-symbols-outlined text-tertiary-container">security</span>
                </div>

                {/* SVG Visual: Live Entropy Meter / Encryption Radar */}
                <div className="p-space-md rounded-xl bg-surface-container-low mb-space-md flex flex-col items-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Animated SVG Ring */}
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
                      <span className="font-headline-md text-headline-md font-bold text-on-surface" id="entropy-percentage">
                        {strength.entropy}%
                      </span>
                      <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                        Entropy
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-sm text-center">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">Argon2id Key Derivation</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Salted with CSPRNG 256-bit entropy</p>
                  </div>
                </div>

                {/* Metric Details */}
                <div className="space-y-space-sm font-body-sm text-body-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                    <span className="text-on-surface-variant">Brute Force Backoff</span>
                    <span className="font-semibold text-on-surface">Exponential / 5 attempts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                    <span className="text-on-surface-variant">Token Invalidation</span>
                    <span className="font-semibold text-on-surface">Instantaneous on commit</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                    <span className="text-on-surface-variant">Leaked Password Check</span>
                    <span className="font-semibold text-primary">k-Anonymity API Active</span>
                  </div>
                </div>
              </div>

              {/* Security Guidance Card with Photo Avatar */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex items-center gap-space-sm mb-space-sm">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Corporate security analyst"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAti0lqPxaISrPMkNUePfU2mbbY5F-z5A_pl5bF5nfdZ65wrmTu59BPcnPmy2hhpUOzhyqJH0dwoDAGsT0BVZ3cI6pjRgLyP70sLsjTGm9PwdHcKKmWypwqqJSX4NwiOqxCM2EjJAKJZMIBmHGjYSIapHde_jeXQzekDUl_WpximR7KCds58xSJJvKKlsf3Ty6QVTJtQ6P-GWgULO2KhEImBXDJS9-qxwJopdInMImEiXxkJuz7DHwC-g"
                    />
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface">Nexa SecOps Advisory</p>
                    <p className="font-label-caps text-label-caps text-outline uppercase">Global Support Operations</p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  &ldquo;Never disclose password reset codes or security URLs over live chat, telephone, or third-party email. Nexa engineers will never ask for your private passphrase.&rdquo;
                </p>
                <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/15">
                  <Link className="inline-flex items-center gap-1 font-semibold text-primary hover:text-secondary" to="/">
                    <span>2FA Device Setup Guide</span>
                    <span className="material-symbols-outlined text-[16px]">north_east</span>
                  </Link>
                  <span className="text-label-caps font-label-caps text-outline">REF: SEC-2025</span>
                </div>
              </div>

              {/* Secondary Photo Banner: Secure Terminal */}
              <div className="rounded-xl overflow-hidden shadow-sm relative h-36 bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Enterprise server datacenter"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjeuNIARaBda_sVD4DenX6jy1BywVxSodvHaEPVhdUQnrY7Q2eE-RVBFlI789i1F351q4QFE5fcpTtkUJS7eSaYUhLbyE9zH3KUvJnJWaf9mXJJDShCSDUDNQndpbE0ZdXNy2RzbfYhF7LpM3gGVWMoEF1oS6rp81EjdzbxvD2BkqHEOKxnyqaj_yxGngujNo9CNqg1vjNYDCyO2ZeIlhvvkR4WCcuhbTW7pX1ZAUs1r8F__Nv4LqARA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/30 to-transparent p-space-md flex flex-col justify-end text-inverse-on-surface">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary-fixed">
                    ISO / IEC 27001 COMPLIANT
                  </span>
                  <p className="font-body-sm text-body-sm font-semibold">Continuous Threat Detection Active</p>
                </div>
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
