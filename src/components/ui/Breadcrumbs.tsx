import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHomeIcon?: boolean
}

export function Breadcrumbs({
  items,
  className = '',
  showHomeIcon = true,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-on-surface-variant font-body-sm flex-wrap ${className}`}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span
                  className="material-symbols-outlined text-xs text-outline select-none"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-on-surface truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {isFirst && showHomeIcon && (
                    <span className="material-symbols-outlined text-sm">home</span>
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

