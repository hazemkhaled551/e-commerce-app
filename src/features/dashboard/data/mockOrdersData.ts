import type { DashboardOrder } from '../types/dashboard'

export interface OrdersKpiData {
  totalOrders: {
    value: string
    changePercent: string
    prevText: string
    successRate: string
  }
  needsDispatch: {
    value: string
    urgentCount: number
    targetText: string
    statusText: string
  }
  inTransit: {
    value: string
    subText: string
    carriersText: string
    arrivingTodayCount: number
  }
  returnsExceptions: {
    value: string
    inspectionPendingCount: number
    refundProcessedCount: number
    returnRate: string
  }
}

export const mockOrdersKpiData: OrdersKpiData = {
  totalOrders: {
    value: '1,842',
    changePercent: '+8.7%',
    prevText: 'Prev: 1,694 orders',
    successRate: '99.2% success',
  },
  needsDispatch: {
    value: '24',
    urgentCount: 6,
    targetText: 'Target: 100% within 4h',
    statusText: 'Action Required',
  },
  inTransit: {
    value: '68',
    subText: 'Orders en route',
    carriersText: 'FedEx: 42 • UPS: 26',
    arrivingTodayCount: 4,
  },
  returnsExceptions: {
    value: '7',
    inspectionPendingCount: 3,
    refundProcessedCount: 4,
    returnRate: '0.38% return rate',
  },
}

