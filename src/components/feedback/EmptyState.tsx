import type { ReactNode } from 'react'
import { PackageOpen } from 'lucide-react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center text-action-primary mb-4 shadow-xs">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-core mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-subdued max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
