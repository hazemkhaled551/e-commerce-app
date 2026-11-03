import { Search, RotateCcw, Calendar, CreditCard, Truck, Store, ChevronDown } from 'lucide-react'

export interface OrderFilterState {
  search: string
  dateRange: string
  paymentStatus: string
  fulfillmentStatus: string
  salesChannel: string
}

interface OrdersToolbarProps {
  filters: OrderFilterState
  onFilterChange: (key: keyof OrderFilterState, value: string) => void
  onResetFilters: () => void
}

export function OrdersToolbar({
  filters,
  onFilterChange,
  onResetFilters,
}: OrdersToolbarProps) {
  const isFiltered =
    Boolean(filters.search) ||
    filters.dateRange !== '30d' ||
    filters.paymentStatus !== 'all' ||
    filters.fulfillmentStatus !== 'all' ||
    filters.salesChannel !== 'all'

  return (
    <div className="p-4 rounded-2xl bg-white shadow-xs border border-outline-variant/60 mb-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="order-search"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search order #, customer name, email, or tracking #..."
            className="w-full pl-10 pr-14 h-10 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-low border border-outline-variant/60 text-on-surface-variant font-semibold select-none">
            ⌘K
          </kbd>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Date Range */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="h-10 pl-8 pr-7 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all shadow-xs"
            >
              <option value="30d">Last 30 Days</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
              className="h-10 pl-8 pr-7 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all shadow-xs"
            >
              <option value="all">Payment Status (All)</option>
              <option value="paid">Paid</option>
              <option value="pending_wire">Authorized Pending</option>
              <option value="failed">Payment Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <CreditCard className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Fulfillment Status Filter */}
          <div className="relative">
            <select
              value={filters.fulfillmentStatus}
              onChange={(e) => onFilterChange('fulfillmentStatus', e.target.value)}
              className="h-10 pl-8 pr-7 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all shadow-xs"
            >
              <option value="all">Fulfillment Status (All)</option>
              <option value="unfulfilled">Unfulfilled / Needs Dispatch</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="on_hold">On Hold</option>
              <option value="returned">Returned / RMA</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Truck className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sales Channel Filter */}
          <div className="relative">
            <select
              value={filters.salesChannel}
              onChange={(e) => onFilterChange('salesChannel', e.target.value)}
              className="h-10 pl-8 pr-7 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all shadow-xs"
            >
              <option value="all">All Channels</option>
              <option value="Online Web Store">Online Web Store</option>
              <option value="Mobile App iOS">Mobile App iOS</option>
              <option value="POS • Soho Store NYC">POS • Soho NYC</option>
            </select>
            <Store className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-10 px-3 rounded-xl text-on-surface-variant hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-all border border-outline-variant/60 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

