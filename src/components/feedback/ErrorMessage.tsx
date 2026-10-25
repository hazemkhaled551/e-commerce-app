import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-stock-out-bg border border-stock-out/25 p-6 text-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-stock-out/10 text-stock-out flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-stock-out mb-1">{title}</h4>
      <p className="text-sm text-stock-out/90 mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="border-stock-out/30 text-stock-out hover:bg-stock-out-bg"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
