import { useState } from 'react'
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
      className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-space-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-surface-container-lowest shadow-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center gap-space-sm text-error">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Cancel and Refund Order?
            </h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Order Reference: {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <p className="font-body-md text-body-md text-on-surface-variant">
          This action will instantly refund{' '}
          <strong className="text-on-surface font-semibold">
            ${order.totalPrice.toFixed(2)}
          </strong>{' '}
          back to {order.customerName} via original payment method, restore reserved inventory to stock, and invalidate the warehouse dispatch queue item.
        </p>

        {/* Customer notification checkbox */}
        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-2 text-body-sm text-on-surface-variant border border-outline-variant/20">
          <input
            id="notify-cust"
            type="checkbox"
            checked={notifyCustomer}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
            className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
          />
          <label htmlFor="notify-cust" className="cursor-pointer text-on-surface">
            Send automated cancellation email notification to customer
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-space-xs mt-space-xs pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => onConfirmCancel(order, notifyCustomer)}
            className="h-9 px-space-md rounded-xl bg-error text-on-error hover:bg-on-error-container font-body-sm text-body-sm font-semibold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  )
}

