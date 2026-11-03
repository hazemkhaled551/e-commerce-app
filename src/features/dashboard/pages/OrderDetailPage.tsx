import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import { getOrderDetail } from '../data/mockOrderDetailData'
import type { OrderDetailFull, OrderTimelineEvent } from '../types/orderDetails'
import { OrderDetailHeader } from '../components/order-details/OrderDetailHeader'
import { FulfillmentWorkspaceCard } from '../components/order-details/FulfillmentWorkspaceCard'
import { FinancialSettlementCard } from '../components/order-details/FinancialSettlementCard'
import { OrderTimelineCard } from '../components/order-details/OrderTimelineCard'
import { CustomerProfileCard } from '../components/order-details/CustomerProfileCard'
import { OrderAddressesCard } from '../components/order-details/OrderAddressesCard'
import { RiskAssessmentCard } from '../components/order-details/RiskAssessmentCard'
import { OrderAdminActionsCard } from '../components/order-details/OrderAdminActionsCard'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  // Load initial order data based on URL parameter or fallback
  const initialOrder = useMemo(() => getOrderDetail(id), [id])
  const [order, setOrder] = useState<OrderDetailFull>(initialOrder)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const isFulfilled =
    order.fulfillmentStatus === 'in_transit' || order.fulfillmentStatus === 'delivered'
  const isOnHold = order.fulfillmentStatus === 'on_hold'

  // 1. Print Packing Slip
  const handlePrintSlip = () => {
    showToast(`Packing slip sent to print queue for Order ${order.orderNumber}.`)
    const newEvent: OrderTimelineEvent = {
      id: `tl-${Date.now()}`,
      title: 'Packing slip reprinted by Administrator',
      description: 'Dispatched automated print queue command to Warehouse A Packing Bay 2 printer.',
      timestamp: 'Just now',
      iconType: 'print',
      author: 'Alexander Wright',
    }
    setOrder((prev) => ({
      ...prev,
      timeline: [newEvent, ...prev.timeline],
    }))
  }

  // 2. Commercial Invoice
  const handleCommercialInvoice = () => {
    showToast(`Commercial invoice generated for Order ${order.orderNumber}. Ready for customs export.`)
  }

  // 3. Auto Generate Tracking Number
  const handleAutoGenerateTracking = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newTracking = `FXG-${randomSuffix}-8819-${Math.floor(1000 + Math.random() * 9000)}-US`
    setOrder((prev) => ({
      ...prev,
      trackingNumber: newTracking,
    }))
    showToast(`New FedEx tracking ID auto-generated: ${newTracking}`)
  }

  // 4. Fulfill Selected Items with Mandatory Confirmation
  const handleFulfillSelected = (selectedItemIds: string[]) => {
    setConfirmDialog({
      title: 'Confirm Order Fulfillment',
      description: `Dispatches ${selectedItemIds.length} item(s) via ${order.carrier}, assigns tracking number ${order.trackingNumber}, and sends a dispatch notification email to the customer.`,
      confirmText: `Fulfill & Dispatch (${selectedItemIds.length})`,
      variant: 'primary',
      icon: 'truck',
      badgeText: 'Status Transition',
      itemDetails: [
        { label: 'Order Reference', value: order.orderNumber },
        { label: 'Customer', value: order.customer.name },
        { label: 'Carrier & Tracking', value: `${order.carrier}: ${order.trackingNumber}` },
        { label: 'Destination', value: `${order.shippingAddress.street}, ${order.shippingAddress.cityStateZip}` },
        { label: 'Target Status', value: 'In Transit' },
      ],
      onConfirm: () => {
        const newEvent: OrderTimelineEvent = {
          id: `tl-${Date.now()}`,
          title: `Dispatch generated via ${order.carrier}`,
          description: `Tracking number ${order.trackingNumber} assigned. Customer notification email queued.`,
          timestamp: 'Just now',
          iconType: 'dispatch',
        }
        setOrder((prev) => ({
          ...prev,
          fulfillmentStatus: 'in_transit',
          timeline: [newEvent, ...prev.timeline],
        }))
        setConfirmDialog(null)
        showToast(`Order ${order.orderNumber} successfully fulfilled and dispatched!`)
      },
    })
  }

  // 5. Add Staff Note to Timeline
  const handleAddStaffNote = (noteText: string) => {
    const newEvent: OrderTimelineEvent = {
      id: `tl-${Date.now()}`,
      title: 'Internal staff annotation added',
      description: noteText,
      timestamp: 'Just now',
      iconType: 'note',
      author: 'Alexander Wright (Ops Lead)',
    }
    setOrder((prev) => ({
      ...prev,
      timeline: [newEvent, ...prev.timeline],
    }))
    showToast('Staff annotation recorded to immutable audit trail.')
  }

  // 6. Hold / Resume Fulfillment with Mandatory Confirmation
  const handleToggleHold = () => {
    if (isOnHold) {
      setConfirmDialog({
        title: 'Resume Order Fulfillment',
        description: `Remove the administrative hold on order ${order.orderNumber} and return it to the active warehouse dispatch queue?`,
        confirmText: 'Resume Fulfillment',
        variant: 'primary',
        icon: 'check',
        badgeText: 'Fulfillment Release',
        itemDetails: [
          { label: 'Order Reference', value: order.orderNumber },
          { label: 'Current State', value: 'On Hold' },
          { label: 'Target State', value: 'Unfulfilled (Priority)' },
        ],
        onConfirm: () => {
          const newEvent: OrderTimelineEvent = {
            id: `tl-${Date.now()}`,
            title: 'Fulfillment hold released by Administrator',
            description: 'Order returned to priority pick and pack queue.',
            timestamp: 'Just now',
            iconType: 'note',
            author: 'Alexander Wright',
          }
          setOrder((prev) => ({
            ...prev,
            fulfillmentStatus: 'unfulfilled_priority',
            timeline: [newEvent, ...prev.timeline],
          }))
          setConfirmDialog(null)
          showToast(`Fulfillment hold removed for Order ${order.orderNumber}. Processing resumed.`)
        },
      })
    } else {
      setConfirmDialog({
        title: 'Place Order on Fulfillment Hold',
        description: `Suspend warehouse processing for order ${order.orderNumber}? The fulfillment SLA timer will be paused.`,
        confirmText: 'Place on Hold',
        variant: 'warning',
        icon: 'pause',
        badgeText: 'Status Freeze',
        itemDetails: [
          { label: 'Order Reference', value: order.orderNumber },
          { label: 'Current State', value: order.fulfillmentStatus },
          { label: 'Target State', value: 'On Hold' },
        ],
        onConfirm: () => {
          const newEvent: OrderTimelineEvent = {
            id: `tl-${Date.now()}`,
            title: 'Order placed on fulfillment hold',
            description: 'Warehouse processing suspended pending verification.',
            timestamp: 'Just now',
            iconType: 'note',
            author: 'Alexander Wright',
          }
          setOrder((prev) => ({
            ...prev,
            fulfillmentStatus: 'on_hold',
            timeline: [newEvent, ...prev.timeline],
          }))
          setConfirmDialog(null)
          showToast(`Order ${order.orderNumber} placed on fulfillment hold.`)
        },
      })
    }
  }

  // 7. Cancellation & Full Refund with Confirmation Modal
  const handleRequestCancel = () => {
    setConfirmDialog({
      title: 'Cancel & Refund Order',
      description: `This action will release the reserved inventory, trigger a full refund of $${order.financials.grandTotal.toFixed(
        2
      )} via Stripe, and notify the customer. This action is recorded in the permanent audit trail.`,
      confirmText: 'Confirm Cancellation & Refund',
      variant: 'danger',
      icon: 'alert',
      badgeText: 'Irreversible Cancellation',
      itemDetails: [
        { label: 'Order Reference', value: order.orderNumber },
        { label: 'Customer', value: order.customer.name },
        { label: 'Full Refund Total', value: `$${order.financials.grandTotal.toFixed(2)}` },
        { label: 'Gateway Settlement', value: order.paymentAudit.processor },
      ],
      onConfirm: () => {
        const newEvent: OrderTimelineEvent = {
          id: `tl-${Date.now()}`,
          title: 'Order cancelled and fully refunded',
          description: `Refund of $${order.financials.grandTotal.toFixed(
            2
          )} issued via Stripe. Reserved warehouse stock returned to inventory.`,
          timestamp: 'Just now',
          iconType: 'payment',
        }
        setOrder((prev) => ({
          ...prev,
          fulfillmentStatus: 'cancelled',
          paymentStatus: 'refunded',
          timeline: [newEvent, ...prev.timeline],
        }))
        setConfirmDialog(null)
        showToast(`Order ${order.orderNumber} cancelled and refunded successfully.`)
      },
    })
  }

  // 8. Return Merchandise Authorization (RMA) with Confirmation
  const handleInitiateReturn = () => {
    setConfirmDialog({
      title: 'Initiate Customer Return (RMA)',
      description: `Issue a Return Merchandise Authorization (RMA) ticket for order ${order.orderNumber} and email pre-paid return shipping label to ${order.customer.email}?`,
      confirmText: 'Initiate Return & Email Label',
      variant: 'warning',
      icon: 'refresh',
      badgeText: 'RMA Management',
      itemDetails: [
        { label: 'Order Reference', value: order.orderNumber },
        { label: 'Customer', value: order.customer.name },
        { label: 'Destination Warehouse', value: order.warehouseLocation },
      ],
      onConfirm: () => {
        const newEvent: OrderTimelineEvent = {
          id: `tl-${Date.now()}`,
          title: 'Return merchandise authorization (RMA) initiated',
          description: `Pre-paid carrier return label dispatched to ${order.customer.email}.`,
          timestamp: 'Just now',
          iconType: 'dispatch',
          author: 'Alexander Wright',
        }
        setOrder((prev) => ({
          ...prev,
          fulfillmentStatus: 'returned',
          timeline: [newEvent, ...prev.timeline],
        }))
        setConfirmDialog(null)
        showToast(`RMA process initiated for Order ${order.orderNumber}. Return label emailed.`)
      },
    })
  }

  // 9. Partial Refund with Confirmation
  const handleIssuePartialRefund = () => {
    setConfirmDialog({
      title: 'Issue Partial Refund',
      description: `Process a partial refund of $50.00 to the original payment method (${order.paymentAudit.processor}) for order ${order.orderNumber}?`,
      confirmText: 'Refund $50.00',
      variant: 'danger',
      icon: 'creditCard',
      badgeText: 'Payment Adjustment',
      itemDetails: [
        { label: 'Order Reference', value: order.orderNumber },
        { label: 'Partial Amount', value: '$50.00' },
        { label: 'Gateway Transaction', value: order.paymentAudit.transactionId },
      ],
      onConfirm: () => {
        const newEvent: OrderTimelineEvent = {
          id: `tl-${Date.now()}`,
          title: 'Partial refund issued ($50.00)',
          description: `Credit of $50.00 submitted via ${order.paymentAudit.processor}. Transaction balance updated.`,
          timestamp: 'Just now',
          iconType: 'payment',
          author: 'Alexander Wright',
        }
        setOrder((prev) => ({
          ...prev,
          financials: {
            ...prev.financials,
            grandTotal: Math.max(0, prev.financials.grandTotal - 50),
          },
          timeline: [newEvent, ...prev.timeline],
        }))
        setConfirmDialog(null)
        showToast(`Partial refund of $50.00 processed for Order ${order.orderNumber}.`)
      },
    })
  }

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Top Context Navigation & Order Header Banner */}
      <OrderDetailHeader
        order={order}
        onPrintSlip={handlePrintSlip}
        onCommercialInvoice={handleCommercialInvoice}
        onCancelClick={handleRequestCancel}
        onFulfillClick={() => handleFulfillSelected(order.items.map((i) => i.id))}
      />

      {/* 2. Main Operational Two-Column Grid (65% Left / 35% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Operations, Financial Settlement, Timeline (8 cols) */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          {/* A. Fulfillment Workspace */}
          <FulfillmentWorkspaceCard
            items={order.items}
            warehouseLocation={order.warehouseLocation}
            slaRemainingText={order.slaRemainingText}
            carrier={order.carrier}
            trackingNumber={order.trackingNumber}
            isEmailNotifyCustomer={order.isEmailNotifyCustomer}
            isFulfilled={isFulfilled}
            onCarrierChange={(carrier) => setOrder((prev) => ({ ...prev, carrier }))}
            onTrackingChange={(trackingNumber) =>
              setOrder((prev) => ({ ...prev, trackingNumber }))
            }
            onNotifyToggle={(isEmailNotifyCustomer) =>
              setOrder((prev) => ({ ...prev, isEmailNotifyCustomer }))
            }
            onAutoGenerateTracking={handleAutoGenerateTracking}
            onFulfillSelected={handleFulfillSelected}
          />

          {/* B. Financial Settlement & Payment Breakdown */}
          <FinancialSettlementCard
            financials={order.financials}
            paymentAudit={order.paymentAudit}
            onRefundClick={handleRequestCancel}
            onViewLogs={() =>
              showToast(`Opening raw Stripe event log for transaction ${order.paymentAudit.transactionId}...`)
            }
          />

          {/* C. Order Activity Timeline (Audit Trail) */}
          <OrderTimelineCard
            timeline={order.timeline}
            onAddStaffNote={handleAddStaffNote}
          />
        </div>

        {/* RIGHT COLUMN: Customer, Shipping/Billing, Risk, Admin Overrides (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          {/* A. Customer Profile */}
          <CustomerProfileCard
            customer={order.customer}
            onViewHistory={() =>
              showToast(`Redirecting to customer history for ${order.customer.name}...`)
            }
          />

          {/* B. Shipping & Billing Destinations */}
          <OrderAddressesCard
            shippingAddress={order.shippingAddress}
            billingMatchesShipping={order.billingMatchesShipping}
            onEditAddress={() =>
              showToast('Address editing modal opened with postal validation.')
            }
            onValidateUSPS={() =>
              showToast('USPS DPV API verification: 100% deliverable residential address.')
            }
          />

          {/* C. Risk & Fraud Assessment */}
          <RiskAssessmentCard riskAssessment={order.riskAssessment} />

          {/* D. Administrative Overrides */}
          <OrderAdminActionsCard
            isOnHold={isOnHold}
            onInitiateReturn={handleInitiateReturn}
            onIssuePartialRefund={handleIssuePartialRefund}
            onToggleHold={handleToggleHold}
          />
        </div>
      </div>

      {/* Reusable Contextual Confirmation Modal */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-outline-variant/30 text-xs font-semibold">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

