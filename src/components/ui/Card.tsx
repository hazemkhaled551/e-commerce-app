import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hoverable?: boolean
  className?: string
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-card rounded-lg border border-border-divider shadow-xs overflow-hidden ${
        hoverable
          ? 'hover:shadow-md hover:border-border-active hover:-translate-y-0.5 transition-all duration-200'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
