import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Truck,
  Sparkles,
  X,
  Send,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthFooter } from '../components/AuthFooter'
import { PhoneInputField } from '@/components/ui/PhoneInputField'
import type { RegisterCredentials } from '../types/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAuth, resendVerification, status } = useAuth()

  // UI States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailConflict, setEmailConflict] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [registeredName, setRegisteredName] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle')

  const [currentPassword, setCurrentPassword] = useState('')
  const [phoneValue, setPhoneValue] = useState('')

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
      marketingOptIn: true,
    },
    mode: 'onTouched',
  })

  // Register phone field validation with react-hook-form
  useEffect(() => {
    register('phone', {
      required: 'Phone number is required',
      validate: (val) =>
        Boolean(val && val.trim().length >= 8) || 'Please enter a valid phone number',
    })
  }, [register])

  // Password analysis
  const hasLength = currentPassword.length >= 8
  const hasCase = /[A-Z]/.test(currentPassword) && /[a-z]/.test(currentPassword)
  const hasNum = /[0-9]/.test(currentPassword)
  const hasSym = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(currentPassword)

  let strengthScore = 0
  if (hasLength) strengthScore++
  if (hasCase) strengthScore++
  if (hasNum) strengthScore++
  if (hasSym) strengthScore++

  const getStrengthLabel = () => {
    if (strengthScore === 0) return { text: 'Awaiting input', color: 'text-outline' }
    if (strengthScore === 1) return { text: 'Weak', color: 'text-error' }
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-500' }
    if (strengthScore === 3) return { text: 'Strong', color: 'text-secondary' }
    return { text: 'Optimal', color: 'text-primary' }
  }

  const strengthInfo = getStrengthLabel()

  // Submission handler
  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setEmailConflict(null)
      setGeneralError(null)

      await registerAuth(data)
      setRegisteredEmail(data.email)
      setRegisteredName(data.name)
      setShowVerificationModal(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      const lower = msg.toLowerCase()

      if (
        lower.includes('already') ||
        lower.includes('exist') ||
        lower.includes('in use') ||
        lower.includes('conflict')
      ) {
        setEmailConflict(data.email)
      } else {
        setGeneralError(msg)
      }
    }
  }

  const handleResendVerification = async () => {
    if (!registeredEmail) return
    try {
      setResendStatus('transmitting')
      await resendVerification(registeredEmail)
      setResendStatus('sent')
    } catch {
      setResendStatus('idle')
    }
  }

  const getMaskedEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr
    const [user, domain] = emailStr.split('@')
    if (user.length <= 2) return `${user[0]}***@${domain}`
    return `${user[0]}***${user[user.length - 1]}@${domain}`
  }

  const isFormDisabled = isSubmitting || status === 'loading'

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Content Area */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Primary Account Registration Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(36,51,49,0.05)] p-6 sm:p-8 relative overflow-hidden border border-outline-variant/60">
                {/* Subtle Teal Ambient Highlight */}
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header Section */}
                <div className="flex flex-col gap-1 mb-6 relative z-10 text-left">
                  <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase mb-1">
                    Member Onboarding
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                    Create your Nexa account
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Join NexaStore to track live parcels, save favorite collections, and unlock member privileges.
                  </p>
                </div>

                {/* Email Already Registered Banner */}
                {emailConflict && (
                  <div className="mb-4 p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-start justify-between gap-3 animate-fade-in">
                    <div className="flex items-start gap-2.5 text-left">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-on-surface">
                          Email already registered
                        </span>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          An account for <span className="font-semibold text-on-surface">{emailConflict}</span> exists.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="px-3 py-1 bg-surface-container-lowest text-primary text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-container transition-colors whitespace-nowrap"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* General Backend Error Banner */}
                {generalError && (
                  <div className="mb-4 p-3.5 bg-error/10 border border-error/20 text-on-surface rounded-xl flex items-start justify-between gap-3 animate-fade-in text-left">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-error">Registration Failed</span>
                        <span className="text-xs text-on-surface-variant mt-0.5">{generalError}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGeneralError(null)}
                      className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* The Registration Form */}
                <form
                  className="space-y-4 relative z-10"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* Full Name */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="fullName"
                        className="text-xs font-semibold text-on-surface"
                      >
                        Full Name
                      </label>
                      <span className="text-[11px] text-on-surface-variant">Required</span>
                    </div>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Alex Morgan"
                        disabled={isFormDisabled}
                        {...register('name', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Full name must be at least 2 characters',
                          },
                        })}
                        className={`w-full h-11 pl-10 pr-3 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                          errors.name
                            ? 'border-error bg-error/5 focus:ring-error/20'
                            : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                        } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-1 text-xs text-error mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="emailAddress"
                      className="text-xs font-semibold text-on-surface"
                    >
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                      <input
                        id="emailAddress"
                        type="email"
                        autoComplete="email"
                        placeholder="name@domain.com"
                        disabled={isFormDisabled}
                        {...register('email', {
                          required: 'Email address is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        className={`w-full h-11 pl-10 pr-3 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
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

                  {/* Phone Number with Country Code Picker */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="phoneInput"
                        className="text-xs font-semibold text-on-surface"
                      >
                        Phone Number
                      </label>
                      <span className="text-[11px] text-on-surface-variant">Required for parcel updates</span>
                    </div>
                    <PhoneInputField
                      id="phoneInput"
                      value={phoneValue}
                      onChange={(val) => {
                        setPhoneValue(val)
                        setValue('phone', val, { shouldValidate: true })
                      }}
                      disabled={isFormDisabled}
                      error={errors.phone?.message}
                    />
                  </div>

                  {/* Password Field with Strength Meter */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="userPassword"
                      className="text-xs font-semibold text-on-surface"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                      <input
                        id="userPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        disabled={isFormDisabled}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          onChange: (e) => setCurrentPassword(e.target.value),
                        })}
                        className={`w-full h-11 pl-10 pr-10 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                          errors.password
                            ? 'border-error bg-error/5 focus:ring-error/20'
                            : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                        } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
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

                    {/* Password Strength Meter */}
                    <div className="p-3 bg-surface-container-low/60 rounded-xl space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Password Strength:</span>
                        <span className={`font-semibold ${strengthInfo.color}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      {/* Segment Bars */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                        <div
                          className={`h-full rounded-full transition-all ${
                            strengthScore >= 1
                              ? strengthScore === 1
                                ? 'bg-error'
                                : strengthScore === 2
                                  ? 'bg-amber-500'
                                  : 'bg-primary'
                              : 'bg-surface-container-highest'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            strengthScore >= 2
                              ? strengthScore === 2
                                ? 'bg-amber-500'
                                : 'bg-primary'
                              : 'bg-surface-container-highest'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            strengthScore >= 3 ? 'bg-primary' : 'bg-surface-container-highest'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            strengthScore === 4 ? 'bg-secondary' : 'bg-surface-container-highest'
                          }`}
                        />
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                        <div
                          className={`flex items-center gap-1.5 ${
                            hasLength ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                          }`}
                        >
                          {hasLength ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-outline shrink-0" />
                          )}
                          <span>At least 8 characters</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 ${
                            hasCase ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                          }`}
                        >
                          {hasCase ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-outline shrink-0" />
                          )}
                          <span>Upper &amp; lowercase letters</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 ${
                            hasNum ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                          }`}
                        >
                          {hasNum ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-outline shrink-0" />
                          )}
                          <span>At least one number</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 ${
                            hasSym ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                          }`}
                        >
                          {hasSym ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-outline shrink-0" />
                          )}
                          <span>Special symbol (!@#$%^&*)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold text-on-surface"
                    >
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        disabled={isFormDisabled}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (val) =>
                            val === getValues('password') || 'Passwords do not match',
                        })}
                        className={`w-full h-11 pl-10 pr-10 bg-surface-container-low/50 focus:bg-surface-container-lowest text-on-surface text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                          errors.confirmPassword
                            ? 'border-error bg-error/5 focus:ring-error/20'
                            : 'border-outline-variant/70 focus:border-primary focus:ring-primary/15'
                        } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label="Toggle confirm password visibility"
                        className="absolute right-3 p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <div className="flex items-center gap-1 text-xs text-error mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.confirmPassword.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Consents Checkboxes */}
                  <div className="space-y-2.5 pt-1 text-left">
                    {/* Terms Checkbox */}
                    <label
                      htmlFor="termsAgreement"
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        id="termsAgreement"
                        disabled={isFormDisabled}
                        {...register('acceptTerms', {
                          validate: (val) =>
                            Boolean(val) || 'You must agree to the Terms of Service to continue',
                          onChange: (e) => {
                            if (e.target.checked) {
                              clearErrors('acceptTerms')
                            }
                          },
                        })}
                        className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary/20 border-outline-variant/70 cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-on-surface-variant leading-relaxed">
                        I agree to the{' '}
                        <span className="text-primary hover:underline font-medium">Terms of Service</span>{' '}
                        and acknowledge the{' '}
                        <span className="text-primary hover:underline font-medium">Privacy Policy</span>.
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <div className="flex items-center gap-1 text-xs text-error mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.acceptTerms.message}</span>
                      </div>
                    )}

                    {/* Marketing Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="marketingOptIn"
                        disabled={isFormDisabled}
                        {...register('marketingOptIn')}
                        className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary/20 border-outline-variant/70 cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-on-surface-variant leading-relaxed">
                        Receive personalized product releases and member rewards by email. (Optional)
                      </span>
                    </label>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    disabled={isFormDisabled}
                    className={`w-full h-11 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm rounded-xl shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer mt-4 ${
                      isFormDisabled ? 'opacity-60 cursor-wait' : ''
                    }`}
                  >
                    {isSubmitting || status === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Registering...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Direct Link to Login */}
                <div className="mt-6 pt-4 text-center border-t border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-primary hover:text-primary-hover hover:underline ml-1"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Member Perks Bento Mosaic */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Perk Card 1: Visual Photography + Welcome Privilege */}
              <div className="relative bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(36,51,49,0.04)] overflow-hidden flex flex-col border border-outline-variant/60 text-left">
                <div className="h-44 w-full relative overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt="Artisan workspace"
                    src="https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=800&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold text-on-surface tracking-wider uppercase">
                      Silver Tier Access
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-on-surface">
                    Instant 100 Reward Points
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Unlock a complimentary 100 reward points upon email confirmation, applicable directly at checkout.
                  </p>
                </div>
              </div>

              {/* Perk Card 2: Interactive Real-Time Delivery Tracker */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(36,51,49,0.04)] p-5 flex flex-col gap-3 border border-outline-variant/60 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Live Parcel Tracking</h4>
                      <p className="text-[11px] text-on-surface-variant">Real-time carrier GPS updates</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold uppercase tracking-wider">
                    Active Hub
                  </span>
                </div>

                {/* Progress bar */}
                <div className="bg-surface-container-low/60 p-3 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span className="font-medium text-on-surface">Order #NX-88210</span>
                    <span className="font-semibold text-primary">Out for Delivery</span>
                  </div>
                  <div className="w-full bg-outline-variant/40 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-3/4" />
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
                    <span>CONFIRMED</span>
                    <span>PACKED</span>
                    <span className="text-primary font-bold">DISPATCHED</span>
                    <span>DELIVERED</span>
                  </div>
                </div>
              </div>

              {/* Perk Card 3: Security & Fraud Defense Guarantee */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(36,51,49,0.04)] p-5 flex items-start gap-3 border border-outline-variant/60 text-left">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-on-surface">Zero-Liability Buyer Protection</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Every checkout under your profile is protected by encrypted tokenized vaults, automated fraud screening, and 30-day hassle-free returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Post-Registration Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center relative border border-outline-variant/60">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-outline hover:text-on-surface p-1 rounded-full cursor-pointer"
              onClick={() => {
                setShowVerificationModal(false)
                navigate(
                  `/verify?email=${encodeURIComponent(registeredEmail)}&name=${encodeURIComponent(registeredName)}`
                )
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge Icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Mail className="w-7 h-7" />
            </div>

            {/* Title & Body */}
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
              Activation Required
            </span>
            <h3 className="text-xl font-bold text-on-surface mb-2">
              Verify your email address
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
              We have transmitted a secure verification code to{' '}
              <span className="font-semibold text-on-surface">
                {getMaskedEmail(registeredEmail)}
              </span>
              . Please enter it to finalize activation.
            </p>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(false)
                  navigate(
                    `/verify?email=${encodeURIComponent(registeredEmail)}&name=${encodeURIComponent(registeredName)}`
                  )
                }}
                className="w-full h-11 bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="resendBtn"
                disabled={resendStatus === 'transmitting'}
                onClick={handleResendVerification}
                className="w-full h-10 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {resendStatus === 'transmitting'
                  ? 'Transmitting...'
                  : resendStatus === 'sent'
                    ? 'Code Dispatched!'
                    : 'Resend verification code'}
              </button>
            </div>

            {resendStatus === 'sent' && (
              <div className="mt-3 text-xs text-primary font-medium flex items-center gap-1.5 animate-fade-in">
                <Send className="w-3.5 h-3.5" />
                <span>A fresh code was sent to your email!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reusable Auth Footer */}
      <AuthFooter />
    </div>
  )
}
