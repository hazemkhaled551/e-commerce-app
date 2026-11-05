import { axiosInstance } from '@/lib/api/axiosInstance'
import type { CatalogProduct, CatalogMetrics, ProductStatus, ProductStockState } from '../types/catalog'

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  stock?: string
  brand?: string
  sortBy?: 'name' | 'price' | 'stock' | 'updatedAt' | string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminProductMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetAdminProductsResult {
  products: CatalogProduct[]
  meta: AdminProductMeta
}

/**
 * Normalizes raw backend product data into the UI's CatalogProduct interface.
 */
export function formatProductFromApi(item: Record<string, unknown>): CatalogProduct {
  const stockCount = typeof item.stockCount === 'number' ? item.stockCount : 0
  const lowStockThreshold = typeof item.lowStockThreshold === 'number' ? item.lowStockThreshold : 5

  let stockState: ProductStockState = 'in_stock'
  if (stockCount <= 0) {
    stockState = 'out_of_stock'
  } else if (stockCount <= 1) {
    stockState = 'critical_low'
  } else if (stockCount <= lowStockThreshold) {
    stockState = 'low_stock'
  }

  if (
    typeof item.stockState === 'string' &&
    ['in_stock', 'low_stock', 'critical_low', 'out_of_stock'].includes(item.stockState)
  ) {
    stockState = item.stockState as ProductStockState
  }

  const price = typeof item.price === 'number' ? item.price : Number(item.basePrice || 0)
  const costPrice = typeof item.costPrice === 'number' ? item.costPrice : 0
  const marginPercent =
    typeof item.marginPercent === 'number'
      ? item.marginPercent
      : price > 0
        ? Math.round((((price - costPrice) / price) * 100) * 10) / 10
        : 0

  const statusRaw = String(item.status || item.productStatus || 'draft').toLowerCase()
  const status: ProductStatus =
    statusRaw === 'published'
      ? 'published'
      : statusRaw === 'unpublished'
        ? 'unpublished'
        : statusRaw === 'archived'
          ? 'archived'
          : 'draft'

  const categoryObj = item.category as { name?: string } | string | undefined
  const categoryName =
    typeof categoryObj === 'string'
      ? categoryObj
      : categoryObj?.name || 'Uncategorized'

  const brandObj = item.brand as { name?: string } | string | undefined
  const brandName =
    typeof brandObj === 'string'
      ? brandObj
      : brandObj?.name || 'General'

  const variants = item.variants as Array<{ sku?: string }> | undefined
  const media = item.media as Array<{ isPrimary?: boolean; url?: string }> | undefined
  const primaryMedia = media?.find((m) => m.isPrimary) ?? media?.[0]

  const updatedAtRaw = item.updatedAt as string | undefined
  const updatedAt = updatedAtRaw ? new Date(updatedAtRaw) : null
  const formattedDate = updatedAt && !isNaN(updatedAt.getTime())
    ? updatedAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently'

  return {
    id: String(item.id || ''),
    name: String(item.name || item.title || 'Untitled Product'),
    variantLabel: String(
      item.variantLabel ||
        (variants && variants.length > 0 ? `${variants.length} variants` : 'Single')
    ),
    sku: String(item.sku || variants?.[0]?.sku || 'N/A'),
    upc: String(item.upc || item.barcode || 'N/A'),
    category: categoryName,
    brand: brandName,
    stockCount,
    stockState,
    stockPercentage:
      typeof item.stockPercentage === 'number'
        ? item.stockPercentage
        : Math.min(100, Math.round((stockCount / 100) * 100)),
    stockNote: String(
      item.stockNote || (stockCount <= 0 ? 'Out of stock' : `${stockCount} units available`)
    ),
    price,
    originalPrice: item.originalPrice
      ? Number(item.originalPrice)
      : item.comparePrice
        ? Number(item.comparePrice)
        : undefined,
    costPrice,
    marginPercent,
    status,
    unitsSold30d: typeof item.unitsSold30d === 'number' ? item.unitsSold30d : 0,
    revenue30dText: String(
      item.revenue30dText || `$${(price * (Number(item.unitsSold30d) || 0)).toFixed(0)} revenue`
    ),
    lastUpdatedDate: String(item.lastUpdatedDate || formattedDate),
    lastUpdatedBy: String(item.lastUpdatedBy || 'Administrator'),
    imageUrl:
      typeof item.imageUrl === 'string' && item.imageUrl
        ? item.imageUrl
        : primaryMedia?.url || undefined,
  }
}

/**
 * GET /api/v1/admin/products
 * Fetch paginated, filtered, and sorted products catalog from the backend API.
 */
