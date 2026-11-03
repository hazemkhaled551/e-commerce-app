import { Link } from 'react-router-dom'
import {
  X,
  Truck,
  Package,
  MapPin,
  Mail,
  ExternalLink,
} from 'lucide-react'
import type { DashboardOrder } from '../types/dashboard'

interface OrderQuickDrawerProps {
  isOpen: boolean
  order: DashboardOrder | null
  onClose: () => void
  onCreateShippingLabel?: (order: DashboardOrder) => void
  onCancelOrder?: (order: DashboardOrder) => void
}

export function OrderQuickDrawer({
  isOpen,
  order,
  onClose,
  onCreateShippingLabel,
  onCancelOrder,
}: OrderQuickDrawerProps) {
  if (!isOpen || !order) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        id="quick-drawer"
        className="fixed top-0 right-0 h-screen w-full max-w-md bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between border-l border-outline-variant/60"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-5 flex items-center justify-between bg-surface-container-low/70 border-b border-outline-variant/50">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface font-mono">
                  Order {order.orderNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant mt-0.5">
                Placed {order.dateTimeText} via {order.channel}
              </span>
              <Link
                to={`/admin/orders/${order.orderNumber.replace('#', '')}`}
                onClick={onClose}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mt-1 w-fit"
              >
                <span>View Full Details Page</span>
                <ExternalLink className="w-3 h-3 text-primary" />
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-5 flex flex-col gap-5 text-left">
            {/* Customer Details Box */}
            <div className="p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Customer &amp; Shipping
              </span>
              <div className="flex items-center gap-3 mt-1">
                <div
                  className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                    order.customerAvatarBg || 'bg-primary text-on-primary'
                  }`}
                >
                  {order.customerInitials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate">
                    {order.customerName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant truncate">
                    <Mail className="w-3 h-3 text-outline shrink-0" />
                    <span>{order.customerEmail}</span>
                  </div>
                </div>
              </div>
              {order.shippingAddress && (
                <div className="mt-2 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/40 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{order.shippingAddress}</span>
                </div>
              )}
            </div>

            {/* Ordered Items Summary */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Line Items ({order.items.length})
              </span>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-on-surface-variant border border-outline-variant/40">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-outline" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-on-surface truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant truncate">
                        {item.variant ? `${item.variant} • ` : ''}SKU: {item.sku}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-mono font-bold text-on-surface">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-on-surface-variant">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">${order.financials.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{order.financials.shippingTierName}</span>
                <span className="font-mono">${order.financials.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-mono">${order.financials.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-on-surface pt-2 mt-1 border-t border-outline-variant/40">
                <span>Total Amount</span>
                <span className="font-mono text-primary">
                  ${order.financials.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Drawer Action Footer */}
        <div className="p-4 bg-surface-container-low/70 border-t border-outline-variant/50 flex items-center gap-2">
          {!order.isRefunded && onCancelOrder && (
            <button
              type="button"
              onClick={() => {
                onCancelOrder(order)
              }}
              className="h-9 px-3.5 rounded-xl bg-error/10 hover:bg-error/15 text-error text-xs font-semibold transition-colors cursor-pointer border border-error/20"
            >
              Cancel Order
            </button>
          )}
          <button
            type="button"
            onClick={() => onCreateShippingLabel?.(order)}
            className="flex-1 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Create Shipping Label</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/60"
          >
            Dismiss
          </button>
        </div>
      </aside>
    </>
  )
}
