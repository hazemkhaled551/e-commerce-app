import { axiosInstance } from '@/lib/api/axiosInstance'
import type {
  PromotionFormData,
  PromotionItem,
  PromotionMetrics,
  PromotionStatus,
  PromotionDiscountType,
} from '../types/promotion'
import {
  loadPromotionsFromStorage,
  savePromotionsToStorage,
  calculatePromotionMetrics,
} from '../data/mockPromotionData'

export interface PromotionQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: PromotionStatus | 'all'
  discountType?: PromotionDiscountType | 'all'
  sortBy?: 'code' | 'usageCount' | 'recent' | 'discountValue' | 'endDate'
  sortOrder?: 'asc' | 'desc'
}

export interface AdminPromotionMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetAdminPromotionsResult {
  promotions: PromotionItem[]
  meta: AdminPromotionMeta
}

export interface CheckPromotionCodeResult {
  available: boolean
  code: string
  message?: string
}

export interface BulkPromotionStatusInput {
  promotionIds: string[]
  status: PromotionStatus
}

export interface BulkPromotionDeleteInput {
  promotionIds: string[]
}

function formatPromotionFromApi(item: Record<string, unknown>): PromotionItem {
  const rawStatus = String(item.status ?? 'active').toLowerCase()
  const status: PromotionStatus =
    rawStatus === 'active' ||
    rawStatus === 'scheduled' ||
    rawStatus === 'expired' ||
    rawStatus === 'disabled'
      ? rawStatus
      : 'active'

  const rawType = String(item.discountType ?? item.type ?? 'percentage').toLowerCase()
  const discountType: PromotionDiscountType =
    rawType === 'fixed_amount' || rawType === 'free_shipping' ? rawType : 'percentage'

  return {
    id: String(item.id ?? item._id ?? ''),
    code: String(item.code ?? '').toUpperCase(),
    title: String(item.title ?? item.name ?? ''),
    description: item.description ? String(item.description) : undefined,
    discountType,
    discountValue: Number(item.discountValue ?? item.value ?? 0),
    minOrderValue: item.minOrderValue != null ? Number(item.minOrderValue) : undefined,
    maxDiscountValue: item.maxDiscountValue != null ? Number(item.maxDiscountValue) : undefined,
    usageLimit: item.usageLimit != null ? Number(item.usageLimit) : null,
    usageCount: Number(item.usageCount ?? 0),
    perCustomerLimit: item.perCustomerLimit != null ? Number(item.perCustomerLimit) : undefined,
    startDate: String(item.startDate ?? new Date().toISOString()),
    endDate: item.endDate ? String(item.endDate) : null,
    status,
    appliesTo: (item.appliesTo as PromotionItem['appliesTo']) ?? 'all_products',
    targetIds: Array.isArray(item.targetIds) ? (item.targetIds as string[]) : undefined,
    totalSavings: item.totalSavings != null ? Number(item.totalSavings) : 0,
    createdAt: String(item.createdAt ?? new Date().toISOString()),
    updatedAt: String(item.updatedAt ?? new Date().toISOString()),
  }
}

/**
 * Filter & paginate mock promotions locally when backend endpoint is not available
 */
