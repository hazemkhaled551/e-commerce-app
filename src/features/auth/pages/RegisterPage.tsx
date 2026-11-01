import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
    if (strengthScore === 0) return { text: 'None', color: 'text-on-surface-variant' }
    if (strengthScore === 1) return { text: 'Weak', color: 'text-error' }
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-600' }
    if (strengthScore === 3) return { text: 'Strong', color: 'text-primary' }
    return { text: 'Excellent', color: 'text-tertiary-container' }
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
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AuthHeader />

      {/* Main Content Area */}
      <main className="w-full pt-28 sm:pt-32 pb-16 sm:pb-24 flex-1 flex flex-col justify-center items-center px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin">
            {/* Breadcrumb & Trust Banner Pill */}
        

            {/* Main Asymmetric Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Primary Account Registration Form */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl relative overflow-hidden border border-outline-variant/30">
                  {/* Decorative subtle gradient glow */}
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Section */}
                  <div className="flex flex-col gap-space-xs mb-space-lg relative z-10 text-left">
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                      Member Onboarding
                    </span>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                      Create your Nexa account
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Join Nexa Store to earn reward points, track parcels live, and access exclusive member deals.
                    </p>
                  </div>

                  {/* Email Already Registered Banner (Triggered dynamically from Backend) */}
                  {emailConflict && (
                    <div
                      className="mb-space-md p-space-md bg-surface-container-high rounded-lg flex items-start justify-between gap-space-sm transition-all duration-200 animate-fade-in"
                      id="emailConflictBanner"
                    >
                      <div className="flex items-start gap-space-sm text-left">
                        <span
                          className="material-symbols-outlined text-error text-[20px] mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          error
                        </span>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-on-surface text-[15px]">
                            Email already in our system
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            An account under{' '}
                            <span className="font-medium text-on-surface">{emailConflict}</span>{' '}
                            exists.
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/login"
                        className="px-space-sm py-1 bg-surface-container-lowest text-primary font-body-sm text-body-sm rounded-lg shadow-xs hover:bg-surface-container transition-colors whitespace-nowrap"
                      >
                        Sign In instead
                      </Link>
                    </div>
                  )}

                  {/* General Backend Error Banner */}
                  {generalError && (
                    <div className="mb-space-md p-space-md bg-error-container text-on-error-container rounded-lg flex items-start justify-between gap-space-sm animate-fade-in text-left">
                      <div className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-error text-[20px] mt-0.5">
                          error
                        </span>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-semibold">
                            Registration Failed
                          </span>
                          <span className="font-body-sm text-body-sm">{generalError}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGeneralError(null)}
                        className="text-on-error-container hover:opacity-75 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  )}

                  {/* The Registration Form (react-hook-form) */}
                  <form
                    className="flex flex-col gap-space-md relative z-10"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    {/* Full Name */}
                    <div className="flex flex-col gap-space-xs text-left">
                      <label
                        htmlFor="fullName"
                        className="font-body-md text-body-md font-medium text-on-surface flex items-center justify-between"
                      >
                        <span>Full Name</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Required
                        </span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                          badge
                        </span>
                        <input
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. Sarah Jenkins"
                          disabled={isFormDisabled}
                          {...register('name', {
                            required: 'Full name is required',
                            minLength: {
                              value: 2,
                              message: 'Full name must be at least 2 characters',
                            },
                          })}
                          className={`w-full h-11 pl-10 pr-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-xs border transition-all ${
                            errors.name
                              ? 'border-error bg-error-container/20 focus:ring-error'
                              : 'border-outline-variant/40 focus:bg-surface-container-low focus:ring-primary'
                          } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      {errors.name && (
                        <span className="text-error font-body-sm text-body-sm flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          <span>{errors.name.message}</span>
                        </span>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-space-xs text-left">
                      <label
                        htmlFor="emailAddress"
                        className="font-body-md text-body-md font-medium text-on-surface"
                      >
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                          mail
                        </span>
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
                              message: 'Please provide a valid email format',
                            },
                          })}
                          className={`w-full h-11 pl-10 pr-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-xs border transition-all ${
                            errors.email
                              ? 'border-error bg-error-container/20 focus:ring-error'
                              : 'border-outline-variant/40 focus:bg-surface-container-low focus:ring-primary'
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

                    {/* Phone Number with Country Code Picker */}
                    <div className="flex flex-col gap-space-xs text-left">
                      <label
                        htmlFor="phoneInput"
                        className="font-body-md text-body-md font-medium text-on-surface flex items-center justify-between"
                      >
                        <span>Phone Number</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Required
                        </span>
                      </label>
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
                    <div className="flex flex-col gap-space-xs text-left">
                      <label
                        htmlFor="userPassword"
                        className="font-body-md text-body-md font-medium text-on-surface"
                      >
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                          lock
                        </span>
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
                          className={`w-full h-11 pl-10 pr-10 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-xs border transition-all ${
                            errors.password
                              ? 'border-error bg-error-container/20 focus:ring-error'
                              : 'border-outline-variant/40 focus:bg-surface-container-low focus:ring-primary'
                          } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label="Toggle password visibility"
                          className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 rounded-full flex items-center justify-center cursor-pointer"
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

                      {/* Real-Time Password Strength Meter */}
                      <div className="mt-space-xs p-space-sm bg-surface-container rounded-lg flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                            Security Level:
                          </span>
                          <span
                            className={`font-label-caps text-label-caps font-semibold ${strengthInfo.color}`}
                          >
                            {strengthInfo.text}
                          </span>
                        </div>
                        {/* Strength Segment Bars */}
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
                              strengthScore === 4
                                ? 'bg-tertiary-container'
                                : 'bg-surface-container-highest'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs mt-space-xs pt-space-xs">
                        <div
                          className={`flex items-center gap-space-xs font-body-sm text-body-sm ${
                            hasLength ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              hasLength ? 'text-tertiary-container' : 'text-outline-variant'
                            }`}
                            style={hasLength ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {hasLength ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>At least 8 characters</span>
                        </div>

                        <div
                          className={`flex items-center gap-space-xs font-body-sm text-body-sm ${
                            hasCase ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              hasCase ? 'text-tertiary-container' : 'text-outline-variant'
                            }`}
                            style={hasCase ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {hasCase ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Uppercase &amp; lowercase letters</span>
                        </div>

                        <div
                          className={`flex items-center gap-space-xs font-body-sm text-body-sm ${
                            hasNum ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              hasNum ? 'text-tertiary-container' : 'text-outline-variant'
                            }`}
                            style={hasNum ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {hasNum ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>At least one number (0-9)</span>
                        </div>

                        <div
                          className={`flex items-center gap-space-xs font-body-sm text-body-sm ${
                            hasSym ? 'text-on-surface' : 'text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              hasSym ? 'text-tertiary-container' : 'text-outline-variant'
                            }`}
                            style={hasSym ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {hasSym ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Special symbol (!@#$%^&amp;*)</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-space-xs text-left">
                      <label
                        htmlFor="confirmPassword"
                        className="font-body-md text-body-md font-medium text-on-surface"
                      >
                        Confirm Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                          verified
                        </span>
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
                          className={`w-full h-11 pl-10 pr-10 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-xs border transition-all ${
                            errors.confirmPassword
                              ? 'border-error bg-error-container/20 focus:ring-error'
                              : 'border-outline-variant/40 focus:bg-surface-container-low focus:ring-primary'
                          } ${isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label="Toggle confirm password visibility"
                          className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>

                      {errors.confirmPassword && (
                        <div className="flex items-center gap-space-xs text-error font-body-sm text-body-sm mt-1">
                          <span className="material-symbols-outlined text-[16px]">warning</span>
                          <span>{errors.confirmPassword.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Agreements & Consents Checkboxes */}
                    <div className="flex flex-col gap-space-sm pt-space-xs text-left">
                      {/* Terms Checkbox */}
                      <label
                        htmlFor="termsAgreement"
                        className="flex items-start gap-space-sm cursor-pointer select-none"
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
                          className="w-4 h-4 mt-1 rounded text-primary focus:ring-primary cursor-pointer border-outline-variant"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                          I agree to the Nexa Retail{' '}
                          <a
                            href="#terms"
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary underline hover:text-secondary font-medium"
                          >
                            Terms of Service
                          </a>{' '}
                          and acknowledge the{' '}
                          <a
                            href="#privacy"
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary underline hover:text-secondary font-medium"
                          >
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <span className="text-error font-body-sm text-body-sm flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          <span>{errors.acceptTerms.message}</span>
                        </span>
                      )}

                      {/* Marketing Checkbox */}
                      <label className="flex items-start gap-space-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id="marketingOptIn"
                          disabled={isFormDisabled}
                          {...register('marketingOptIn')}
                          className="w-4 h-4 mt-1 rounded text-primary-container focus:ring-0 cursor-pointer border-outline-variant"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                          Receive personalized discounts, flash-sale early access, and curated lifestyle digests via email. (Optional)
                        </span>
                      </label>
                    </div>

                    {/* Primary Submission CTA Button */}
                    <div className="flex flex-col gap-space-sm pt-space-xs">
                      <button
                        type="submit"
                        disabled={isFormDisabled}
                        className={`w-full h-12 bg-primary hover:bg-secondary text-on-primary font-body-lg text-body-lg font-semibold rounded-lg shadow-md flex items-center justify-center gap-space-sm active:scale-[0.99] transition-all cursor-pointer ${
                          isFormDisabled ? 'opacity-80 cursor-wait' : ''
                        }`}
                      >
                        {isSubmitting || status === 'loading' ? (
                          <>
                            <span>Verifying &amp; Registering...</span>
                            <span className="material-symbols-outlined animate-spin text-[20px]">
                              progress_activity
                            </span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-[20px]">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Divider & Existing User Direct Link */}
                  <div className="mt-space-lg pt-space-md flex flex-col items-center gap-space-xs bg-surface-container-low -mx-space-lg -mb-space-lg md:-mx-space-xl md:-mb-space-xl p-space-md">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="font-semibold text-primary hover:text-secondary underline underline-offset-4 ml-1"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Member Perks Bento Mosaic & Visual Anchor */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                {/* Perk Card 1: Visual Photography + Welcome Bonus */}
                <div className="relative bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/30 text-left">
                  <div className="h-44 w-full relative overflow-hidden bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt="Modern Scandinavian retail interior"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcfhuSk2ty22G2PNPzG4DqP0ScLMa-uPIDdpCCNTd4hjpRvsE7LkEwcj1WRnHcrzVgrwG-vz_jbuWa_HrZy0o_piqfcZW9aV_WbY-RD1J3wzuGL21j1mB64yOXQkf6imPbx73AhZwHqogupbR62ke4ZoAjL8j2uAgl_nkQh5NKBp9PPJKL912WZa-T3I5o1VIfY9nQd-L1Ci5wKHuAzPR-khtlwGlG2j682U-go_v78DYmnlDElFG-Dg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <span
                        className="material-symbols-outlined text-primary text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        stars
                      </span>
                      <span className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">
                        TIER 1 SILVER MEMBER
                      </span>
                    </div>
                  </div>
                  <div className="p-space-md flex flex-col gap-space-xs">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Instant Welcome Privilege
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Unlock a complimentary 100 Reward Points immediately upon email confirmation, applicable directly at checkout.
                    </p>
                  </div>
                </div>

                {/* Perk Card 2: Interactive Real-Time Delivery Tracker Preview */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col gap-space-sm border border-outline-variant/30 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">
                          local_shipping
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface text-[15px]">
                          Live Parcel Tracking
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Precision GPS updates direct to device
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-caps text-label-caps rounded-full font-semibold">
                      Active Hub
                    </span>
                  </div>

                  {/* Micro Progress Diagram Inline SVG */}
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
                    <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                      <span>Order #NX-88210</span>
                      <span className="font-medium text-secondary">Out for Delivery</span>
                    </div>
                    <svg
                      className="w-full h-8 text-primary"
                      fill="none"
                      viewBox="0 0 320 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Bar */}
                      <line
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeOpacity="0.15"
                        strokeWidth="4"
                        x1="16"
                        x2="304"
                        y1="16"
                        y2="16"
                      />
                      {/* Active Progress */}
                      <line
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="4"
                        x1="16"
                        x2="230"
                        y1="16"
                        y2="16"
                      />
                      {/* Checkpoints */}
                      <circle cx="16" cy="16" fill="currentColor" r="6" />
                      <circle cx="110" cy="16" fill="currentColor" r="6" />
                      <circle
                        cx="210"
                        cy="16"
                        fill="white"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <circle cx="304" cy="16" fill="currentColor" fillOpacity="0.2" r="5" />
                    </svg>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                      <span>CONFIRMED</span>
                      <span>PACKED</span>
                      <span className="text-primary font-bold">DISPATCHED</span>
                      <span>DELIVERED</span>
                    </div>
                  </div>
                </div>

                {/* Perk Card 3: Security & Fraud Defense Guarantee */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex items-start gap-space-sm border border-outline-variant/30 text-left">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-container shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface text-[15px]">
                      Zero Liability Purchase Shield
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Every checkout under your Nexa profile is covered by automated fraud protection, encrypted tokenized vaults, and hassle-free 30-day returns.
                    </p>
                  </div>
                </div>

                {/* Trust Badges Bar */}
                <div className="flex items-center justify-around py-space-sm px-space-md bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      lock_clock
                    </span>
                    <span>AES-256</span>
                  </div>
                  <div className="h-4 w-px bg-outline-variant/30" />
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      credit_card
                    </span>
                    <span>PCI-DSS Level 1</span>
                  </div>
                  <div className="h-4 w-px bg-outline-variant/30" />
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      workspace_premium
                    </span>
                    <span>GDPR Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Post-Registration Email Verification Modal Overlay */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-xl flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/30">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              onClick={() => {
                setShowVerificationModal(false)
                navigate(
                  `/verify?email=${encodeURIComponent(registeredEmail)}&name=${encodeURIComponent(registeredName)}`
                )
              }}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Badge Icon */}
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-space-md">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mark_email_read
              </span>
            </div>

            {/* Title & Body */}
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-widest mb-1">
              Activation Required
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
              Verify your email address
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
              We have transmitted a secure confirmation link to{' '}
              <span className="font-semibold text-on-surface">
                {getMaskedEmail(registeredEmail)}
              </span>
              . Please click the link inside within 24 hours to finalize activation.
            </p>

            {/* Security Notice Card */}
            <div className="w-full bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm text-left mb-space-lg">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                info
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Didn&apos;t find it? Check your Spam or Promotions folder.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(false)
                  navigate(
                    `/verify?email=${encodeURIComponent(registeredEmail)}&name=${encodeURIComponent(registeredName)}`
                  )
                }}
                className="w-full h-11 bg-primary hover:bg-secondary text-on-primary font-body-md text-body-md font-semibold rounded-lg shadow-xs flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <button
                type="button"
                id="resendBtn"
                disabled={resendStatus === 'transmitting'}
                onClick={handleResendVerification}
                className="w-full h-10 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm rounded-lg transition-colors cursor-pointer"
              >
                {resendStatus === 'transmitting'
                  ? 'Transmitting...'
                  : resendStatus === 'sent'
                    ? 'Link Dispatched!'
                    : 'Resend verification email'}
              </button>
            </div>

            {resendStatus === 'sent' && (
              <div className="mt-space-sm text-secondary font-body-sm text-body-sm flex items-center gap-1 animate-fade-in">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>A fresh link was transmitted!</span>
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
