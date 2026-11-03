import { useState, useMemo } from 'react'
import { Info } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import { CommandStrip } from '../components/CommandStrip'
import { MetricKpiGrid } from '../components/MetricKpiGrid'
import { RecentOrdersTable } from '../components/RecentOrdersTable'
import { OrderQuickDrawer } from '../components/OrderQuickDrawer'
import { CancelOrderModal } from '../components/CancelOrderModal'
import {
  mockDashboardKpis,
  mockDashboardOrders,
  DATE_RANGE_OPTIONS,
} from '../data/mockDashboardData'
import type { DashboardOrder, DateRangeFilter } from '../types/dashboard'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function DashboardOverviewPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>(mockDashboardOrders)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(['ord-8492019', 'ord-8492018'])
  const [activeDrawerOrder, setActiveDrawerOrder] = useState<DashboardOrder | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<DashboardOrder | null>(null)
  const [currentRange, setCurrentRange] = useState<DateRangeFilter>(DATE_RANGE_OPTIONS[2]) // Default: 30d
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Dynamically calculate KPI values based on active API Date Range filter
  const dynamicKpis = useMemo(() => {
    switch (currentRange.period) {
      case 'today':
        return [
          { ...mockDashboardKpis[0], value: '$4,281.69' },
          { ...mockDashboardKpis[1], value: '62' },
          { ...mockDashboardKpis[2], value: '$69.05' },
          { ...mockDashboardKpis[3], value: '6 Orders' },
        ]
      case '7d':
        return [
          { ...mockDashboardKpis[0], value: '$29,970.00' },
          { ...mockDashboardKpis[1], value: '430' },
          { ...mockDashboardKpis[2], value: '$69.70' },
          { ...mockDashboardKpis[3], value: '14 Orders' },
        ]
      case '90d':
        return [
          { ...mockDashboardKpis[0], value: '$384,120.00' },
          { ...mockDashboardKpis[1], value: '5,490' },
          { ...mockDashboardKpis[2], value: '$69.96' },
          { ...mockDashboardKpis[3], value: '24 Orders' },
        ]
      case 'ytd':
        return [
          { ...mockDashboardKpis[0], value: '$452,800.00' },
          { ...mockDashboardKpis[1], value: '6,470' },
          { ...mockDashboardKpis[2], value: '$69.98' },
          { ...mockDashboardKpis[3], value: '24 Orders' },
        ]
      case '12m':
        return [
          { ...mockDashboardKpis[0], value: '$1,540,200.00' },
          { ...mockDashboardKpis[1], value: '21,800' },
          { ...mockDashboardKpis[2], value: '$70.65' },
          { ...mockDashboardKpis[3], value: '24 Orders' },
        ]
      case '30d':
      default:
        return mockDashboardKpis
    }
  }, [currentRange])

  // Handle Date Range selection for API
  const handleDateRangeChange = (filter: DateRangeFilter) => {
    setCurrentRange(filter)
    showToast(
      `Filter applied: "${filter.label}" [API: period="${filter.period}", start="${filter.startDate}", end="${filter.endDate}"]`
    )
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
      `Order ${targetOrder.orderNumber} cancelled & refunded successfully.${notifyCustomer ? ' Notification sent.' : ''
      }`
    )
  }

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
          { label: 'Order Total', value: `$${order.totalPrice.toFixed(2)}` },
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
    } else if (actionType === 'Track') {
      showToast(`Tracking status for ${order.trackingNumber || order.orderNumber}: In Transit with Carrier.`)
    } else if (actionType === 'Receipt') {
      showToast(`Printing receipt slip for ${order.orderNumber}...`)
    } else if (actionType === 'Capture') {
      setConfirmDialog({
        title: 'Capture Pending Payment',
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
        description: `Dispatch an automated checkout recovery notification with payment link to ${order.customerEmail}?`,
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
    } else if (actionType === 'RMA Details') {
      showToast(`RMA inspection notes opened for ${order.orderNumber}.`)
    } else {
      setActiveDrawerOrder(order)
    }
  }

  const handleCreateShippingLabel = (order: DashboardOrder) => {
    setActiveDrawerOrder(null)
    handleRowActionClick(order, 'Fulfill')
  }

  const handleKpiAction = (kpiId: string) => {
    if (kpiId === 'kpi-dispatch') {
      showToast('Dispatch queue opened for express orders.')
    }
  }

  return (
    <div className="flex flex-col w-full pb-12">
      {/* 1. Top Command & Filter Strip */}
      <CommandStrip
        currentRange={currentRange}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* 2. Metric KPI Cards (4 Tiles) */}
      <MetricKpiGrid kpis={dynamicKpis} onActionClick={handleKpiAction} />

      {/* 3. Operational Recent Orders Table */}
      <RecentOrdersTable
        orders={orders}
        selectedOrderIds={selectedOrderIds}
        onToggleSelectOrder={handleToggleSelectOrder}
        onToggleSelectAll={handleToggleSelectAll}
        onSelectOrderForDetails={(order) => setActiveDrawerOrder(order)}
        onRowActionClick={handleRowActionClick}
        onPrintSlip={(order) => showToast(`Printing packing slip for ${order.orderNumber}`)}
      />

      {/* 4. Slide-over Drawer for Order Quick Details */}
      <OrderQuickDrawer
        isOpen={Boolean(activeDrawerOrder)}
        order={activeDrawerOrder}
        onClose={() => setActiveDrawerOrder(null)}
        onCreateShippingLabel={handleCreateShippingLabel}
        onCancelOrder={(order) => setOrderToCancel(order)}
      />

      {/* 5. Cancellation & Refund Confirmation Dialog */}
      <CancelOrderModal
        isOpen={Boolean(orderToCancel)}
        order={orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* 6. Contextual Action Confirmation Modal */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-outline-variant/30 text-xs font-semibold">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
