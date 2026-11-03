import type { ReactNode } from 'react'

export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
  hasDivider?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  hasDivider = true,
  className = '',
}: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div
        className={`max-w-2xl mx-auto text-center flex flex-col items-center mb-10 ${
          hasDivider ? 'pb-6 border-b border-outline-variant/60' : ''
        } ${className}`}
      >
        {eyebrow && (
          <span className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 ${
        hasDivider ? 'pb-4 border-b border-outline-variant/60' : ''
      } ${className}`}
    >
      <div className="max-w-xl">
        {eyebrow && (
          <span className="text-xs font-semibold text-primary tracking-wider uppercase block mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="self-start md:self-end shrink-0">{action}</div>}
    </div>
  )
}

