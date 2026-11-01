import type { DashboardOrder } from '../types/dashboard'

interface OrderQuickDrawerProps {
  isOpen: boolean
  order: DashboardOrder | null
  onClose: () => void
  onCreateShippingLabel?: (order: DashboardOrder) => void
}

export function OrderQuickDrawer({
  isOpen,
  order,
  onClose,
  onCreateShippingLabel,
}: OrderQuickDrawerProps) {
  if (!isOpen || !order) return null

  return (
    <>
      {/* Backdrop for click-to-dismiss */}
      <div
        className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        id="quick-drawer"
        className="fixed top-0 right-0 h-screen w-full max-w-md bg-surface-container-lowest shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-space-lg flex items-center justify-between bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Order {order.orderNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-variant text-primary font-label-caps text-label-caps font-semibold capitalize">
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Placed {order.dateTimeText} via {order.channel}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-space-lg flex flex-col gap-space-lg">
            {/* Customer Details Box */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                Customer &amp; Shipping Destination
              </span>
              <div className="flex items-center gap-space-sm mt-1">
                <div
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-body-md ${
                    order.customerAvatarBg || 'bg-primary text-on-primary'
                  }`}
                >
                  {order.customerInitials}
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-on-surface">
                    {order.customerName}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {order.customerEmail} {order.customerPhone ? `• ${order.customerPhone}` : ''}
                  </span>
                </div>
              </div>
              {order.shippingAddress && (
                <div className="mt-2 text-body-sm text-on-surface-variant pt-2 border-t border-outline-variant/20">
                  <strong className="text-on-surface">Shipping to:</strong> {order.shippingAddress}
                </div>
              )}
            </div>

            {/* Ordered Items Summary */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                Line Items ({order.items.length})
              </span>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10"
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-on-surface-variant">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">
                          {item.icon || 'inventory_2'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {item.variant ? `${item.variant} • ` : ''}SKU: {item.sku}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-price-md text-price-md font-bold text-on-surface">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                    <div className="text-[11px] text-on-surface-variant">
                      Qty: {item.quantity}{' '}
                      {item.quantity > 1 ? `($${item.unitPrice.toFixed(2)} ea)` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="flex flex-col gap-1.5 p-space-md rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>${order.financials.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{order.financials.shippingTierName}</span>
                <span>${order.financials.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Taxes</span>
                <span>${order.financials.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-on-surface pt-2 mt-1 border-t border-outline-variant/20">
                <span>Total Paid</span>
                <span className="font-price-md text-price-md text-primary">
                  ${order.financials.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Drawer Action Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/20 flex items-center gap-space-xs">
          <button
            type="button"
            onClick={() => onCreateShippingLabel?.(order)}
            className="flex-1 h-9 rounded-xl bg-primary text-on-primary hover:bg-secondary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Create Shipping Label</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-colors cursor-pointer border border-outline-variant/20"
          >
            Dismiss
          </button>
        </div>
      </aside>
    </>
  )
}

