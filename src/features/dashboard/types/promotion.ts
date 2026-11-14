export type PromotionDiscountType = 'percentage' | 'fixed_amount' | 'free_shipping'

export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'disabled'

export type PromotionAppliesTo =
  | 'all_products'
  | 'specific_categories'
  | 'specific_collections'
  | 'specific_products'

export interface PromotionItem {
  id: string
  code: string
  title: string
  description?: string
  discountType: PromotionDiscountType
  discountValue: number // percentage (0-100) or fixed amount ($)
  minOrderValue?: number
  maxDiscountValue?: number
  usageLimit?: number | null // null means unlimited
  usageCount: number
  perCustomerLimit?: number
  startDate: string // ISO string
  endDate?: string | null // ISO string, null means never expires
  status: PromotionStatus
  appliesTo: PromotionAppliesTo
  targetIds?: string[]
  totalSavings?: number
  createdAt: string
  updatedAt: string
}

export interface PromotionFormData {
  code: string
  title: string
  description?: string
  discountType: PromotionDiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscountValue?: number
  usageLimit?: number | null
  perCustomerLimit?: number
  startDate: string
  endDate?: string | null
  status: PromotionStatus
  appliesTo: PromotionAppliesTo
  targetIds?: string[]
}

export interface PromotionMetrics {
  totalPromotions: number
  activePromotions: number
  totalRedemptions: number
  totalDiscountGiven: number
  expiringSoonCount: number
}

export interface PromotionFilters {
  searchTerm: string
  status: PromotionStatus | 'all'
  discountType: PromotionDiscountType | 'all'
  sortBy: 'code' | 'usageCount' | 'recent' | 'discountValue' | 'endDate'
}

