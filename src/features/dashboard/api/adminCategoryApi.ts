import { axiosInstance } from '@/lib/api/axiosInstance'
import type { CategoryItem, CategoryKpis, CategoryStatus, CategoryLevel } from '../types/category'

export interface CategoryQueryParams {
  view?: 'flat' | 'tree'
  status?: string
  level?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdminCategoryMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetAdminCategoriesResult {
  categories: CategoryItem[]
  meta: AdminCategoryMeta
}

/**
 * Normalizes raw category response from API into the UI CategoryItem interface.
 */
export function formatCategoryFromApi(item: Record<string, unknown>): CategoryItem {
  const levelRaw = String(item.level || '').toLowerCase()
  const level: CategoryLevel = levelRaw === 'subcategory' ? 'subcategory' : 'root'

  const statusRaw = String(item.status || 'active').toLowerCase()
  const status: CategoryStatus = ['active', 'draft', 'scheduled', 'archived'].includes(statusRaw)
    ? (statusRaw as CategoryStatus)
    : 'active'

  const parent = item.parent as { id?: string; name?: string } | undefined
  const parentId = item.parentId
    ? String(item.parentId)
    : parent?.id
      ? String(parent.id)
      : undefined
  const parentName = item.parentName
    ? String(item.parentName)
    : parent?.name
      ? String(parent.name)
      : undefined

  const slug = String(item.slug || '')
  const fullPath = String(
    item.fullPath ||
      (parentId && parentName
        ? `/${parentName.toLowerCase().replace(/\s+/g, '-')}/${slug}`
        : `/${slug}`)
  )

  const media = item.media as Array<{ url?: string; isPrimary?: boolean }> | undefined
  const primaryMedia = media?.find((m) => m.isPrimary) ?? media?.[0]
  const image = item.image as { url?: string } | string | undefined
  const imageUrl =
    typeof item.imageUrl === 'string' && item.imageUrl
      ? item.imageUrl
      : primaryMedia?.url
        ? primaryMedia.url
        : typeof image === 'string'
          ? image
          : image?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'

  const countObj = item._count as { products?: number; children?: number } | undefined
  const totalProductsCount =
    typeof item.totalProductsCount === 'number'
      ? item.totalProductsCount
      : typeof countObj?.products === 'number'
        ? countObj.products
        : 0

  const subcategoriesCount =
    typeof item.subcategoriesCount === 'number'
      ? item.subcategoriesCount
      : typeof countObj?.children === 'number'
        ? countObj.children
        : 0

  return {
    id: String(item.id || ''),
    name: String(item.name || ''),
    slug,
    fullPath,
    description: String(item.description || ''),
    level,
    parentId,
    parentName,
    imageUrl,
    imageFileName: item.imageFileName ? String(item.imageFileName) : undefined,
    imageSizeText: item.imageSizeText ? String(item.imageSizeText) : undefined,
    totalProductsCount,
    subcategoriesCount,
    status,
    scheduledDateText: item.scheduledDateText ? String(item.scheduledDateText) : undefined,
    isFeatured: Boolean(item.isFeatured ?? item.featureOnHome),
    displayOrder: item.displayOrder ? String(item.displayOrder) : '#1',
    showInNav: Boolean(item.showInNav ?? true),
    featureOnHome: Boolean(item.featureOnHome ?? item.isFeatured),
    seoTitle: String(item.seoTitle || item.name || ''),
    seoDescription: String(item.seoDescription || item.description || ''),
  }
}

/**
 * GET /api/v1/admin/categories
 * Retrieve categories in flat or tree view with search, level, and status filters.
 */
export async function getAdminCategories(
  params?: CategoryQueryParams
): Promise<GetAdminCategoriesResult> {
  const queryParams: Record<string, unknown> = {}

  if (params?.view) queryParams.view = params.view
  if (params?.status && params.status !== 'all') queryParams.status = params.status
  if (params?.level && params.level !== 'all') queryParams.level = params.level
  if (params?.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params?.page) queryParams.page = params.page
  if (params?.limit) queryParams.limit = params.limit

  const response = await axiosInstance.get('/api/v1/admin/categories', {
    params: queryParams,
  })

  const payload = response.data
  const rawList: Record<string, unknown>[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : []

  const categories = rawList.map((item) => formatCategoryFromApi(item))

  const metaRaw = payload?.meta || {}
  const meta: AdminCategoryMeta = {
    page: typeof metaRaw.page === 'number' ? metaRaw.page : params?.page || 1,
    limit: typeof metaRaw.limit === 'number' ? metaRaw.limit : params?.limit || 50,
    totalItems: typeof metaRaw.totalItems === 'number' ? metaRaw.totalItems : categories.length,
    totalPages:
      typeof metaRaw.totalPages === 'number'
        ? metaRaw.totalPages
        : Math.max(1, Math.ceil(categories.length / (params?.limit || 50))),
    hasNextPage: Boolean(metaRaw.hasNextPage),
    hasPrevPage: Boolean(metaRaw.hasPrevPage),
  }

  return { categories, meta }
}

/**
 * GET /api/v1/admin/categories/kpis
 * Retrieve categories KPI metrics.
 */
export async function getAdminCategoryKpis(): Promise<CategoryKpis> {
  const response = await axiosInstance.get('/api/v1/admin/categories/kpis')
  const data = response.data?.data || response.data || {}

  return {
    totalCategories: Number(data.totalCategories || 0),
    newThisQuarter: Number(data.newThisQuarter || 0),
    activeDisplay: Number(data.activeDisplay || 0),
    activePercentText: String(data.activePercentText || '0% Live'),
    avgProductsPerCategory: Number(data.avgProductsPerCategory || 0),
    featuredCollectionsCount: Number(data.featuredCollectionsCount || 0),
  }
}

export interface SlugCheckResult {
  available: boolean
  slug: string
  message?: string
}

/**
 * GET /api/v1/admin/categories/check-slug?slug=...
 * Check whether a category slug is available in real-time.
 */
export async function checkCategorySlugAvailability(slug: string): Promise<SlugCheckResult> {
  const cleanSlug = slug.trim().toLowerCase()
  if (!cleanSlug) {
    return { available: false, slug: '', message: 'Slug is required' }
  }

  try {
    const response = await axiosInstance.get('/api/v1/admin/categories/check-slug', {
      params: { slug: cleanSlug },
    })
    const payload = response.data
    const data = payload?.data || payload
    return {
      available: Boolean(data?.available),
      slug: String(data?.slug || cleanSlug),
    }
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: {
        status?: number
        data?: {
          message?: string
          errors?: string[]
        }
      }
    }
    const errorMsg =
      axiosErr.response?.data?.errors?.[0] ||
      axiosErr.response?.data?.message ||
      'Invalid or unavailable slug'
    return {
      available: false,
      slug: cleanSlug,
      message: errorMsg,
    }
  }
}

/**
 * GET /api/v1/admin/categories/{id}
 * Retrieve single category details.
 */
export async function getAdminCategoryById(id: string): Promise<CategoryItem> {
  const response = await axiosInstance.get(`/api/v1/admin/categories/${encodeURIComponent(id)}`)
  const payload = response.data
  const item = (payload?.data || payload) as Record<string, unknown>
  return formatCategoryFromApi(item)
}

export interface CreateCategoryInput {
  name: string
  slug: string
  parentId?: string | null
  description?: string
  status?: CategoryStatus
}

/**
 * POST /api/v1/admin/categories
 * Create a new root category or subcategory.
 */
export async function createAdminCategory(input: CreateCategoryInput): Promise<CategoryItem> {
  const payload = {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    parentId: input.parentId ? input.parentId.trim() : null,
    description: input.description?.trim() || '',
    status: input.status || 'draft',
  }

  const response = await axiosInstance.post('/api/v1/admin/categories', payload)
  const resData = response.data?.data || response.data
  return formatCategoryFromApi(resData)
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  parentId?: string | null
  description?: string
  status?: CategoryStatus
}

/**
 * PUT /api/v1/admin/categories/{id}
 * Update an existing category.
 */
export async function updateAdminCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<CategoryItem> {
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.slug !== undefined) payload.slug = input.slug.trim().toLowerCase()
  if (input.parentId !== undefined) {
    payload.parentId = input.parentId ? input.parentId.trim() : null
  }
  if (input.description !== undefined) payload.description = input.description.trim()
  if (input.status !== undefined) payload.status = input.status

  const response = await axiosInstance.put(
    `/api/v1/admin/categories/${encodeURIComponent(id)}`,
    payload
  )
  const resData = response.data?.data || response.data
  return formatCategoryFromApi(resData)
}

/**
 * DELETE /api/v1/admin/categories/{id}
 * Delete category with optional product reassignment.
 */
export async function deleteAdminCategory(
  id: string,
  reassignToId?: string
): Promise<{ deletedId: string }> {
  const response = await axiosInstance.delete(
    `/api/v1/admin/categories/${encodeURIComponent(id)}`,
    {
      params: reassignToId ? { reassignToId } : undefined,
    }
  )
  return response.data?.data || response.data
}


