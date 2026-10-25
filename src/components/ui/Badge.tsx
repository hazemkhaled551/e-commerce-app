import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'limited'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-slate text-neutral-subdued border-border-divider',
  primary: 'bg-filter-active-bg text-filter-active-text border-filter-active-border',
  success: 'bg-stock-in-bg text-stock-in border-stock-in/20',
  warning: 'bg-stock-low-bg text-stock-low border-stock-low/20',
  danger: 'bg-stock-out-bg text-stock-out border-stock-out/20',
  accent: 'bg-action-primary text-on-primary border-action-primary',
  limited: 'bg-stock-low-bg text-stock-low border-stock-low/30 font-bold',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
