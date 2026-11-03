import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-on-surface mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`w-full h-[42px] bg-surface-container-low focus:bg-surface-container-lowest border rounded-xl text-sm text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all disabled:opacity-50 disabled:bg-surface-container disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-stock-out focus:border-stock-out focus:ring-stock-out/15'
              : 'border-outline-variant/70'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-outline">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-stock-out font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-on-surface-variant">{helperText}</p>
      )}
    </div>
  )
}
