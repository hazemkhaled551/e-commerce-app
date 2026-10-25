import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-core mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-neutral-placeholder">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-[42px] bg-surface-card border rounded-lg text-sm text-neutral-core placeholder:text-neutral-placeholder focus:outline-none focus:ring-2 focus:ring-action-primary/15 focus:border-action-primary transition-colors ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} ${
            error
              ? 'border-stock-out focus:border-stock-out focus:ring-stock-out/15'
              : 'border-border-divider'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-neutral-placeholder">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-stock-out font-medium">{error}</p>}
    </div>
  )
}
