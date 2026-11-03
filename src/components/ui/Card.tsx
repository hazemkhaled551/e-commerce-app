import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hoverable?: boolean
  className?: string
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-[0_4px_20px_rgba(36,51,49,0.03)] overflow-hidden ${
        hoverable
          ? 'hover:shadow-[0_12px_32px_rgba(36,51,49,0.08)] hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
