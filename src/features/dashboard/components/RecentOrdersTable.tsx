import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Printer,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  PauseCircle,
  Ban,
  Download,
  Package,
} from 'lucide-react'
import type { DashboardOrder, OrderFilterTab } from '../types/dashboard'

interface RecentOrdersTableProps {
  orders: DashboardOrder[]
  selectedOrderIds: string[]
  onToggleSelectOrder: (orderId: string) => void
  onToggleSelectAll: () => void
  onSelectOrderForDetails: (order: DashboardOrder) => void
  onRowActionClick?: (order: DashboardOrder, actionType: string) => void
  onPrintSlip?: (order: DashboardOrder) => void
}

export function RecentOrdersTable({
  orders,
  selectedOrderIds,
  onToggleSelectOrder,
  onToggleSelectAll,
  onSelectOrderForDetails,
  onRowActionClick,
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

  // Helper for Contextual Row Action
  const getPrimaryActionLabel = (order: DashboardOrder) => {
    if (order.fulfillmentStatus.startsWith('unfulfilled')) return 'Fulfill'
    if (order.fulfillmentStatus === 'in_transit') return 'Track'
    if (order.fulfillmentStatus === 'delivered') return 'Receipt'
    if (order.paymentStatus === 'pending_wire') return 'Capture'
    if (order.paymentStatus === 'failed') return 'Send Recovery Link'
    if (order.fulfillmentStatus === 'returned') return 'RMA Details'
    return 'Details'
  }

  // Helpers for Status Badges
  const renderPaymentBadge = (status: DashboardOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        )
      case 'pending_wire':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-semibold">
            <Clock className="w-3 h-3" />
            Pending Wire
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-semibold">
            <Ban className="w-3 h-3" />
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Unfulfilled (Priority)
          </span>
        )
      case 'unfulfilled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            Unfulfilled
          </span>
        )
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
            <Truck className="w-3 h-3" />
            In Transit
          </span>
        )
      case 'on_hold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            <PauseCircle className="w-3 h-3" />
            On Hold
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-semibold">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-[0_2px_12px_rgba(36,51,49,0.03)] flex flex-col overflow-hidden">
      {/* Table Control Bar */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/50">
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders by number, customer, SKU..."
              className="w-full pl-9 pr-3 h-9 rounded-xl bg-surface-container-low/70 text-on-surface placeholder:text-outline text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            type="button"
            className="h-9 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Status segment filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            All (142)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unfulfilled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'unfulfilled'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Unfulfilled (24)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('in_transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'in_transit'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            In Transit (38)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Delivered (75)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('on_hold')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'on_hold'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            On Hold (5)
          </button>
        </div>
      </div>

      {/* Bulk Action Alert Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="px-4 py-2.5 bg-primary/10 border-b border-primary/20 flex flex-wrap items-center justify-between gap-3 text-on-surface text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-on-primary text-[11px] font-bold">
              {selectedOrderIds.length}
            </span>
            <span className="font-semibold text-primary">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const first = orders.find((o) => selectedOrderIds.includes(o.id)) || filteredOrders[0]
                if (first && onPrintSlip) onPrintSlip(first)
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packing Slips</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const first = orders.find((o) => selectedOrderIds.includes(o.id)) || filteredOrders[0]
                if (first && onRowActionClick) onRowActionClick(first, 'Fulfill')
              }}
              className="px-2.5 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary-hover shadow-xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Fulfill Items</span>
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Viewport */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant/60">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
                />
              </th>
              <th className="py-3 px-4">Order &amp; Channel</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date &amp; Time</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Fulfillment</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/40 text-xs text-on-surface">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id)
              return (
                <tr
                  key={order.id}
                  className={`hover:bg-surface-container-low/50 transition-colors ${
                    isSelected ? 'bg-primary/5' : 'bg-surface-container-lowest'
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOrder(order.id)}
                      className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
                    />
                  </td>

                  {/* Order & Channel */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/admin/orders/${order.orderNumber.replace('#', '')}`}
                        className="font-bold text-primary hover:underline cursor-pointer text-left font-mono"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Package className="w-3 h-3 text-outline" />
                        <span>{order.channel}</span>
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          order.customerAvatarBg || 'bg-primary/10 text-primary'
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
                  <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">
                    <span>{order.dateTimeText}</span>
                    <div className="text-[11px] text-outline">{order.timeAgoText}</div>
                  </td>

                  {/* Payment Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderPaymentBadge(order.paymentStatus)}
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderFulfillmentBadge(order.fulfillmentStatus)}
                  </td>

                  {/* Items */}
                  <td className="py-3 px-4">
                    <span className="font-semibold">{order.itemCount} items</span>
                    <div className="text-[11px] text-on-surface-variant truncate max-w-[150px]">
                      {order.itemsSummary}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-sm ${
                        order.isRefunded
                          ? 'text-outline line-through'
                          : 'text-on-surface'
                      }`}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onRowActionClick
                            ? onRowActionClick(order, getPrimaryActionLabel(order))
                            : onSelectOrderForDetails(order)
                        }
                        className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
                      >
                        {getPrimaryActionLabel(order)}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-3.5 bg-surface-container-low/70 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-on-surface font-semibold">1 to {filteredOrders.length}</strong> of{' '}
            <strong className="text-on-surface font-semibold">142</strong> orders
          </span>
          <span className="text-outline-variant">•</span>
          <span>Rows per page:</span>
          <select className="bg-surface-container-lowest text-on-surface font-semibold rounded-lg px-2 py-1 text-xs focus:outline-none border border-outline-variant/60 cursor-pointer">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/50 flex items-center justify-center text-outline disabled:opacity-40 cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container font-medium text-xs cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container font-medium text-xs cursor-pointer"
          >
            3
          </button>
          <span className="px-1 text-outline">...</span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/50 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
