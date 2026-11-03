import type { OrderDetailFull } from '../types/orderDetails'

export const defaultMockOrderDetail: OrderDetailFull = {
  id: 'ord-8492019',
  orderNumber: '#NX-8492019',
  placedDateText: 'Placed on April 14, 2025 at 10:24 AM EST',
  channelName: 'Online Web Store',
  channelId: 'US-WEB-01',
  warehouseLocation: 'Warehouse A - Seattle Primary Hub',
  warehouseZone: 'Zone 4 Active',
  paymentStatus: 'paid',
  fulfillmentStatus: 'unfulfilled_priority',
  shippingTier: 'FedEx Priority Overnight',
  slaRemainingText: 'Standard SLA: 3h remaining',
  carrier: 'FedEx - Priority Overnight (Next Business Morning)',
  trackingNumber: 'FXG-9842-8819-2041-US',
  isEmailNotifyCustomer: true,
  items: [
    {
      id: 'item-1',
      name: 'AeroSound Pro Wireless ANC Headphones',
      sku: 'NX-AUD-9420',
      variant: 'Midnight Black',
      stockAvailable: 84,
      binLocation: 'A-14-3',
      quantity: 1,
      unitPrice: 199.0,
      totalPrice: 199.0,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
      selected: true,
    },
    {
      id: 'item-2',
      name: 'DeskPower 65W GaN Fast Charger',
      sku: 'NX-PWR-6502',
      variant: 'Glacier White',
      stockAvailable: 210,
      binLocation: 'B-08-1',
      quantity: 1,
      unitPrice: 45.0,
      totalPrice: 45.0,
      imageUrl:
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80',
      selected: true,
    },
    {
      id: 'item-3',
      name: 'Thermal Peak Insulated Flask 32oz',
      sku: 'NX-HYD-3288',
      variant: 'Olive Green',
      stockAvailable: 4,
      isLowStock: true,
      binLocation: 'C-02-4',
      quantity: 1,
      unitPrice: 34.0,
      totalPrice: 34.0,
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80',
      selected: true,
    },
  ],
  financials: {
    itemsSubtotal: 278.0,
    couponCode: 'SPRING25',
    couponDiscount: 25.0,
    shippingCost: 0.0,
    shippingName: 'Shipping & Handling (FedEx Express)',
    estimatedTax: 19.46,
    taxPercentText: 'OR 7.00%',
    grandTotal: 272.46,
    currency: 'USD ($)',
  },
  paymentAudit: {
    processor: 'Stripe Elements',
    cardBrand: 'Visa',
    cardLast4: '4242',
    transactionId: 'ch_3Mqw98Lkd0129x87',
    captureStatusText: 'Captured / Succeeded',
    settledTimestamp: 'Apr 14, 2025, 10:24:18 AM EST',
  },
  timeline: [
    {
      id: 'tl-1',
      title: 'Packing slip printed by Alexander Wright (Ops Lead)',
      description:
        'Dispatched automated print queue command to Warehouse A Packing Bay 2 printer.',
      timestamp: 'Apr 14, 11:15 AM EST',
      iconType: 'print',
      author: 'Alexander Wright',
    },
    {
      id: 'tl-2',
      title: 'Inventory allocated: Seattle Fulfillment Center',
      description:
        'Reserved 3 physical units across Bins A-14-3, B-08-1, C-02-4. Stock balance updated.',
      timestamp: 'Apr 14, 10:26 AM EST',
      iconType: 'inventory',
    },
    {
      id: 'tl-3',
      title: 'Automated fraud check passed',
      description:
        'Risk score calculated at 0.02 (Extremely Low Risk) via Radar AI Engine.',
      timestamp: 'Apr 14, 10:25 AM EST',
      iconType: 'fraud',
    },
    {
      id: 'tl-4',
      title: 'Payment of $272.46 captured via Stripe',
      description:
        'Auth code: 994201 • Response: Successful match for CVV and 5-digit AVS Postal Code.',
      timestamp: 'Apr 14, 10:24 AM EST',
      iconType: 'payment',
    },
    {
      id: 'tl-5',
      title: 'Order created by customer Sarah Jenkins',
      description: 'Session IP: 198.51.100.42 • Client: Safari on macOS 14.4',
      timestamp: 'Apr 14, 10:24 AM EST',
      iconType: 'created',
    },
  ],
  customer: {
    name: 'Sarah Jenkins',
    initials: 'SJ',
    email: 'sarah.j@outlook.com',
    phone: '+1 (555) 234-5678',
    tier: 'Gold VIP',
    lifetimeOrders: 18,
    lifetimeValue: 2480.0,
    isVerified: true,
    avatarBg: 'bg-primary text-on-primary',
  },
  shippingAddress: {
    recipientName: 'Sarah Jenkins',
    street: '742 Evergreen Terrace, Apt 4B',
    cityStateZip: 'Springfield, OR 97477',
    country: 'United States',
    dpvConfirmed: true,
    driverNote: 'Leave behind planter box near inner porch gate.',
  },
  billingMatchesShipping: true,
  riskAssessment: {
    riskLevel: 'Low Risk',
    riskScore: 0.02,
    checks: [
      {
        id: 'chk-1',
        label: 'Cardholder Name Match',
        status: 'passed',
        statusText: 'Match (Exact)',
      },
      {
        id: 'chk-2',
        label: 'CVC / CVV Check',
        status: 'passed',
        statusText: 'Passed',
      },
      {
        id: 'chk-3',
        label: 'Street & Postal AVS Match',
        status: 'passed',
        statusText: 'Passed',
      },
      {
        id: 'chk-4',
        label: 'Proxy / VPN Detection',
        status: 'passed',
        statusText: 'No Proxy Detected',
      },
    ],
    securityPassMessage:
      'Order passed all automated risk criteria. Clear to fulfill immediately.',
  },
}

export function getOrderDetail(idOrNumber?: string): OrderDetailFull {
  if (!idOrNumber) return defaultMockOrderDetail

  const cleanQuery = idOrNumber.replace('#', '').toLowerCase()
  if (
    cleanQuery === 'nx-8492019' ||
    cleanQuery === 'ord-8492019' ||
    cleanQuery === '8492019'
  ) {
    return defaultMockOrderDetail
  }

  // Fallback template personalized with the provided id
  return {
    ...defaultMockOrderDetail,
    id: idOrNumber,
    orderNumber: idOrNumber.startsWith('#') ? idOrNumber : `#${idOrNumber}`,
  }
}

