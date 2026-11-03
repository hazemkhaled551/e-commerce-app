import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary hover:bg-secondary text-on-primary shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 border border-transparent',
  secondary:
    'bg-surface-container-high hover:bg-surface-container-highest text-primary hover:-translate-y-0.5 active:translate-y-0 border border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 shadow-xs',
  outline:
    'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/80 hover:border-outline hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 shadow-xs',
  ghost:
    'bg-transparent hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface active:bg-surface-container border border-transparent shadow-none',
  danger:
    'bg-stock-out hover:bg-stock-out/90 text-white shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-stock-out/25 focus-visible:ring-offset-2 border border-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5 min-h-[32px]',
  md: 'px-4.5 py-2.5 text-sm font-semibold rounded-xl gap-2 min-h-[42px]',
  lg: 'px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5 min-h-[50px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-body-md transition-all duration-200 cursor-pointer select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
}
