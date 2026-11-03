import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Printer,
  Receipt,
  Truck,
  Ban,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import type { OrderDetailFull } from '../../types/orderDetails'

interface OrderDetailHeaderProps {
  order: OrderDetailFull
  onPrintSlip: () => void
  onCommercialInvoice: () => void
  onCancelClick: () => void
  onFulfillClick: () => void
}

export function OrderDetailHeader({
  order,
  onPrintSlip,
  onCommercialInvoice,
  onCancelClick,
  onFulfillClick,
}: OrderDetailHeaderProps) {
  const isPaid = order.paymentStatus === 'paid'
  const isFulfilled =
    order.fulfillmentStatus === 'in_transit' || order.fulfillmentStatus === 'delivered'
  const isCancelled = order.fulfillmentStatus === 'cancelled'

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* 1. Context & Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover transition-colors text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant/50">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-medium">
            {order.warehouseLocation} • {order.warehouseZone}
          </span>
        </div>
      </div>

      {/* 2. Main Order Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-outline-variant/60 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex flex-col gap-2">
          {/* Title and Status Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
              Order {order.orderNumber}
            </h1>

            {/* Payment Badge */}
            {isPaid ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Paid</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Payment Pending</span>
              </span>
            )}

            {/* Fulfillment Status Badge */}
            {isCancelled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 text-xs font-semibold border border-red-200">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>Cancelled</span>
              </span>
            ) : isFulfilled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                <Truck className="w-3 h-3 text-teal-600" />
                <span>{order.fulfillmentStatus === 'delivered' ? 'Delivered' : 'In Transit'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Unfulfilled ({order.items.length} items)</span>
              </span>
            )}

            {/* Shipping Tier Badge */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/25">
              {order.shippingTier}
            </span>
          </div>

          {/* Timestamp and Channel Metadata */}
          <p className="text-xs text-on-surface-variant flex items-center gap-1.5 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-on-surface-variant/80 shrink-0" />
            <span>
              {order.placedDateText} via{' '}
              <strong className="text-on-surface font-semibold">{order.channelName}</strong> (Channel ID:{' '}
              <span className="font-mono">{order.channelId}</span>)
            </span>
          </p>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPrintSlip}
            className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60 shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4 text-on-surface-variant" />
            <span>Print Packing Slip</span>
          </button>

          <button
            type="button"
            onClick={onCommercialInvoice}
            className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60 shadow-xs active:scale-95"
          >
            <Receipt className="w-4 h-4 text-on-surface-variant" />
            <span className="hidden sm:inline">Commercial Invoice</span>
          </button>

          {!isCancelled && (
            <button
              type="button"
              onClick={onCancelClick}
              className="h-9 px-3 rounded-xl bg-error/10 hover:bg-error/15 text-error text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border border-error/20 shadow-xs active:scale-95"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          {!isFulfilled && !isCancelled && (
            <button
              type="button"
              onClick={onFulfillClick}
              className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ml-1"
            >
              <Truck className="w-4 h-4" />
              <span>Fulfill Items &amp; Generate Label</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

