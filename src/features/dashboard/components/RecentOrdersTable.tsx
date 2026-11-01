import { useState } from 'react'
import type { DashboardOrder, OrderFilterTab } from '../types/dashboard'

interface RecentOrdersTableProps {
  orders: DashboardOrder[]
  selectedOrderIds: string[]
  onToggleSelectOrder: (orderId: string) => void
  onToggleSelectAll: () => void
  onSelectOrderForDetails: (order: DashboardOrder) => void
  onCancelOrderClick: (order: DashboardOrder) => void
  onPrintSlip?: (order: DashboardOrder) => void
}

export function RecentOrdersTable({
  orders,
  selectedOrderIds,
  onToggleSelectOrder,
  onToggleSelectAll,
  onSelectOrderForDetails,
  onCancelOrderClick,
  onPrintSlip,
}: RecentOrdersTableProps) {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'unfulfilled' && !order.fulfillmentStatus.startsWith('unfulfilled')) {
      return false
    }
    if (activeTab === 'in_transit' && order.fulfillmentStatus !== 'in_transit') {
      return false
    }
    if (activeTab === 'delivered' && order.fulfillmentStatus !== 'delivered') {
      return false
    }
    if (activeTab === 'on_hold' && order.fulfillmentStatus !== 'on_hold') {
      return false
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchNumber = order.orderNumber.toLowerCase().includes(q)
      const matchCustomer = order.customerName.toLowerCase().includes(q)
      const matchEmail = order.customerEmail.toLowerCase().includes(q)
      const matchSummary = order.itemsSummary.toLowerCase().includes(q)
      if (!matchNumber && !matchCustomer && !matchEmail && !matchSummary) {
        return false
      }
    }

    return true
  })

  const isAllSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrderIds.includes(order.id))

  // Helpers for Status Badges
  const renderPaymentBadge = (status: DashboardOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-variant text-primary font-label-caps text-label-caps font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Paid
          </span>
        )
      case 'pending_wire':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">pending</span>
            Pending (Wire)
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">refresh</span>
            Refunded
          </span>
        )
      default:
        return null
    }
  }

  const renderFulfillmentBadge = (status: DashboardOrder['fulfillmentStatus']) => {
    switch (status) {
      case 'unfulfilled_priority':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
            Unfulfilled (Priority)
          </span>
        )
      case 'unfulfilled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container/60 text-on-error-container font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">hourglass_empty</span>
            Unfulfilled
          </span>
        )
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            In Transit
          </span>
        )
      case 'on_hold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">pause_circle</span>
            On Hold (Payment)
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-variant text-primary font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            Delivered
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">
            <span className="material-symbols-outlined text-[13px]">cancel</span>
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-sm flex flex-col overflow-hidden">
      {/* Table Control Bar */}
      <div className="p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-lowest">
        {/* Search & Filter Trigger */}
        <div className="flex items-center gap-space-sm flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders, customers, SKUs..."
              className="w-full pl-9 pr-3 py-1.5 h-9 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>
          <button
            type="button"
            className="h-9 px-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1 font-body-sm text-body-sm cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter</span>
          </button>
        </div>

        {/* Status segment filter chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-lg font-label-caps text-label-caps transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium'
            }`}
          >
            All (142)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unfulfilled')}
            className={`px-2.5 py-1 rounded-lg font-label-caps text-label-caps transition-colors cursor-pointer ${
              activeTab === 'unfulfilled'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium'
            }`}
          >
            Unfulfilled (24)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('in_transit')}
            className={`px-2.5 py-1 rounded-lg font-label-caps text-label-caps transition-colors cursor-pointer ${
              activeTab === 'in_transit'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium'
            }`}
          >
            In Transit (38)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('delivered')}
            className={`px-2.5 py-1 rounded-lg font-label-caps text-label-caps transition-colors cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium'
            }`}
          >
            Delivered (75)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('on_hold')}
            className={`px-2.5 py-1 rounded-lg font-label-caps text-label-caps transition-colors cursor-pointer ${
              activeTab === 'on_hold'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium'
            }`}
          >
            On Hold (5)
          </button>
        </div>
      </div>

      {/* Bulk Action Alert Bar (Shown when items are selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="px-space-md py-2 bg-surface-container-high flex flex-wrap items-center justify-between gap-space-sm text-on-surface font-body-sm text-body-sm animate-fade-in">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-on-primary font-label-caps text-label-caps font-bold">
              {selectedOrderIds.length}
            </span>
            <span className="font-medium">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected across this view
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs font-label-caps text-label-caps font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Packing Slips</span>
            </button>
            <button
              type="button"
              className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs font-label-caps text-label-caps font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Fulfill Items</span>
            </button>
            <button
              type="button"
              className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs font-label-caps text-label-caps font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Viewport */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
              <th className="py-space-sm px-space-md w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </th>
              <th className="py-space-sm px-space-md">Order &amp; Channel</th>
              <th className="py-space-sm px-space-md">Customer</th>
              <th className="py-space-sm px-space-md">Date &amp; Time</th>
              <th className="py-space-sm px-space-md">Payment</th>
              <th className="py-space-sm px-space-md">Fulfillment</th>
              <th className="py-space-sm px-space-md">Items</th>
              <th className="py-space-sm px-space-md text-right">Total</th>
              <th className="py-space-sm px-space-md text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y-0 text-body-sm font-body-sm text-on-surface">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id)
              return (
                <tr
                  key={order.id}
                  className={`hover:bg-surface-container-low/60 transition-colors ${
                    isSelected ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest'
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-space-md px-space-md">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOrder(order.id)}
                      className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* Order & Channel */}
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => onSelectOrderForDetails(order)}
                        className="font-bold text-primary hover:underline cursor-pointer text-left"
                      >
                        {order.orderNumber}
                      </button>
                      <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">
                          {order.channelIcon}
                        </span>{' '}
                        {order.channel}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          order.customerAvatarBg || 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {order.customerInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface truncate">
                          {order.customerName}
                        </span>
                        <span className="text-on-surface-variant text-[11px] truncate">
                          {order.customerEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-space-md px-space-md text-on-surface-variant whitespace-nowrap">
                    <span>{order.dateTimeText}</span>
                    <div className="text-[11px] text-outline">{order.timeAgoText}</div>
                  </td>

                  {/* Payment Status */}
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    {renderPaymentBadge(order.paymentStatus)}
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    {renderFulfillmentBadge(order.fulfillmentStatus)}
                  </td>

                  {/* Items */}
                  <td className="py-space-md px-space-md">
                    <span className="font-medium">{order.itemCount} items</span>
                    <div className="text-[11px] text-on-surface-variant truncate max-w-[140px]">
                      {order.itemsSummary}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-space-md px-space-md text-right whitespace-nowrap">
                    <span
                      className={`font-price-md text-price-md font-bold ${
                        order.isRefunded
                          ? 'text-outline line-through'
                          : 'text-on-surface'
                      }`}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-space-md px-space-md text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPrintSlip?.(order)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Print Shipping Label"
                      >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectOrderForDetails(order)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>
                      {!order.isRefunded && (
                        <button
                          type="button"
                          onClick={() => onCancelOrderClick(order)}
                          className="w-7 h-7 rounded-lg hover:bg-error-container/60 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          title="Cancel / Refund Order"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-space-xs flex-wrap">
          <span>
            Showing <strong className="text-on-surface font-semibold">1 to {filteredOrders.length}</strong> of{' '}
            <strong className="text-on-surface font-semibold">142</strong> orders
          </span>
          <span className="text-outline-variant">•</span>
          <span>Rows per page:</span>
          <select className="bg-surface-container-lowest text-on-surface font-semibold rounded-lg px-2 py-0.5 text-[12px] focus:outline-none border border-outline-variant/30 cursor-pointer">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-[12px] cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium text-[12px] cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium text-[12px] cursor-pointer"
          >
            3
          </button>
          <span className="px-1 text-outline">...</span>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium text-[12px] cursor-pointer"
          >
            15
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}