export async function getAdminProducts(
  params?: ProductQueryParams
): Promise<GetAdminProductsResult> {
  const queryParams: Record<string, unknown> = {}

  if (params?.page) queryParams.page = params.page
  if (params?.limit) queryParams.limit = params.limit
  if (params?.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params?.category && params.category !== 'all') queryParams.category = params.category
  if (params?.status && params.status !== 'all') queryParams.status = params.status
  if (params?.stock && params.stock !== 'all') queryParams.stock = params.stock
  if (params?.brand && params.brand !== 'all') queryParams.brand = params.brand
  if (params?.sortBy) queryParams.sortBy = params.sortBy
  if (params?.sortOrder) queryParams.sortOrder = params.sortOrder

  const response = await axiosInstance.get('/api/v1/admin/products', {
    params: queryParams,
  })

  const payload = response.data
  const rawList: Record<string, unknown>[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : []

  const products = rawList.map((item) => formatProductFromApi(item))

  const metaRaw = payload?.meta || {}
  const meta: AdminProductMeta = {
    page: typeof metaRaw.page === 'number' ? metaRaw.page : params?.page || 1,
    limit: typeof metaRaw.limit === 'number' ? metaRaw.limit : params?.limit || 10,
    totalItems: typeof metaRaw.totalItems === 'number' ? metaRaw.totalItems : products.length,
    totalPages:
      typeof metaRaw.totalPages === 'number'
        ? metaRaw.totalPages
        : Math.max(1, Math.ceil(products.length / (params?.limit || 10))),
    hasNextPage: Boolean(metaRaw.hasNextPage),
    hasPrevPage: Boolean(metaRaw.hasPrevPage),
  }

  return { products, meta }
}

/**
 * GET /api/v1/admin/products/metrics
 * Fetch catalog KPI metrics (total, published, low stock, drafts).
 */
export async function getAdminProductMetrics(): Promise<CatalogMetrics> {
  const response = await axiosInstance.get('/api/v1/admin/products/metrics')
  const data = response.data?.data || response.data || {}

  return {
    totalProducts: Number(data.totalProducts || 0),
    publishedCount: Number(data.publishedCount || 0),
    lowStockCount: Number(data.lowStockCount || 0),
    draftCount: Number(data.draftCount || 0),
  }
}

/**
 * GET /api/v1/admin/products/:id
 * Retrieve a single product details.
 */
export async function getAdminProductById(id: string): Promise<Record<string, unknown>> {
  const response = await axiosInstance.get(`/api/v1/admin/products/${encodeURIComponent(id)}`)
  return (response.data?.data || response.data || {}) as Record<string, unknown>
}

export interface CheckAvailabilityResult {
  available: boolean
  value: string
  message?: string
}

/**
 * GET /api/v1/admin/products/check-sku?sku=...
 * Verify whether a SKU code is available.
 */
export async function checkProductSkuAvailability(sku: string): Promise<CheckAvailabilityResult> {
  const cleanSku = sku.trim()
  if (!cleanSku) {
    return { available: false, value: '', message: 'SKU is required' }
  }

  try {
    const response = await axiosInstance.get('/api/v1/admin/products/check-sku', {
      params: { sku: cleanSku },
    })
    const payload = response.data
    const data = payload?.data || payload
    return {
      available: Boolean(data?.available),
      value: String(data?.sku || cleanSku),
    }
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: {
        data?: {
          message?: string
          errors?: string[]
        }
      }
    }
    const msg =
      axiosErr.response?.data?.errors?.[0] ||
      axiosErr.response?.data?.message ||
      'Invalid SKU or check failed'
    return {
      available: false,
      value: cleanSku,
      message: msg,
    }
  }
}

/**
 * GET /api/v1/admin/products/check-slug?slug=...
 * Verify whether a product slug is available.
 */
export async function checkProductSlugAvailability(slug: string): Promise<CheckAvailabilityResult> {
  const cleanSlug = slug.trim().toLowerCase()
  if (!cleanSlug) {
    return { available: false, value: '', message: 'Slug is required' }
  }

  try {
    const response = await axiosInstance.get('/api/v1/admin/products/check-slug', {
      params: { slug: cleanSlug },
    })
    const payload = response.data
    const data = payload?.data || payload
    return {
      available: Boolean(data?.available),
      value: String(data?.slug || cleanSlug),
    }
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: {
        data?: {
          message?: string
          errors?: string[]
        }
      }
    }
    const msg =
      axiosErr.response?.data?.errors?.[0] ||
      axiosErr.response?.data?.message ||
      'Invalid slug or check failed'
    return {
      available: false,
      value: cleanSlug,
      message: msg,
    }
  }
}

export interface CreateProductInput {
  title: string
  slug: string
  sku: string
  categoryId: string
  basePrice: number
  comparePrice?: number
  costPrice?: number
  stockCount?: number
  lowStockThreshold?: number
  productStatus?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | string
  subtitle?: string
  descriptionHtml?: string
  barcode?: string
  has3dAsset?: boolean
  chargeTax?: boolean
  taxProfileId?: string
  outOfStockPolicy?: string
  hasVariants?: boolean
  colorOptions?: Array<{ label: string; colorHex?: string }>
  careOptions?: Array<{ label: string; extraPrice?: number }>
  variants?: Array<Record<string, unknown>>
  weight?: number
  weightUnit?: string
  length?: number
  width?: number
  height?: number
  dimensionUnit?: string
  hsCode?: string
  shippingProfileId?: string
  cornerRibbon?: string
  allowPhotoReviews?: boolean
  featureInSpotlight?: boolean
  brandId?: string
  collectionIds?: string[]
  tags?: string[]
  customerHighlights?: string[]
  /** Actual image File objects to upload (up to 12) */
  images?: File[]
}

