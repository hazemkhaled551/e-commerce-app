import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { SocialAuthButtons } from '../components/SocialAuthButtons'
import { StateBanner } from '../components/StateBanner'
import { TrustIndicators } from '../components/TrustIndicators'
import type { LoginCredentials, AuthPreviewState } from '../types/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, status } = useAuth()

  // Dynamic server feedback states (handled from backend response)
  const [serverState, setServerState] = useState<AuthPreviewState>('default')
  const [serverTitle, setServerTitle] = useState<string | undefined>(undefined)
  const [serverMessage, setServerMessage] = useState<string | undefined>(undefined)

  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [resendAlert, setResendAlert] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      if (serverState === 'rate_limited') {
        return
      }

      setServerState('default')
      setServerTitle(undefined)
      setServerMessage(undefined)

      await login(data)
      setLoginSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed'
      const lower = msg.toLowerCase()

      // Map backend error responses to semantic UI states
      if (
        lower.includes('rate') ||
        lower.includes('lock') ||
        lower.includes('429') ||
        lower.includes('too many')
      ) {
        setServerState('rate_limited')
        setServerTitle('Security Lock Activated')
        setServerMessage(msg)
      } else if (
        lower.includes('verify') ||
        lower.includes('unverified') ||
        lower.includes('403')
      ) {
        setServerState('unverified')
        setServerTitle('Verify your email address')
        setServerMessage(msg)
      } else if (
        lower.includes('expired') ||
        lower.includes('session') ||
        lower.includes('timeout')
      ) {
        setServerState('expired')
        setServerTitle('Session Expired')
        setServerMessage(msg)
      } else {
        setServerState('validation_error')
        setServerTitle('Sign In Failed')
        setServerMessage(msg)
        setError('email', {
          type: 'manual',
          message: 'Please check your credentials',
        })
        setError('password', {
          type: 'manual',
          message: 'Invalid email or password combination',
        })
      }
    }
  }

  const isRateLimited = serverState === 'rate_limited'
  const isFormDisabled = isSubmitting || status === 'loading' || isRateLimited

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Authentication Section */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-7xl mx-auto items-center">
          {/* Subtle ambient backdrop lighting */}
          <div className="relative w-full flex flex-col items-center justify-center">
            <div className="absolute -top-16 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-48 right-12 w-80 h-80 bg-tertiary-container/5 rounded-full blur-2xl pointer-events-none -z-10" />

            {/* Main Auth Form Container */}
            <div className="w-full max-w-md my-space-md">
              {/* Dynamic state feedback banner (Triggered by backend response) */}
              <div className="transition-all duration-300 ease-in-out" id="state-banner-container">
                {loginSuccess && (
                  <div className="mb-space-md p-space-md rounded-lg bg-surface-container-high text-on-surface flex items-center justify-between shadow-xs animate-pulse">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                      <span className="font-body-md text-body-md font-semibold">
                        Authenticating credentials... Welcome back!
                      </span>
                    </div>
                  </div>
                )}

                {resendAlert && (
                  <div className="mb-space-md p-space-md rounded-lg bg-primary-container text-on-primary flex items-center justify-between shadow-xs animate-fade-in">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                      <span className="font-body-md text-body-md">
                        A fresh verification email has been dispatched to your inbox.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResendAlert(false)}
                      className="cursor-pointer text-on-primary hover:opacity-75"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                )}

                <StateBanner
                  state={serverState}
                  title={serverTitle}
                  message={serverMessage}
                  onClose={() => setServerState('default')}
                  onResendVerification={() => {
                    setResendAlert(true)
                    setTimeout(() => setResendAlert(false), 4000)
                  }}
                />
              </div>

              {/* Core Sign In Card */}
              <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06),0_1px_3px_0_rgba(15,23,42,0.03)] border border-outline-variant/30 p-6 sm:p-8 flex flex-col">
                {/* Header & Value Proposition */}
                <div className="flex flex-col gap-space-xs mb-space-lg text-left">
                  <div className="flex items-center gap-space-xs text-primary-container font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>SECURE MEMBER ACCESS</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Sign in to your account
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Welcome back! Enter your credentials to access your orders, wishlist, and rewards.
                  </p>
                </div>

                {/* Social Sign-in Buttons */}
                <SocialAuthButtons
                  onGoogleClick={() => {
                    setValue('email', 'alex.mercer@gmail.com')
                    setValue('password', 'password123')
                  }}
                  onAppleClick={() => {
                    setValue('email', 'alex.mercer@icloud.com')
                    setValue('password', 'password123')
                  }}
                />

                {/* Subtle Divider */}
                <div className="relative flex items-center justify-center mb-space-lg">
                  <div className="w-full h-px bg-surface-container-high" />
                  <span className="absolute px-space-sm bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    Or with email
                  </span>
                </div>

                {/* Credentials Form (react-hook-form) */}
                <form
                  className="flex flex-col gap-space-md"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* Email Input Group */}
                  <div className="flex flex-col gap-space-xs text-left">
                    <label
                      htmlFor="email-field"
                      className="font-body-md text-body-md font-semibold text-on-surface flex items-center justify-between"
                    >
                      <span>Email address</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                        Personal or business
                      </span>
                    </label>

                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none transition-colors">
                        mail
                      </span>
                      <input
                        id="email-field"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        disabled={isFormDisabled}
                        {...register('email', {
                          required: 'Email address is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please provide a valid email format',
                          },
                        })}
                        className={`w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-lg border shadow-xs focus:outline-none focus:ring-2 transition-all font-body-md text-body-md ${
                          errors.email
                            ? 'border-error bg-error-container/20 focus:ring-error'
                            : 'border-outline-variant/40 focus:ring-primary-container'
                        } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                    </div>

                    {errors.email && (
                      <span className="text-error font-body-sm text-body-sm flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{errors.email.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Password Input Group */}
                  <div className="flex flex-col gap-space-xs text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password-field"
                        className="font-body-md text-body-md font-semibold text-on-surface"
                      >
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="font-body-sm text-body-sm text-primary-container hover:text-primary font-medium hover:underline transition-colors focus:outline-none focus:underline cursor-pointer"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none transition-colors">
                        lock
                      </span>
                      <input
                        id="password-field"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        disabled={isFormDisabled}
                        {...register('password', {
                          required: 'Password cannot be empty',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        className={`w-full h-11 pl-10 pr-11 bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-lg border shadow-xs focus:outline-none focus:ring-2 transition-all font-body-md text-body-md tracking-wider placeholder:tracking-normal ${
                          errors.password
                            ? 'border-error bg-error-container/20 focus:ring-error'
                            : 'border-outline-variant/40 focus:ring-primary-container'
                        } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      <button
                        type="button"
                        id="toggle-password-btn"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 p-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {errors.password && (
                      <span className="text-error font-body-sm text-body-sm flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{errors.password.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Remember Me Checkbox with Tooltip */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-space-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="remember-device"
                        {...register('remember')}
                        disabled={isFormDisabled}
                        className="w-4 h-4 rounded text-primary-container focus:ring-primary-container bg-surface-container-lowest border-outline-variant transition-colors cursor-pointer"
                      />
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Remember this device for 30 days
                      </span>
                    </label>

                    <div className="group relative flex items-center">
                      <span className="material-symbols-outlined text-outline text-[16px] cursor-help">
                        info
                      </span>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex w-48 p-space-xs bg-inverse-surface text-inverse-on-surface text-body-sm font-body-sm rounded shadow-lg z-20 pointer-events-none">
                        Keeps your account authenticated securely on trusted hardware.
                      </div>
                    </div>
                  </div>

                  {/* Submit Action Button */}
                  <button
                    id="submit-btn"
                    type="submit"
                    disabled={isFormDisabled}
                    className={`mt-space-sm w-full h-12 bg-primary-container hover:bg-secondary text-on-primary font-headline-sm text-headline-sm rounded-lg shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting || status === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </form>

                {/* Create Account Link */}
                <div className="mt-space-lg pt-space-md text-center bg-surface-container-low/60 rounded-lg p-space-sm">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Don&apos;t have an account?{' '}
                    <Link
                      to="/register"
                      className="text-primary-container hover:text-primary font-semibold hover:underline transition-colors focus:outline-none focus:underline ml-1"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>

              {/* Employee / Staff Console Pill */}
              <div className="mt-space-md flex justify-center">
                <a
                  href="#staff-console"
                  className="group inline-flex items-center gap-space-xs px-space-md py-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm"
                >
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container group-hover:rotate-12 transition-transform">
                    badge
                  </span>
                  <span>Store Manager or Employee?</span>
                  <span className="text-primary-container font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Access Staff Console →
                  </span>
                </a>
              </div>
            </div>

            {/* Security & Trust Indicators Strip */}
            <TrustIndicators />
          </div>
        </div>
      </main>

      {/* Reusable Auth Footer */}
      <AuthFooter />
    </div>
  )
}
