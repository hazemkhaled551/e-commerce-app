import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Info } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { SocialAuthButtons } from '../components/SocialAuthButtons'
import { StateBanner } from '../components/StateBanner'
import { TrustIndicators } from '../components/TrustIndicators'
import type { LoginCredentials, AuthPreviewState } from '../types/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, resendVerification, status, isAuthenticated, user } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = String(user.role || '').trim().toUpperCase()
      const isAdmin = role === 'ADMIN'
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname

      if (isAdmin) {
        const destination = from && from.startsWith('/admin') ? from : '/admin'
        navigate(destination, { replace: true })
      } else {
        const destination = from && !from.startsWith('/admin') ? from : '/'
        navigate(destination, { replace: true })
      }
    }
  }, [isAuthenticated, user, location.state, navigate])

  // Dynamic server feedback states (handled from backend response)
  const [serverState, setServerState] = useState<AuthPreviewState>('default')
  const [serverTitle, setServerTitle] = useState<string | undefined>(undefined)
  const [serverMessage, setServerMessage] = useState<string | undefined>(undefined)

  const [showPassword, setShowPassword] = useState(false)
  const [resendAlert, setResendAlert] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
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

      const result = await login(data)
      const returnedUser = result?.user || result?.data?.user
      const role = String(returnedUser?.role || '').trim().toUpperCase()
      const isAdmin = role === 'ADMIN'

      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname

      if (isAdmin) {
        const destination = from && from.startsWith('/admin') ? from : '/admin'
        navigate(destination, { replace: true })
      } else {
        const destination = from && !from.startsWith('/admin') ? from : '/'
        navigate(destination, { replace: true })
      }
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
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Authentication Section */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Architectural Login Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(36,51,49,0.05)] p-6 sm:p-8 relative overflow-hidden border border-outline-variant/60">
              {/* Subtle Teal Ambient Highlight */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              {/* Title & Introduction */}
              <div className="text-center mb-6 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase mb-2">
                  Portal Sign In
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                  Welcome back
                </h1>
                <p className="text-sm text-on-surface-variant mt-1.5">
                  Sign in to access your orders, saved items, and recommendations.
                </p>
              </div>

              {/* Server State Feedback Alert */}
              <StateBanner
                state={serverState}
                title={serverTitle}
                message={serverMessage}
                onClose={() => setServerState('default')}
                onResendVerification={async () => {
                  const email = getValues('email')
                  if (!email) {
                    setError('email', {
                      type: 'manual',
                      message: 'Please enter your email address to receive activation link',
                    })
                    return
                  }
                  await resendVerification(email)
                  setResendAlert(true)
                  setTimeout(() => setResendAlert(false), 4000)
                }}
              />

              {/* Resend Confirmation Toast */}
              {resendAlert && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2">
                  <span>A fresh activation link has been dispatched to your inbox.</span>
                </div>
              )}

              {/* Social Login Button */}
              <SocialAuthButtons
                onGoogleClick={() => {
                  setValue('email', 'alex.morgan@nexastore.com')
                  setValue('password', 'Secret123!')
                  onSubmit({
                    email: 'alex.morgan@nexastore.com',
                    password: 'Secret123!',
                    remember: true,
                  })
                }}
              />

              {/* Or Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full border-t border-outline-variant/60" />
                <span className="bg-surface-container-lowest px-3 text-xs uppercase tracking-wider text-outline font-medium shrink-0">
                  Or continue with email
                </span>
              </div>

              {/* Primary Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="email-field"
                      className="text-xs font-semibold text-on-surface"
                    >
                      Email address
                    </label>
                    <span className="text-[11px] text-on-surface-variant">
                      Personal or business
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
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
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className={`w-full h-11 pl-10 pr-4 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-error bg-error/5 focus:ring-error/20'
                          : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                      } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  {errors.email && (
                    <div className="flex items-center gap-1 text-xs text-error mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password-field"
                      className="text-xs font-semibold text-on-surface"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                    <input
                      id="password-field"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      disabled={isFormDisabled}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full h-11 pl-10 pr-11 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-error bg-error/5 focus:ring-error/20'
                          : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                      } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <div className="flex items-center gap-1 text-xs text-error mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="remember-device"
                      {...register('remember')}
                      disabled={isFormDisabled}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 bg-surface-container-lowest border-outline-variant/70 cursor-pointer accent-primary"
                    />
                    <span className="text-xs text-on-surface-variant font-medium">
                      Remember this device for 30 days
                    </span>
                  </label>

                  <div className="group relative flex items-center">
                    <Info className="w-3.5 h-3.5 text-outline cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-on-surface text-surface text-[11px] rounded-lg shadow-lg z-20 pointer-events-none">
                      Keeps your session authenticated securely on trusted hardware.
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  id="submit-btn"
                  type="submit"
                  disabled={isFormDisabled}
                  className={`w-full h-11 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer mt-2 ${
                    isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting || status === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Create Account Link Banner */}
              <div className="mt-6 pt-4 text-center border-t border-outline-variant/50">
                <p className="text-xs text-on-surface-variant">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary-hover font-semibold hover:underline transition-colors ml-1"
                  >
                    Create an account
                  </Link>
                </p>
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
