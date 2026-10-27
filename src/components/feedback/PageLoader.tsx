import { Spinner } from '@/components/ui/Spinner'
import { Logo } from '@/components/ui/Logo'

export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex-1 min-h-[50vh] flex flex-col items-center justify-center gap-3 p-8"
    >
      <Spinner size="lg" />
      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
        Loading...
      </span>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-background p-6"
    >
      <Logo size="lg" asLink={false} />
      <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
        <Spinner size="sm" />
        <span>Loading...</span>
      </div>
    </div>
  )
}
