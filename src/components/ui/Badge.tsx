import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'limited'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  icon?: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface-variant border-outline-variant/60',
  primary: 'bg-surface-container-high text-primary border-primary/25',
  success: 'bg-stock-in-bg text-stock-in border-stock-in/25',
  warning: 'bg-stock-low-bg text-stock-low border-stock-low/35',
  danger: 'bg-stock-out-bg text-stock-out border-stock-out/35',
  accent: 'bg-primary text-on-primary border-primary shadow-xs',
  limited: 'bg-stock-low-bg text-stock-low border-stock-low/35 font-bold',
}

export function Badge({ children, variant = 'default', className = '', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  )
}
