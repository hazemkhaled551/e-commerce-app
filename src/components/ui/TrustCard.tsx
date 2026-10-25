import type { ReactNode } from 'react'

export interface TrustCardProps {
  icon: ReactNode
  title: string
  description: string
  variant?: 'horizontal' | 'vertical'
  className?: string
}

export function TrustCard({
  icon,
  title,
  description,
  variant = 'horizontal',
  className = '',
}: TrustCardProps) {
  if (variant === 'vertical') {
    return (
      <div className={`bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col ${className}`}>
        <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-4 shrink-0">
          {icon}
        </div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-sm ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-body-md text-body-md font-bold text-on-surface">{title}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
      </div>
    </div>
  )
}
