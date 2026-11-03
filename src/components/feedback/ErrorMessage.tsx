import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`rounded-2xl bg-stock-out-bg border border-stock-out/25 p-6 text-center max-w-md mx-auto my-8 shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-stock-out/15 text-stock-out flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-stock-out mb-1.5 tracking-tight">{title}</h4>
      <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="border-stock-out/30 text-stock-out hover:bg-stock-out-bg hover:border-stock-out/50"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
