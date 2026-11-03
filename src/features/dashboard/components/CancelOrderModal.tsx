import { useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import type { DashboardOrder } from '../types/dashboard'

interface CancelOrderModalProps {
  isOpen: boolean
  order: DashboardOrder | null
  onClose: () => void
  onConfirmCancel: (order: DashboardOrder, notifyCustomer: boolean) => void
}

export function CancelOrderModal({
  isOpen,
  order,
  onClose,
  onConfirmCancel,
}: CancelOrderModalProps) {
  const [notifyCustomer, setNotifyCustomer] = useState(true)

  if (!isOpen || !order) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest shadow-2xl p-6 flex flex-col gap-4 border border-outline-variant/60 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              Cancel &amp; Refund Order?
            </h3>
            <span className="text-xs text-on-surface-variant font-mono">
              Reference: {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          This action will immediately refund{' '}
          <strong className="text-on-surface font-semibold font-mono">
            ${order.totalPrice.toFixed(2)}
          </strong>{' '}
          back to {order.customerName} via their original payment method, release reserved inventory units back to catalog stock, and revoke the warehouse dispatch request.
        </p>

        {/* Customer notification checkbox */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 flex items-center gap-2.5 text-xs text-on-surface border border-outline-variant/50">
          <input
            id="notify-cust"
            type="checkbox"
            checked={notifyCustomer}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
            className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
          />
          <label htmlFor="notify-cust" className="cursor-pointer">
            Send automated cancellation email notification to customer
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/50"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={() => onConfirmCancel(order, notifyCustomer)}
            className="h-9 px-4 rounded-xl bg-error text-on-error hover:bg-rose-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  )
}