/**
 * POST /api/v1/admin/products
 * Create a new product SKU using multipart/form-data so images can be uploaded.
 */
export async function createAdminProduct(input: CreateProductInput): Promise<CatalogProduct> {
  const fd = new FormData()

  // ── Required fields ──────────────────────────────────────────────────────────
  fd.append('title', input.title.trim())
  fd.append('slug', input.slug.trim().toLowerCase())
  fd.append('sku', input.sku.trim())
  fd.append('categoryId', input.categoryId.trim())
  fd.append('basePrice', String(Number(input.basePrice) || 0))

  // ── Optional scalar fields ────────────────────────────────────────────────────
  if (input.comparePrice !== undefined) fd.append('comparePrice', String(Number(input.comparePrice)))
  if (input.costPrice !== undefined) fd.append('costPrice', String(Number(input.costPrice)))
  if (input.stockCount !== undefined) fd.append('stockCount', String(Number(input.stockCount)))
  if (input.lowStockThreshold !== undefined) fd.append('lowStockThreshold', String(Number(input.lowStockThreshold)))
  if (input.productStatus) fd.append('productStatus', input.productStatus.toUpperCase())
  if (input.subtitle) fd.append('subtitle', input.subtitle.trim())
  if (input.descriptionHtml) fd.append('descriptionHtml', input.descriptionHtml)
  if (input.barcode) fd.append('barcode', input.barcode.trim())
  if (input.has3dAsset !== undefined) fd.append('has3dAsset', String(input.has3dAsset))
  if (input.chargeTax !== undefined) fd.append('chargeTax', String(input.chargeTax))
  if (input.taxProfileId) fd.append('taxProfileId', input.taxProfileId.trim())
  if (input.outOfStockPolicy) {
    const policy =
      input.outOfStockPolicy === 'accept_backorders' || input.outOfStockPolicy === 'ALLOW_BACKORDER'
        ? 'ALLOW_BACKORDER'
        : 'STOP_SELLING'
    fd.append('outOfStockPolicy', policy)
  }
  if (input.hasVariants !== undefined) fd.append('hasVariants', String(input.hasVariants))
  if (input.weight !== undefined) fd.append('weight', String(Number(input.weight)))
  if (input.weightUnit) fd.append('weightUnit', input.weightUnit.toUpperCase())
  if (input.length !== undefined) fd.append('length', String(Number(input.length)))
  if (input.width !== undefined) fd.append('width', String(Number(input.width)))
  if (input.height !== undefined) fd.append('height', String(Number(input.height)))
  if (input.dimensionUnit) fd.append('dimensionUnit', input.dimensionUnit.toUpperCase())
  if (input.hsCode) fd.append('hsCode', input.hsCode.trim())
  if (input.shippingProfileId) fd.append('shippingProfileId', input.shippingProfileId.trim())
  if (input.cornerRibbon) fd.append('cornerRibbon', input.cornerRibbon)
  if (input.allowPhotoReviews !== undefined) fd.append('allowPhotoReviews', String(input.allowPhotoReviews))
  if (input.featureInSpotlight !== undefined) fd.append('featureInSpotlight', String(input.featureInSpotlight))
  if (input.brandId) fd.append('brandId', input.brandId.trim())

  // ── Array fields (append each element separately) ────────────────────────────
  if (input.tags && input.tags.length > 0) {
    input.tags.forEach((t) => fd.append('tags', t))
  }
  if (input.customerHighlights && input.customerHighlights.length > 0) {
    input.customerHighlights.forEach((h) => fd.append('customerHighlights', h))
  }
  if (input.collectionIds && input.collectionIds.length > 0) {
    input.collectionIds.forEach((c) => fd.append('collectionIds', c))
  }
  if (input.colorOptions && input.colorOptions.length > 0) {
    input.colorOptions.forEach((c) => fd.append('colorOptions', JSON.stringify(c)))
  }
  if (input.careOptions && input.careOptions.length > 0) {
    input.careOptions.forEach((c) => fd.append('careOptions', JSON.stringify(c)))
  }
  if (input.variants && input.variants.length > 0) {
    input.variants.forEach((v) => fd.append('variants', JSON.stringify(v)))
  }

  // ── Image files (up to 12) ────────────────────────────────────────────────────
  if (input.images && input.images.length > 0) {
    input.images.slice(0, 12).forEach((file) => fd.append('images', file))
  }

  // Do NOT set Content-Type header; axios/browser will set it with the correct boundary
  const response = await axiosInstance.post('/api/v1/admin/products', fd)
  const resData = response.data?.data || response.data
  return formatProductFromApi(resData || {})
}