export const mockOrdersList: DashboardOrder[] = [
  {
    id: 'ord-8492019',
    orderNumber: '#NX-8492019',
    channel: 'Online Web Store',
    channelIcon: 'language',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@icloud.com',
    customerInitials: 'SJ',
    customerAvatarBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    customerPhone: '+1 (555) 392-8190',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477, US',
    dateTimeText: 'Today, 10:42 AM',
    timeAgoText: '18 mins ago',
    paymentStatus: 'paid',
    paymentMethodText: 'Stripe • Visa 4242',
    fulfillmentStatus: 'unfulfilled_priority',
    slaRemainingText: 'SLA: 1h 42m remaining',
    itemCount: 2,
    itemsSummary: 'AeroSound Pro ANC (1x), DeskPower 65W GaN (1x)',
    totalPrice: 272.46,
    items: [
      {
        id: 'li-1',
        name: 'AeroSound Pro Wireless ANC',
        sku: 'NX-AUD-9420',
        variant: 'Matte Black',
        quantity: 1,
        unitPrice: 199.0,
        totalPrice: 199.0,
        imageUrl:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
      },
      {
        id: 'li-2',
        name: 'DeskPower 65W GaN Charger',
        sku: 'NX-PWR-6502',
        variant: 'White Edition',
        quantity: 1,
        unitPrice: 45.0,
        totalPrice: 45.0,
        imageUrl:
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 244.0,
      shipping: 12.0,
      shippingTierName: 'FedEx Priority Overnight',
      tax: 16.46,
      total: 272.46,
    },
  },
  {
    id: 'ord-8492020',
    orderNumber: '#NX-8492020',
    channel: 'Mobile App iOS',
    channelIcon: 'smartphone',
    customerName: 'Marcus Brody',
    customerEmail: 'm.brody@atlascorp.io',
    customerInitials: 'MB',
    customerAvatarBg: 'bg-primary/10 text-primary border border-primary/25',
    customerPhone: '+1 (555) 902-3344',
    shippingAddress: '224 Michigan Ave, Chicago, IL 60601, US',
    dateTimeText: 'Today, 08:15 AM',
    timeAgoText: '3 hrs ago',
    paymentStatus: 'paid',
    paymentMethodText: 'Apple Pay • Master 8812',
    fulfillmentStatus: 'in_transit',
    trackingNumber: 'FedEx: 940012093849',
    itemCount: 1,
    itemsSummary: 'Mechanical Aluminum Keyboard (1x)',
    totalPrice: 199.0,
    items: [
      {
        id: 'li-3',
        name: 'Mechanical Ergonomic Keyboard',
        sku: 'NX-KEY-3001',
        variant: 'Space Grey / Tactile',
        quantity: 1,
        unitPrice: 199.0,
        totalPrice: 199.0,
        imageUrl:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 199.0,
      shipping: 0.0,
      shippingTierName: 'Standard Free Shipping',
      tax: 0.0,
      total: 199.0,
    },
  },
  {
    id: 'ord-8492018',
    orderNumber: '#NX-8492018',
    channel: 'POS • Soho Store NYC',
    channelIcon: 'point_of_sale',
    customerName: 'David Miller',
    customerEmail: 'david.miller@nyu.edu',
    customerInitials: 'DM',
    customerAvatarBg: 'bg-stone-100 text-stone-700 border border-stone-200',
    customerPhone: '+1 (555) 782-9011',
    shippingAddress: '450 Broadway, New York, NY 10013, US (In-Store Pickup)',
    dateTimeText: 'Yesterday, 4:18 PM',
    timeAgoText: 'May 14, 2024',
    paymentStatus: 'paid',
    paymentMethodText: 'Square POS • Tap Amex',
    fulfillmentStatus: 'delivered',
    itemCount: 2,
    itemsSummary: 'Thermal Water Bottle (1x), Tech Sling Bag (1x)',
    totalPrice: 165.0,
    items: [
      {
        id: 'li-4',
        name: 'Stainless Thermal Flask (750ml)',
        sku: 'NX-BOT-750',
        variant: 'Matte Sand',
        quantity: 1,
        unitPrice: 65.0,
        totalPrice: 65.0,
        imageUrl:
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80',
      },
      {
        id: 'li-5',
        name: 'Compact Canvas Sling Bag',
        sku: 'NX-BAG-100',
        variant: 'Charcoal',
        quantity: 1,
        unitPrice: 100.0,
        totalPrice: 100.0,
        imageUrl:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 165.0,
      shipping: 0.0,
      shippingTierName: 'Local Store Pickup',
      tax: 0.0,
      total: 165.0,
    },
  },
  {
    id: 'ord-8492017',
    orderNumber: '#NX-8492017',
    channel: 'Online Web Store',
    channelIcon: 'language',
    customerName: 'Elena Vance',
    customerEmail: 'elena.v@vance-arch.com',
    customerInitials: 'EV',
    customerAvatarBg: 'bg-amber-100 text-amber-800 border border-amber-200',
    customerPhone: '+1 (555) 412-6729',
    shippingAddress: '101 Market St, Suite 400, San Francisco, CA 94105, US',
    dateTimeText: 'May 14, 11:20 AM',
    timeAgoText: '1 day ago',
    paymentStatus: 'pending_wire',
    paymentMethodText: 'Net 30 Invoice #INV-8492',
    fulfillmentStatus: 'on_hold',
    itemCount: 1,
    itemsSummary: 'Wireless Precision Architect Mouse (1x)',
    totalPrice: 89.0,
    items: [
      {
        id: 'li-6',
        name: 'Wireless Precision Architect Mouse',
        sku: 'NX-MOU-201',
        variant: 'Cool Stone Grey',
        quantity: 1,
        unitPrice: 89.0,
        totalPrice: 89.0,
        imageUrl:
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 89.0,
      shipping: 0.0,
      shippingTierName: 'Standard Courier',
      tax: 0.0,
      total: 89.0,
    },
  },
  {
    id: 'ord-8492016',
    orderNumber: '#NX-8492016',
    channel: 'Online Web Store',
    channelIcon: 'language',
    customerName: 'Chloe Zhao',
    customerEmail: 'c.zhao@lumina-film.com',
    customerInitials: 'CZ',
    customerAvatarBg: 'bg-red-100 text-red-800 border border-red-200',
    customerPhone: '+1 (555) 670-2218',
    shippingAddress: '88 Pike St, Seattle, WA 98101, US',
    dateTimeText: 'May 13, 09:05 PM',
    timeAgoText: '2 days ago',
    paymentStatus: 'failed',
    paymentMethodText: 'Stripe: card_declined',
    failureReason: 'Insufficient funds on credit card',
    fulfillmentStatus: 'on_hold',
    itemCount: 1,
    itemsSummary: 'Portable Carbon Espresso Brewer (1x)',
    totalPrice: 260.0,
    items: [
      {
        id: 'li-7',
        name: 'Portable Carbon Fiber Espresso Machine',
        sku: 'NX-COF-401',
        variant: 'Matte Carbon',
        quantity: 1,
        unitPrice: 260.0,
        totalPrice: 260.0,
        imageUrl:
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 260.0,
      shipping: 0.0,
      shippingTierName: 'Standard Courier',
      tax: 0.0,
      total: 260.0,
    },
  },
  {
    id: 'ord-8492015',
    orderNumber: '#NX-8492015',
    channel: 'Online Web Store',
    channelIcon: 'language',
    customerName: 'Liam Patel',
    customerEmail: 'l.patel@horizon.co.uk',
    customerInitials: 'LP',
    customerAvatarBg: 'bg-blue-100 text-blue-800 border border-blue-200',
    customerPhone: '+44 20 7946 0912',
    shippingAddress: '14 Kensington High St, London W8 5NP, UK',
    dateTimeText: 'May 12, 02:40 PM',
    timeAgoText: '3 days ago',
    paymentStatus: 'refunded',
    paymentMethodText: '-$145.00 Refunded (Original Card)',
    fulfillmentStatus: 'returned',
    rmaReason: 'RMA: Damaged in transit by carrier',
    isRefunded: true,
    itemCount: 1,
    itemsSummary: 'Wireless Metallic Desk Charging Tray (1x)',
    totalPrice: 145.0,
    items: [
      {
        id: 'li-8',
        name: 'Metallic Wireless Desk Charging Tray',
        sku: 'NX-CHG-102',
        variant: 'Anodized Silver / Leather',
        quantity: 1,
        unitPrice: 145.0,
        totalPrice: 145.0,
        imageUrl:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&q=80',
      },
    ],
    financials: {
      subtotal: 145.0,
      shipping: 0.0,
      shippingTierName: 'DHL International Express',
      tax: 0.0,
      total: 145.0,
    },
  },
]