function queryMockPromotions(params?: PromotionQueryParams): GetAdminPromotionsResult {
  const all = loadPromotionsFromStorage()
  let filtered = [...all]

  // Search filter (code, title, description)
  if (params?.search?.trim()) {
    const term = params.search.trim().toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.code.toLowerCase().includes(term) ||
        p.title.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    )
  }

  // Status filter
  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter((p) => p.status === params.status)
  }

  // Discount Type filter
  if (params?.discountType && params.discountType !== 'all') {
    filtered = filtered.filter((p) => p.discountType === params.discountType)
  }

  // Sorting
  const sortBy = params?.sortBy ?? 'code'
  filtered.sort((a, b) => {
    if (sortBy === 'usageCount') {
      return (b.usageCount ?? 0) - (a.usageCount ?? 0)
    }
    if (sortBy === 'recent') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
    if (sortBy === 'discountValue') {
      return (b.discountValue ?? 0) - (a.discountValue ?? 0)
    }
    if (sortBy === 'endDate') {
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity
      return aEnd - bEnd
    }
    return a.code.localeCompare(b.code)
  })

  const page = Math.max(1, Number(params?.page ?? 1))
  const limit = Math.max(1, Number(params?.limit ?? 10))
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const startIndex = (page - 1) * limit
  const paginated = filtered.slice(startIndex, startIndex + limit)

  return {
    promotions: paginated,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

/**
 * GET /api/v1/admin/promotions with fallback
 */
export async function getAdminPromotions(
  params?: PromotionQueryParams
): Promise<GetAdminPromotionsResult> {
  try {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      sortBy: params?.sortBy ?? 'code',
      sortOrder: params?.sortOrder ?? 'asc',
    }

    if (params?.search?.trim()) queryParams.search = params.search.trim()
    if (params?.status && params.status !== 'all') queryParams.status = params.status
    if (params?.discountType && params.discountType !== 'all')
      queryParams.discountType = params.discountType

    const res = await axiosInstance.get('/api/v1/admin/promotions', { params: queryParams })
    const data = res.data?.data ?? res.data
    const rawList = Array.isArray(data) ? data : data?.promotions ?? data?.items ?? []
    const promotions = rawList.map((item: Record<string, unknown>) =>
      formatPromotionFromApi(item)
    )

    const metaRaw = res.data?.meta
    const meta: AdminPromotionMeta = metaRaw
      ? {
          page: Number(metaRaw.page ?? queryParams.page),
          limit: Number(metaRaw.limit ?? queryParams.limit),
          totalItems: Number(metaRaw.totalItems ?? promotions.length),
          totalPages: Number(metaRaw.totalPages ?? 1),
          hasNextPage: Boolean(metaRaw.hasNextPage),
          hasPrevPage: Boolean(metaRaw.hasPrevPage),
        }
      : {
          page: Number(queryParams.page),
          limit: Number(queryParams.limit),
          totalItems: promotions.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }

    return { promotions, meta }
  } catch {
    // Graceful fallback to client storage engine
    return queryMockPromotions(params)
  }
}

/**
 * GET /api/v1/admin/promotions/metrics with fallback
 */
export async function getAdminPromotionMetrics(): Promise<PromotionMetrics> {
  try {
    const res = await axiosInstance.get('/api/v1/admin/promotions/metrics')
    const d = res.data?.data ?? res.data ?? {}
    return {
      totalPromotions: Number(d.totalPromotions ?? 0),
      activePromotions: Number(d.activePromotions ?? 0),
      totalRedemptions: Number(d.totalRedemptions ?? 0),
      totalDiscountGiven: Number(d.totalDiscountGiven ?? 0),
      expiringSoonCount: Number(d.expiringSoonCount ?? 0),
    }
  } catch {
    const items = loadPromotionsFromStorage()
    return calculatePromotionMetrics(items)
  }
}

/**
 * GET /api/v1/admin/promotions/check-code with fallback
 */
export async function checkPromotionCodeAvailability(
  code: string,
  excludeId?: string
): Promise<CheckPromotionCodeResult> {
  const cleanCode = code.trim().toUpperCase()
  if (!cleanCode) {
    return { available: false, code: '', message: 'Code is required' }
  }

  try {
    const res = await axiosInstance.get('/api/v1/admin/promotions/check-code', {
      params: { code: cleanCode, excludeId },
    })
    const data = res.data?.data ?? res.data
    return {
      available: Boolean(data?.available ?? true),
      code: cleanCode,
      message: data?.message,
    }
  } catch {
    const all = loadPromotionsFromStorage()
    const duplicate = all.find(
      (p) => p.code.toUpperCase() === cleanCode && p.id !== excludeId
    )
    return {
      available: !duplicate,
      code: cleanCode,
      message: duplicate ? 'Promotion code is already in use' : 'Code is available',
    }
  }
}

/**
 * GET /api/v1/admin/promotions/:id with fallback
 */
export async function getAdminPromotionById(id: string): Promise<PromotionItem> {
  try {
    const res = await axiosInstance.get(`/api/v1/admin/promotions/${encodeURIComponent(id)}`)
    const data = res.data?.data ?? res.data
    return formatPromotionFromApi(data)
  } catch {
    const all = loadPromotionsFromStorage()
    const found = all.find((p) => p.id === id)
    if (!found) {
      throw new Error(`Promotion #${id} not found`)
    }
    return found
  }
}

/**
 * POST /api/v1/admin/promotions with fallback
 */
