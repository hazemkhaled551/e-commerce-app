import { useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Truck,
  CreditCard,
  PauseCircle,
  RefreshCw,
  Package,
  Archive,
  X,
} from 'lucide-react'

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary' | 'success'
  icon?:
    | 'alert'
    | 'trash'
    | 'check'
    | 'truck'
    | 'creditCard'
    | 'pause'
    | 'refresh'
    | 'package'
    | 'archive'
  badgeText?: string
  itemDetails?: {
    label: string
    value: string
  }[]
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'primary',
  icon = 'alert',
  badgeText,
  itemDetails,
  isLoading = false,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isLoading])

  if (!isOpen) return null

  const renderIcon = () => {
    const iconClass = 'w-5 h-5'
    switch (icon) {
      case 'trash':
        return <Trash2 className={iconClass} />
      case 'check':
        return <CheckCircle2 className={iconClass} />
      case 'truck':
        return <Truck className={iconClass} />
      case 'creditCard':
        return <CreditCard className={iconClass} />
      case 'pause':
        return <PauseCircle className={iconClass} />
      case 'refresh':
        return <RefreshCw className={iconClass} />
      case 'package':
        return <Package className={iconClass} />
      case 'archive':
        return <Archive className={iconClass} />
      case 'alert':
      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  const getIconContainerStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-error/10 text-error border-error/20'
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'primary':
      default:
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-error hover:bg-error/90 text-on-error shadow-xs'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
      case 'success':
        return 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
      case 'primary':
      default:
        return 'bg-primary hover:bg-primary-hover text-on-primary shadow-xs'
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) onClose()
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden z-10 p-6 flex flex-col gap-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute right-4 top-4 p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header: Icon & Title */}
        <div className="flex items-start gap-3.5 pr-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getIconContainerStyle()}`}
          >
            {renderIcon()}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                id="confirm-modal-title"
                className="text-base font-bold text-on-surface tracking-tight"
              >
                {title}
              </h3>
              {badgeText && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/50">
                  {badgeText}
                </span>
              )}
            </div>
            {description && (
              <div className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                {description}
              </div>
            )}
          </div>
        </div>

        {/* Optional Item Details Card */}
        {itemDetails && itemDetails.length > 0 && (
          <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 flex flex-col gap-2 text-xs">
            {itemDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-0.5 border-b border-outline-variant/30 last:border-b-0"
              >
                <span className="text-on-surface-variant font-medium">
                  {detail.label}:
                </span>
                <span className="font-semibold text-on-surface font-mono">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-outline-variant/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${getConfirmButtonStyle()}`}
          >
            {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

