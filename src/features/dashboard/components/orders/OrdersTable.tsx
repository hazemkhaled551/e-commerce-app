import { Link } from 'react-router-dom'
import {
  Globe,
  Smartphone,
  Store,
  ExternalLink,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Hourglass,
  Package,
} from 'lucide-react'
import type { DashboardOrder } from '../../types/dashboard'

interface OrdersTableProps {
  orders: DashboardOrder[]
  selectedOrderIds: string[]
  onToggleSelectOrder: (orderId: string) => void
  onToggleSelectAll: () => void
  onRowActionClick: (order: DashboardOrder, actionType: string) => void
}

export function OrdersTable({
  orders,
  selectedOrderIds,
  onToggleSelectOrder,
  onToggleSelectAll,

  onRowActionClick,
}: OrdersTableProps) {
  const isAllSelected =
    orders.length > 0 && orders.every((o) => selectedOrderIds.includes(o.id))

  const renderChannelIcon = (channel: string) => {
    if (channel.toLowerCase().includes('pos')) {
      return <Store className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
    }
    if (channel.toLowerCase().includes('mobile') || channel.toLowerCase().includes('app')) {
      return <Smartphone className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
    }
    return <Globe className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
  }

  const renderPaymentBadge = (order: DashboardOrder) => {
    switch (order.paymentStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Paid</span>
          </span>
        )
      case 'pending_wire':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            <span>Authorized Pending</span>
          </span>
        )
      case 'failed':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Payment Failed</span>
            </span>
            {order.failureReason && (
              <span className="text-[10px] text-red-700 font-medium truncate max-w-[140px]">
                {order.failureReason}
              </span>
            )}
          </div>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Refunded</span>
          </span>
        )
    }
  }

  const renderFulfillmentBadge = (order: DashboardOrder) => {
    if (order.fulfillmentStatus === 'unfulfilled' || order.fulfillmentStatus === 'unfulfilled_priority') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Unfulfilled</span>
          </span>
          {order.slaRemainingText && (
            <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
              {order.slaRemainingText}
            </span>
          )}
        </div>
      )
    }
    if (order.fulfillmentStatus === 'in_transit') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 w-fit">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
          {order.trackingNumber && (
            <span className="text-[10px] text-on-surface-variant font-mono truncate max-w-[150px]">
              {order.trackingNumber}
            </span>
          )}
        </div>
      )
    }
    if (order.fulfillmentStatus === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Delivered</span>
        </span>
      )
    }
    if (order.fulfillmentStatus === 'on_hold') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
          <Hourglass className="w-3 h-3 text-stone-500" />
          <span>On Hold</span>
        </span>
      )
    }
    if (order.fulfillmentStatus === 'returned') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/60 w-fit">
            <RotateCcw className="w-3 h-3" />
            <span>Returned</span>
          </span>
          {order.rmaReason && (
            <span className="text-[10px] text-on-surface-variant truncate max-w-[150px]">
              {order.rmaReason}
            </span>
          )}
        </div>
      )
    }
    if (order.fulfillmentStatus === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <span>Cancelled</span>
        </span>
      )
    }
    return null
  }

  const getPrimaryActionLabel = (order: DashboardOrder) => {
    if (order.fulfillmentStatus.startsWith('unfulfilled')) return 'Fulfill'
    if (order.fulfillmentStatus === 'in_transit') return 'Track'
    if (order.fulfillmentStatus === 'delivered') return 'Receipt'
    if (order.paymentStatus === 'pending_wire') return 'Capture'
    if (order.paymentStatus === 'failed') return 'Send Recovery Link'
    if (order.fulfillmentStatus === 'returned') return 'RMA Details'
    return 'Details'
  }

  return (
    <div className="rounded-2xl bg-white shadow-xs border border-outline-variant/60 overflow-hidden mb-6">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider select-none border-b border-outline-variant/60">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 min-w-[170px]">Order &amp; Channel</th>
              <th className="py-3 px-3 min-w-[140px]">Date &amp; Time</th>
              <th className="py-3 px-3 min-w-[180px]">Customer</th>
              <th className="py-3 px-3 min-w-[160px]">Purchased Items</th>
              <th className="py-3 px-3 text-right min-w-[110px]">Total</th>
              <th className="py-3 px-3 min-w-[140px]">Payment</th>
              <th className="py-3 px-3 min-w-[160px]">Fulfillment</th>
              <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-xs text-on-surface">
            {orders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id)
              const actionLabel = getPrimaryActionLabel(order)

              return (
                <tr
                  key={order.id}
                  className={`transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-stone-50/80 bg-white'
                    }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOrder(order.id)}
                      className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
                    />
                  </td>

                  {/* Order & Channel */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col min-w-0">
                      <Link
                        to={`/admin/orders/${order.orderNumber.replace('#', '')}`}
                        className="font-bold text-primary hover:underline text-sm flex items-center gap-1 cursor-pointer text-left w-fit"
                      >
                        <span>{order.orderNumber}</span>
                        <ExternalLink className="w-3 h-3 text-primary/70 shrink-0" />
                      </Link>
                      <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                        {renderChannelIcon(order.channel)}
                        <span className="truncate">{order.channel}</span>
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-on-surface block text-xs">
                      {order.dateTimeText}
                    </span>
                    <span className="text-[11px] text-on-surface-variant block font-mono">
                      {order.timeAgoText}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${order.customerAvatarBg || 'bg-surface-container text-on-surface'
                          }`}
                      >
                        {order.customerInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface text-xs truncate">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          {order.customerEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Purchased Items */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/60 flex items-center justify-center"
                          title={`${item.name} (${item.quantity}x)`}
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-on-surface-variant/60" />
                          )}
                        </div>
                      ))}
                      <span className="text-xs text-on-surface-variant font-medium ml-1">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm block ${order.isRefunded ? 'line-through text-on-surface-variant' : 'text-on-surface'
                        }`}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    {order.paymentMethodText && (
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        {order.paymentMethodText}
                      </span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">{renderPaymentBadge(order)}</td>

                  {/* Fulfillment Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">{renderFulfillmentBadge(order)}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onRowActionClick(order, actionLabel)}
                        className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
                      >
                        {actionLabel}
                      </button>

                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

