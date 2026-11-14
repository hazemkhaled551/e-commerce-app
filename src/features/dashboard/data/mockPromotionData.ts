import type { PromotionItem, PromotionMetrics } from '../types/promotion'

const PROMOTIONS_STORAGE_KEY = 'nexastore_admin_promotions_v1'

export const INITIAL_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-01',
    code: 'WELCOME10',
    title: 'First-time Customer Welcome',
    description: '10% discount on first orders over $30 for registered new accounts.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 30,
    maxDiscountValue: 20,
    usageLimit: 1000,
    usageCount: 342,
    perCustomerLimit: 1,
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    status: 'active',
    appliesTo: 'all_products',
    totalSavings: 4210.5,
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-11-12T14:20:00.000Z',
  },
  {
    id: 'promo-02',
    code: 'SUMMER25',
    title: 'Mid-Season Summer Splash',
    description: '25% off all summer apparel and footwear collections.',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 50,
    maxDiscountValue: 60,
    usageLimit: 500,
    usageCount: 468,
    perCustomerLimit: 2,
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // expires in 5 days
    status: 'active',
    appliesTo: 'specific_categories',
    targetIds: ['apparel', 'footwear'],
    totalSavings: 11720.0,
    createdAt: '2026-05-20T10:15:00.000Z',
    updatedAt: '2026-11-14T09:30:00.000Z',
  },
  {
    id: 'promo-03',
    code: 'FREESHIP',
    title: 'Free Express Shipping',
    description: 'Zero shipping fee across the country on carts above $75.',
    discountType: 'free_shipping',
    discountValue: 0,
    minOrderValue: 75,
    usageLimit: null, // unlimited
    usageCount: 894,
    perCustomerLimit: 5,
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: null,
    status: 'active',
    appliesTo: 'all_products',
    totalSavings: 13410.0,
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-11-13T17:45:00.000Z',
  },
  {
    id: 'promo-04',
    code: 'TECH50',
    title: 'High-End Audio & Tech Voucher',
    description: 'Flat $50 off premium headphones, sound systems, and studio monitors.',
    discountType: 'fixed_amount',
    discountValue: 50,
    minOrderValue: 250,
    usageLimit: 200,
    usageCount: 182,
    perCustomerLimit: 1,
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // expires in 2 days
    status: 'active',
    appliesTo: 'specific_categories',
    targetIds: ['electronics', 'audio'],
    totalSavings: 9100.0,
    createdAt: '2026-09-01T11:00:00.000Z',
    updatedAt: '2026-11-14T11:10:00.000Z',
  },
  {
    id: 'promo-05',
    code: 'VIPCLUB15',
    title: 'Exclusive VIP Gold Member Tier',
    description: '15% savings reserved exclusively for Tier 3 Loyalty Club members.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 40,
    usageLimit: 300,
    usageCount: 156,
    perCustomerLimit: 3,
    startDate: '2026-03-15T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    status: 'active',
    appliesTo: 'all_products',
    totalSavings: 3840.0,
    createdAt: '2026-03-15T12:00:00.000Z',
    updatedAt: '2026-11-11T16:20:00.000Z',
  },
  {
    id: 'promo-06',
    code: 'BLACKFRIDAY',
    title: 'Black Friday Super Weekend',
    description: 'Massive 35% discount sitewide for holiday season kickoff.',
    discountType: 'percentage',
    discountValue: 35,
    minOrderValue: 100,
    maxDiscountValue: 150,
    usageLimit: 2000,
    usageCount: 0,
    perCustomerLimit: 2,
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // starts in 10 days
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    appliesTo: 'all_products',
    totalSavings: 0,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-14T10:00:00.000Z',
  },
  {
    id: 'promo-07',
    code: 'SPRINGFEST',
    title: 'Spring Season Clearance Blowout',
    description: '30% clearance discount across previous quarter inventory.',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 35,
    usageLimit: 400,
    usageCount: 400,
    perCustomerLimit: 1,
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-04-15T23:59:59.000Z',
    status: 'expired',
    appliesTo: 'all_products',
    totalSavings: 8450.0,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-04-16T00:00:00.000Z',
  },
  {
    id: 'promo-08',
    code: 'OFFPEAK20',
    title: 'Midweek Flash Deal (Suspended)',
    description: '$20 voucher for Tuesday/Wednesday purchases over $100.',
    discountType: 'fixed_amount',
    discountValue: 20,
    minOrderValue: 100,
    usageLimit: 100,
    usageCount: 45,
    perCustomerLimit: 1,
    startDate: '2026-08-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    status: 'disabled',
    appliesTo: 'all_products',
    totalSavings: 900.0,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-10-10T14:30:00.000Z',
  },
]

export function loadPromotionsFromStorage(): PromotionItem[] {
  if (typeof window === 'undefined') return INITIAL_PROMOTIONS
  try {
    const raw = localStorage.getItem(PROMOTIONS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(INITIAL_PROMOTIONS))
      return INITIAL_PROMOTIONS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(INITIAL_PROMOTIONS))
    return INITIAL_PROMOTIONS
  } catch {
    return INITIAL_PROMOTIONS
  }
}

export function savePromotionsToStorage(items: PromotionItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to save promotions to localStorage', err)
  }
}

export function calculatePromotionMetrics(items: PromotionItem[]): PromotionMetrics {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  let activeCount = 0
  let totalRedemptions = 0
  let totalDiscountGiven = 0
  let expiringSoonCount = 0

  for (const item of items) {
    if (item.status === 'active') {
      activeCount++
    }

    totalRedemptions += item.usageCount ?? 0
    totalDiscountGiven += item.totalSavings ?? 0

    if (item.endDate && item.status === 'active') {
      const end = new Date(item.endDate)
      if (end > now && end <= threeDaysFromNow) {
        expiringSoonCount++
      }
    }
  }

  return {
    totalPromotions: items.length,
    activePromotions: activeCount,
    totalRedemptions,
    totalDiscountGiven,
    expiringSoonCount,
  }
}

