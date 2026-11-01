import { useState } from 'react'
import { CommandStrip } from '../components/CommandStrip'
import { MetricKpiGrid } from '../components/MetricKpiGrid'
import { RecentOrdersTable } from '../components/RecentOrdersTable'
import { OrderQuickDrawer } from '../components/OrderQuickDrawer'
import { CancelOrderModal } from '../components/CancelOrderModal'
import { mockDashboardKpis, mockDashboardOrders } from '../data/mockDashboardData'
import type { DashboardOrder } from '../types/dashboard'

export function DashboardOverviewPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>(mockDashboardOrders)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(['ord-8492019', 'ord-8492018'])
  const [activeDrawerOrder, setActiveDrawerOrder] = useState<DashboardOrder | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<DashboardOrder | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Toggle single order selection checkbox
  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  // Toggle select all visible orders
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([])
    } else {
      setSelectedOrderIds(orders.map((o) => o.id))
    }
  }

  // Handle Order cancellation & refund
  const handleConfirmCancel = (targetOrder: DashboardOrder, notifyCustomer: boolean) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === targetOrder.id
          ? {
              ...ord,
              fulfillmentStatus: 'cancelled',
              paymentStatus: 'refunded',
              isRefunded: true,
            }
          : ord
      )
    )

    if (activeDrawerOrder?.id === targetOrder.id) {
      setActiveDrawerOrder((prev) =>
        prev
          ? {
              ...prev,
              fulfillmentStatus: 'cancelled',
              paymentStatus: 'refunded',
              isRefunded: true,
            }
          : null
      )
    }

    setOrderToCancel(null)
    showToast(
      `Order ${targetOrder.orderNumber} cancelled & refunded successfully.${
        notifyCustomer ? ' Notification sent.' : ''
      }`
    )
  }

  const handleCreateShippingLabel = (order: DashboardOrder) => {
    showToast(`Shipping label generated for Order ${order.orderNumber}`)
  }

  const handleKpiAction = (kpiId: string) => {
    if (kpiId === 'kpi-dispatch') {
      showToast('Dispatch queue opened for express orders.')
    }
  }

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* 1. Top Command & Filter Strip */}
      <CommandStrip
        onSync={() => showToast('Store data synchronized successfully with live nodes.')}
        onExport={() => showToast('Exporting dashboard report as CSV...')}
      />

      {/* 2. Metric KPI Cards (4 Tiles) */}
      <MetricKpiGrid kpis={mockDashboardKpis} onActionClick={handleKpiAction} />

      {/* 3. Operational Recent Orders Table */}
      <RecentOrdersTable
        orders={orders}
        selectedOrderIds={selectedOrderIds}
        onToggleSelectOrder={handleToggleSelectOrder}
        onToggleSelectAll={handleToggleSelectAll}
        onSelectOrderForDetails={(order) => setActiveDrawerOrder(order)}
        onCancelOrderClick={(order) => setOrderToCancel(order)}
        onPrintSlip={(order) => showToast(`Printing packing slip for ${order.orderNumber}`)}
      />

      {/* 4. Slide-over Drawer for Order Quick Details */}
      <OrderQuickDrawer
        isOpen={Boolean(activeDrawerOrder)}
        order={activeDrawerOrder}
        onClose={() => setActiveDrawerOrder(null)}
        onCreateShippingLabel={handleCreateShippingLabel}
      />

      {/* 5. Cancellation & Refund Confirmation Dialog */}
      <CancelOrderModal
        isOpen={Boolean(orderToCancel)}
        order={orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-space-lg right-space-lg z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-2.5 rounded-xl shadow-xl flex items-center gap-space-sm animate-fade-in border border-outline-variant/30 text-body-sm font-medium">
          <span className="material-symbols-outlined text-[18px] text-primary">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

