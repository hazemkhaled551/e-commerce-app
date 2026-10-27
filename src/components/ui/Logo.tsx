import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type LogoSize = 'sm' | 'md' | 'lg'

export interface LogoProps {
  /** Size variant controlling icon mark dimensions and typography */
  size?: LogoSize
  /** Whether to wrap the logo in a React Router Link (default: true) */
  asLink?: boolean
  /** Navigation destination when rendered as Link (default: '/') */
  to?: string
  /** Click callback (e.g. to reset categories or trigger navigation side-effects) */
  onClick?: () => void
  /** Whether to show the "NexaStore" brand text (default: true) */
  showText?: boolean
  /** Additional custom subtitle or badge below or next to the brand title */
  subtitle?: ReactNode
  /** Additional custom class names for the outer container */
  className?: string
  /** Additional custom class names for the "N" icon mark */
  iconClassName?: string
  /** Additional custom class names for the brand text */
  textClassName?: string
  /** Accessible label for screen readers */
  ariaLabel?: string
}

const sizeStyles: Record<
  LogoSize,
  {
    container: string
    icon: string
    text: string
  }
> = {
  sm: {
    container: 'gap-2.5',
    icon: 'w-8 h-8 rounded-lg text-base shadow-sm',
    text: 'font-headline-sm text-headline-sm font-bold text-on-surface leading-none',
  },
  md: {
    container: 'gap-3',
    icon: 'w-9 h-9 rounded-xl font-headline-sm shadow-md',
    text: 'font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface leading-none',
  },
  lg: {
    container: 'gap-3.5',
    icon: 'w-11 h-11 rounded-2xl text-xl font-headline-sm shadow-lg',
    text: 'font-headline-sm text-xl font-bold tracking-tight text-on-surface leading-none',
  },
}

export function Logo({
  size = 'md',
  asLink = true,
  to = '/',
  onClick,
  showText = true,
  subtitle,
  className = '',
  iconClassName = '',
  textClassName = '',
  ariaLabel = 'NexaStore Home',
}: LogoProps) {
  const styles = sizeStyles[size]

  const content = (
    <>
      <div
        className={`bg-primary text-on-primary flex items-center justify-center font-bold select-none group-hover:scale-105 transition-transform shrink-0 ${styles.icon} ${iconClassName}`}
        aria-hidden="true"
      >
        N
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${styles.text} ${textClassName}`}>
            NexaStore
          </span>
          {subtitle}
        </div>
      )}
    </>
  )

  if (asLink) {
    return (
      <Link
        to={to}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex items-center shrink-0 cursor-pointer group ${styles.container} ${className}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center shrink-0 ${styles.container} ${className}`}
    >
      {content}
    </div>
  )
}
