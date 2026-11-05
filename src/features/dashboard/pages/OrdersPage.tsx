import { useState, useMemo, useEffect } from 'react'
import { Download, CheckCircle2 } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type { DashboardOrder, OrderFilterTab } from '../types/dashboard'
import { mockOrdersKpiData, mockOrdersList } from '../data/mockOrdersData'
import { OrdersMetricCards } from '../components/orders/OrdersMetricCards'
import { OrdersStatusTabs } from '../components/orders/OrdersStatusTabs'
import { OrdersToolbar, type OrderFilterState } from '../components/orders/OrdersToolbar'
import { OrdersBulkActionBar } from '../components/orders/OrdersBulkActionBar'
import { OrdersTable } from '../components/orders/OrdersTable'
import { OrdersPagination } from '../components/orders/OrdersPagination'
import { OrderQuickDrawer } from '../components/OrderQuickDrawer'
import { CancelOrderModal } from '../components/CancelOrderModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function OrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>(mockOrdersList)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all')
  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    dateRange: '30d',
    paymentStatus: 'all',
    fulfillmentStatus: 'all',
    salesChannel: 'all',
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Drawer & Modal state
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<DashboardOrder | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<DashboardOrder | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Keyboard shortcut listener for ⌘K search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('order-search')
        if (searchInput) searchInput.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter change handler
  const handleFilterChange = (key: keyof OrderFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateRange: '30d',
      paymentStatus: 'all',
      fulfillmentStatus: 'all',
      salesChannel: 'all',
    })
    setActiveTab('all')
    setCurrentPage(1)
    showToast('Filters have been reset to default.')
  }

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Tab filter
      if (activeTab === 'unfulfilled' && !order.fulfillmentStatus.startsWith('unfulfilled')) {
        return false
      }
      if (activeTab === 'in_transit' && order.fulfillmentStatus !== 'in_transit') {
        return false
      }
      if (activeTab === 'delivered' && order.fulfillmentStatus !== 'delivered') {
        return false
      }
      if (activeTab === 'returned' && order.fulfillmentStatus !== 'returned') {
        return false
      }
      if (
        activeTab === 'cancelled' &&
        order.fulfillmentStatus !== 'cancelled' &&
        order.paymentStatus !== 'failed'
      ) {
        return false
      }

      // 2. Search query (order #, customer name, email, tracking #)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchNum = order.orderNumber.toLowerCase().includes(query)
        const matchCust = order.customerName.toLowerCase().includes(query)
        const matchEmail = order.customerEmail.toLowerCase().includes(query)
        const matchTrack = order.trackingNumber?.toLowerCase().includes(query)
        if (!matchNum && !matchCust && !matchEmail && !matchTrack) return false
      }

      // 3. Payment Status filter
      if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) {
        return false
      }

      // 4. Fulfillment Status filter
      if (filters.fulfillmentStatus !== 'all') {
        if (filters.fulfillmentStatus === 'unfulfilled') {
          if (!order.fulfillmentStatus.startsWith('unfulfilled')) return false
        } else if (order.fulfillmentStatus !== filters.fulfillmentStatus) {
          return false
        }
      }

      // 5. Sales Channel filter
      if (filters.salesChannel !== 'all' && order.channel !== filters.salesChannel) {
        return false
      }

      return true
    })
  }, [orders, activeTab, filters])

  // Dynamic counts for status tabs
  const tabCounts = useMemo(() => {
    return {
      all: 1842,
      unfulfilled: 24,
      inTransit: 68,
      delivered: 1712,
      returned: 14,
      cancelled: 24,
    }
  }, [])

  // Checkbox selection handlers
  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const handleToggleSelectAll = () => {
    const allFilteredIds = filteredOrders.map((o) => o.id)
    const isAll =
      allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedOrderIds.includes(id))

    if (isAll) {
      setSelectedOrderIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  // Row contextual action handler with mandatory Admin Confirmation
  const handleRowActionClick = (order: DashboardOrder, actionType: string) => {
    if (actionType === 'Fulfill') {
      setConfirmDialog({
        title: 'Confirm Order Fulfillment',
        description: 'Are you sure you want to fulfill this order? This will issue a FedEx tracking identifier, transition status to In Transit, and notify the customer.',
        confirmText: 'Fulfill & Dispatch',
        variant: 'primary',
        icon: 'truck',
        badgeText: 'Status Transition',
        itemDetails: [
          { label: 'Order Reference', value: order.orderNumber },
          { label: 'Customer', value: order.customerName },
          { label: 'Total Value', value: `$${order.totalPrice.toFixed(2)}` },
          { label: 'Target Fulfillment Status', value: 'In Transit' },
        ],
        onConfirm: () => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
                ? {
                    ...o,
                    fulfillmentStatus: 'in_transit',
                    trackingNumber: 'FedEx: 940019283749',
                  }
                : o
            )
          )
          setConfirmDialog(null)
          showToast(`Order ${order.orderNumber} fulfilled and marked In-Transit!`)
        },
      })
    } else if (actionType === 'Capture') {
      setConfirmDialog({
        title: 'Capture Wire Payment',
        description: 'Confirm capturing the funds for this order? This action verifies payment clearance and updates status to Paid.',
        confirmText: 'Capture Payment',
        variant: 'success',
        icon: 'creditCard',
        badgeText: 'Payment Status Change',
        itemDetails: [
          { label: 'Order Reference', value: order.orderNumber },
          { label: 'Payment Method', value: order.paymentMethodText || 'Bank Wire' },
          { label: 'Amount to Settle', value: `$${order.totalPrice.toFixed(2)}` },
          { label: 'New Status', value: 'Paid' },
        ],
        onConfirm: () => {
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, paymentStatus: 'paid' } : o))
          )
          setConfirmDialog(null)
          showToast(`Payment successfully captured for ${order.orderNumber}.`)
        },
      })
    } else if (actionType === 'Send Recovery Link') {
      setConfirmDialog({
        title: 'Send Payment Recovery Link',
        description: `Dispatch an automated checkout recovery SMS and email with payment link to ${order.customerEmail}?`,
        confirmText: 'Send Recovery Notice',
        variant: 'primary',
        icon: 'refresh',
        badgeText: 'Customer Recovery',
        itemDetails: [
          { label: 'Order Reference', value: order.orderNumber },
          { label: 'Customer', value: order.customerName },
          { label: 'Recipient Email', value: order.customerEmail },
        ],
        onConfirm: () => {
          setConfirmDialog(null)
          showToast(`Payment recovery notification sent to ${order.customerEmail}.`)
        },
      })
    } else if (actionType === 'Track') {
      showToast(`Tracking status for ${order.trackingNumber || order.orderNumber}: Out for delivery.`)
    } else if (actionType === 'Receipt') {
      showToast(`Printing receipt slip for ${order.orderNumber}...`)
    } else if (actionType === 'RMA Details') {
      showToast(`RMA Inspection notes opened for ${order.orderNumber}.`)
    } else {
      setSelectedOrderForDrawer(order)
    }
  }

  // Bulk operations with mandatory Admin Confirmation
  const handleBulkFulfill = () => {
    const count = selectedOrderIds.length
    setConfirmDialog({
      title: 'Bulk Fulfill Orders',
      description: `Are you sure you want to fulfill all ${count} selected orders simultaneously? This will transition them to In Transit and queue dispatch slips.`,
      confirmText: `Fulfill ${count} Orders`,
      variant: 'primary',
      icon: 'truck',
      badgeText: 'Bulk Fulfillment',
      itemDetails: [
        { label: 'Affected Orders', value: `${count} orders` },
        { label: 'Target Status', value: 'In Transit' },
      ],
      onConfirm: () => {
        setOrders((prev) =>
          prev.map((o) =>
            selectedOrderIds.includes(o.id)
              ? {
                  ...o,
                  fulfillmentStatus: 'in_transit',
                  trackingNumber: `Courier: ${Math.floor(100000000000 + Math.random() * 900000000000)}`,
                }
              : o
          )
        )
        setSelectedOrderIds([])
        setConfirmDialog(null)
        showToast(`Bulk fulfilled ${count} orders and dispatched shipping slips.`)
      },
    })
  }

  const handleBulkMarkInTransit = () => {
    const count = selectedOrderIds.length
    setConfirmDialog({
      title: 'Mark Orders In-Transit',
      description: `Confirm changing fulfillment status to In Transit for ${count} selected orders?`,
      confirmText: 'Mark In-Transit',
      variant: 'primary',
      icon: 'truck',
      badgeText: 'Bulk Status Update',
      itemDetails: [
        { label: 'Selected Orders', value: `${count} orders` },
        { label: 'New Status', value: 'In Transit' },
      ],
      onConfirm: () => {
        setOrders((prev) =>
          prev.map((o) =>
            selectedOrderIds.includes(o.id) ? { ...o, fulfillmentStatus: 'in_transit' } : o
          )
        )
        setSelectedOrderIds([])
        setConfirmDialog(null)
        showToast(`Marked ${count} orders as In-Transit.`)
      },
    })
  }

  const handleBulkExport = () => {
    showToast(`Exported ${selectedOrderIds.length} selected orders to orders_batch.csv`)
  }

  const handleBulkCancel = () => {
    const firstSelected = orders.find((o) => selectedOrderIds.includes(o.id))
    if (firstSelected) {
      setOrderToCancel(firstSelected)
      setIsCancelModalOpen(true)
    }
  }

  // Confirm cancel order
  const handleConfirmCancel = (order: DashboardOrder, notifyCustomer: boolean) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              fulfillmentStatus: 'cancelled',
              paymentStatus: o.paymentStatus === 'paid' ? 'refunded' : o.paymentStatus,
              isRefunded: o.paymentStatus === 'paid',
            }
          : o
      )
    )
    setIsCancelModalOpen(false)
    setOrderToCancel(null)
    showToast(
      `Order ${order.orderNumber} cancelled.${notifyCustomer ? ' Customer notified via email.' : ''}`
    )
  }

  // Export full catalog
  const handleExportAllOrders = () => {
    showToast('Exporting master orders log (1,842 records) to CSV...')
  }

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-2xl flex items-center gap-2.5 text-xs animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar & Page Actions (Notice: NO duplicate inner breadcrumb!) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div className="flex flex-col text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl">
            Monitor orders, process fulfillments, track shipments, and resolve customer order exceptions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleExportAllOrders}
            className="h-9 px-3.5 rounded-xl bg-white text-on-surface text-xs font-semibold flex items-center gap-2 shadow-xs hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/60"
          >
            <Download className="w-4 h-4 text-on-surface-variant" />
            <span>Export Orders (CSV)</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Summary Strip (4 Cards) */}
      <OrdersMetricCards kpis={mockOrdersKpiData} />

      {/* 2. Status Tabs Bar */}
      <OrdersStatusTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setCurrentPage(1)
        }}
        counts={tabCounts}
      />

      {/* 3. Search & Filter Controls Panel */}
      <OrdersToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Interactive Floating Bulk Action Bar (Visible when rows selected) */}
      <OrdersBulkActionBar
        selectedCount={selectedOrderIds.length}
        onBulkFulfill={handleBulkFulfill}
        onBulkMarkInTransit={handleBulkMarkInTransit}
        onBulkExport={handleBulkExport}
        onBulkCancel={handleBulkCancel}
        onClearSelection={() => setSelectedOrderIds([])}
      />

      {/* 5. Main Orders Data Table */}
      <OrdersTable
        orders={filteredOrders}
        selectedOrderIds={selectedOrderIds}
        onToggleSelectOrder={handleToggleSelectOrder}
        onToggleSelectAll={handleToggleSelectAll}
        onRowActionClick={handleRowActionClick}
      />

      {/* 6. Pagination Footer */}
      <OrdersPagination
        currentPage={currentPage}
        totalCount={1842}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />

      {/* 7. Slide-over Order Details Drawer */}
      <OrderQuickDrawer
        isOpen={Boolean(selectedOrderForDrawer)}
        order={selectedOrderForDrawer}
        onClose={() => setSelectedOrderForDrawer(null)}
        onCreateShippingLabel={(order) => {
          handleRowActionClick(order, 'Fulfill')
          setSelectedOrderForDrawer(null)
        }}
      />

      {/* 8. Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        order={orderToCancel}
        onClose={() => {
          setIsCancelModalOpen(false)
          setOrderToCancel(null)
        }}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* 9. Confirmation Modal for Order Actions & Status Changes */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}
    </div>
  )
}

