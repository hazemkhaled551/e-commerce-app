export type OrderFulfillmentStatus =
  | 'unfulfilled'
  | 'unfulfilled_priority'
  | 'in_transit'
  | 'delivered'
  | 'on_hold'
  | 'cancelled'
  | 'returned'

export type OrderPaymentStatus =
  | 'paid'
  | 'pending_wire'
  | 'refunded'
  | 'failed'

export interface OrderLineItem {
  id: string
  name: string
  sku: string
  variant?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl?: string
  icon?: string
}

export interface DashboardOrder {
  id: string
  orderNumber: string
  channel: string
  channelIcon: string
  customerName: string
  customerEmail: string
  customerInitials: string
  customerAvatarBg?: string
  customerPhone?: string
  shippingAddress?: string
  dateTimeText: string
  timeAgoText: string
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  itemCount: number
  itemsSummary: string
  totalPrice: number
  isRefunded?: boolean
  trackingNumber?: string
  slaRemainingText?: string
  paymentMethodText?: string
  rmaReason?: string
  failureReason?: string
  items: OrderLineItem[]
  financials: {
    subtotal: number
    shipping: number
    shippingTierName: string
    tax: number
    total: number
  }
}

export interface DashboardKpi {
  id: string
  title: string
  value: string
  icon: string
  iconColorClass: string
  subtextPrimary: string
  subtextSecondary?: string
  type: 'sparkline_revenue' | 'sparkline_orders' | 'progress_aov' | 'action_dispatch'
  chartColor?: string
  actionLabel?: string
}

export type OrderFilterTab =
  | 'all'
  | 'unfulfilled'
  | 'in_transit'
  | 'delivered'
  | 'on_hold'
  | 'returned'
  | 'cancelled'

export type DateRangePeriod =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | 'ytd'
  | '12m'
  | 'this_month'
  | 'custom'

export interface DateRangeFilter {
  period: DateRangePeriod
  label: string
  dateRangeText: string
  startDate: string
  endDate: string
}