export async function createAdminPromotion(data: PromotionFormData): Promise<PromotionItem> {
  try {
    const res = await axiosInstance.post('/api/v1/admin/promotions', data)
    const result = res.data?.data ?? res.data
    return formatPromotionFromApi(result)
  } catch {
    const all = loadPromotionsFromStorage()
    const now = new Date().toISOString()
    const newPromo: PromotionItem = {
      id: `promo-${Date.now().toString(36)}`,
      code: data.code.trim().toUpperCase(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderValue: data.minOrderValue != null ? Number(data.minOrderValue) : undefined,
      maxDiscountValue: data.maxDiscountValue != null ? Number(data.maxDiscountValue) : undefined,
      usageLimit: data.usageLimit != null ? Number(data.usageLimit) : null,
      usageCount: 0,
      perCustomerLimit: data.perCustomerLimit != null ? Number(data.perCustomerLimit) : 1,
      startDate: data.startDate || now,
      endDate: data.endDate || null,
      status: data.status,
      appliesTo: data.appliesTo,
      targetIds: data.targetIds,
      totalSavings: 0,
      createdAt: now,
      updatedAt: now,
    }

    const updated = [newPromo, ...all]
    savePromotionsToStorage(updated)
    return newPromo
  }
}

/**
 * PUT /api/v1/admin/promotions/:id with fallback
 */
export async function updateAdminPromotion(
  id: string,
  data: Partial<PromotionFormData>
): Promise<PromotionItem> {
  try {
    const res = await axiosInstance.put(
      `/api/v1/admin/promotions/${encodeURIComponent(id)}`,
      data
    )
    const result = res.data?.data ?? res.data
    return formatPromotionFromApi(result)
  } catch {
    const all = loadPromotionsFromStorage()
    const index = all.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Promotion #${id} not found`)
    }

    const current = all[index]
    const updatedPromo: PromotionItem = {
      ...current,
      code: data.code ? data.code.trim().toUpperCase() : current.code,
      title: data.title ? data.title.trim() : current.title,
      description: data.description !== undefined ? data.description.trim() : current.description,
      discountType: data.discountType ?? current.discountType,
      discountValue: data.discountValue != null ? Number(data.discountValue) : current.discountValue,
      minOrderValue: data.minOrderValue !== undefined ? Number(data.minOrderValue) : current.minOrderValue,
      maxDiscountValue:
        data.maxDiscountValue !== undefined ? Number(data.maxDiscountValue) : current.maxDiscountValue,
      usageLimit: data.usageLimit !== undefined ? data.usageLimit : current.usageLimit,
      perCustomerLimit:
        data.perCustomerLimit !== undefined ? Number(data.perCustomerLimit) : current.perCustomerLimit,
      startDate: data.startDate || current.startDate,
      endDate: data.endDate !== undefined ? data.endDate : current.endDate,
      status: data.status ?? current.status,
      appliesTo: data.appliesTo ?? current.appliesTo,
      targetIds: data.targetIds ?? current.targetIds,
      updatedAt: new Date().toISOString(),
    }

    all[index] = updatedPromo
    savePromotionsToStorage(all)
    return updatedPromo
  }
}

/**
 * DELETE /api/v1/admin/promotions/:id with fallback
 */
export async function deleteAdminPromotion(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/api/v1/admin/promotions/${encodeURIComponent(id)}`)
  } catch {
    const all = loadPromotionsFromStorage()
    const remaining = all.filter((p) => p.id !== id)
    savePromotionsToStorage(remaining)
  }
}

/**
 * POST /api/v1/admin/promotions/bulk-status with fallback
 */
export async function bulkUpdatePromotionStatus(
  input: BulkPromotionStatusInput
): Promise<{ success: boolean; count: number }> {
  try {
    const res = await axiosInstance.post('/api/v1/admin/promotions/bulk-status', input)
    return res.data?.data ?? res.data ?? { success: true, count: input.promotionIds.length }
  } catch {
    const all = loadPromotionsFromStorage()
    const idsSet = new Set(input.promotionIds)
    const updated = all.map((p) =>
      idsSet.has(p.id) ? { ...p, status: input.status, updatedAt: new Date().toISOString() } : p
    )
    savePromotionsToStorage(updated)
    return { success: true, count: input.promotionIds.length }
  }
}

/**
 * POST /api/v1/admin/promotions/bulk-delete with fallback
 */
export async function bulkDeletePromotions(
  input: BulkPromotionDeleteInput
): Promise<{ success: boolean; count: number }> {
  try {
    const res = await axiosInstance.post('/api/v1/admin/promotions/bulk-delete', input)
    return res.data?.data ?? res.data ?? { success: true, count: input.promotionIds.length }
  } catch {
    const all = loadPromotionsFromStorage()
    const idsSet = new Set(input.promotionIds)
    const remaining = all.filter((p) => !idsSet.has(p.id))
    savePromotionsToStorage(remaining)
    return { success: true, count: input.promotionIds.length }
  }
}

