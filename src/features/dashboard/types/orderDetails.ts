import type { OrderPaymentStatus, OrderFulfillmentStatus } from './dashboard'

export interface OrderItemDetail {
  id: string
  name: string
  sku: string
  variant: string
  stockAvailable: number
  isLowStock?: boolean
  binLocation: string
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl: string
  selected?: boolean
}

export interface OrderTimelineEvent {
  id: string
  title: string
  description: string
  timestamp: string
  iconType: 'print' | 'inventory' | 'fraud' | 'payment' | 'created' | 'note' | 'dispatch' | 'hold'
  author?: string
}

export interface CustomerProfile {
  name: string
  initials: string
  email: string
  phone: string
  tier: string
  lifetimeOrders: number
  lifetimeValue: number
  isVerified: boolean
  avatarBg?: string
}

export interface ShippingDetails {
  recipientName: string
  street: string
  cityStateZip: string
  country: string
  dpvConfirmed: boolean
  driverNote?: string
}

export interface RiskCheckItem {
  id: string
  label: string
  status: 'passed' | 'warning' | 'failed'
  statusText: string
}

export interface OrderDetailFull {
  id: string
  orderNumber: string
  placedDateText: string
  channelName: string
  channelId: string
  warehouseLocation: string
  warehouseZone: string
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  shippingTier: string
  slaRemainingText: string
  items: OrderItemDetail[]
  carrier: string
  trackingNumber: string
  isEmailNotifyCustomer: boolean
  financials: {
    itemsSubtotal: number
    couponCode?: string
    couponDiscount?: number
    shippingCost: number
    shippingName: string
    estimatedTax: number
    taxPercentText: string
    grandTotal: number
    currency: string
  }
  paymentAudit: {
    processor: string
    cardBrand: string
    cardLast4: string
    transactionId: string
    captureStatusText: string
    settledTimestamp: string
  }
  timeline: OrderTimelineEvent[]
  customer: CustomerProfile
  shippingAddress: ShippingDetails
  billingMatchesShipping: boolean
  riskAssessment: {
    riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk'
    riskScore: number
    checks: RiskCheckItem[]
    securityPassMessage: string
  }
}

