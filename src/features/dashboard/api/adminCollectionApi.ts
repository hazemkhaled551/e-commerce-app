import { axiosInstance } from '@/lib/api/axiosInstance'
import type {
  CollectionFormData,
  CollectionItem,
  CollectionLocation,
  CollectionMetrics,
  CollectionProductsPayload,
  CollectionProductsResponse,
  CollectionStatus,
} from '../types/collection'

export interface CollectionQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: CollectionStatus | 'all' | 'ALL' | 'ACTIVE' | 'SCHEDULED' | 'DRAFT' | 'ARCHIVED'
  location?:
    | CollectionLocation
    | 'all'
    | 'ALL'
    | 'HOME_GRID'
    | 'STOREFRONT_CATALOG'
    | 'BANNER'
    | 'SIDEBAR'
  sortBy?: 'title' | 'productCount' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface AdminCollectionMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetAdminCollectionsResult {
  collections: CollectionItem[]
  meta: AdminCollectionMeta
}

export interface CheckCollectionSlugResult {
  available: boolean
  slug: string
  message?: string
}

export interface BulkCollectionStatusInput {
  collectionIds: string[]
  status: CollectionStatus | 'ACTIVE' | 'SCHEDULED' | 'DRAFT' | 'ARCHIVED'
}

export interface BulkCollectionDeleteInput {
  collectionIds: string[]
}

const UI_TO_API_LOCATION: Record<string, string> = {
  'Home Grid': 'HOME_GRID',
  HOME_GRID: 'HOME_GRID',
  'Storefront Catalog': 'STOREFRONT_CATALOG',
  STOREFRONT_CATALOG: 'STOREFRONT_CATALOG',
  Banner: 'BANNER',
  BANNER: 'BANNER',
  Sidebar: 'SIDEBAR',
  SIDEBAR: 'SIDEBAR',
  all: 'ALL',
  ALL: 'ALL',
}

const API_TO_UI_LOCATION: Record<string, CollectionLocation> = {
  HOME_GRID: 'Home Grid',
  'Home Grid': 'Home Grid',
  STOREFRONT_CATALOG: 'Storefront Catalog',
  'Storefront Catalog': 'Storefront Catalog',
  BANNER: 'Banner',
  Banner: 'Banner',
  SIDEBAR: 'Sidebar',
  Sidebar: 'Sidebar',
}

function toApiLocation(loc?: string): string {
  if (!loc) return 'STOREFRONT_CATALOG'
  return UI_TO_API_LOCATION[loc] ?? 'STOREFRONT_CATALOG'
}

function fromApiLocation(raw?: string): CollectionLocation {
  if (!raw) return 'Storefront Catalog'
  return API_TO_UI_LOCATION[raw] ?? API_TO_UI_LOCATION[raw.toUpperCase()] ?? 'Storefront Catalog'
}

function formatCollectionFromApi(item: Record<string, unknown>): CollectionItem {
  const imageObj = item.image as Record<string, unknown> | undefined
  const logoObj = item.logo as Record<string, unknown> | undefined
  const rawStatus = String(item.status ?? 'active').toLowerCase()
  const status: CollectionStatus =
    rawStatus === 'active' ||
    rawStatus === 'scheduled' ||
    rawStatus === 'draft' ||
    rawStatus === 'archived'
      ? rawStatus
      : 'active'

  const productsArray = Array.isArray(item.products)
    ? (item.products as Array<Record<string, unknown>>)
    : undefined

  const productIds = Array.isArray(item.productIds)
    ? (item.productIds as unknown[]).map((id) => String(id))
    : productsArray
      ? productsArray.map((p) => String(p.id ?? p._id ?? '')).filter(Boolean)
      : undefined

  const countObj = item._count as { products?: number } | undefined
  const productCount = Number(
    item.productCount ?? countObj?.products ?? productIds?.length ?? 0
  )

  return {
    id: String(item.id ?? item._id ?? ''),
    title: String(item.title ?? ''),
    slug: String(item.slug ?? ''),
    description: item.description ? String(item.description) : undefined,
    imageUrl: (item.logoUrl ??
      logoObj?.url ??
      item.imageUrl ??
      imageObj?.url ??
      '') as string | undefined,
    status,
    productCount,
    productIds,
    displayLocation: fromApiLocation(
      (item.displayLocation ?? item.location) as string | undefined
    ),
    isFeatured: Boolean(item.isFeatured),
    rulesType: 'manual',
    badgeText: item.badgeText ? String(item.badgeText) : undefined,
    createdAt: String(item.createdAt ?? new Date().toISOString()),
    updatedAt: String(item.updatedAt ?? new Date().toISOString()),
  }
}

/**
 * 3.2 GET /api/v1/admin/collections
 */
export async function getAdminCollections(
  params?: CollectionQueryParams
): Promise<GetAdminCollectionsResult> {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    sortBy: params?.sortBy ?? 'title',
    sortOrder: params?.sortOrder ?? 'asc',
  }

  if (params?.search?.trim()) {
    queryParams.search = params.search.trim()
  }
  if (params?.status && params.status !== 'all' && params.status !== 'ALL') {
    queryParams.status = params.status.toUpperCase()
  }
  if (params?.location && params.location !== 'all' && params.location !== 'ALL') {
    queryParams.location = toApiLocation(params.location)
  }

  const res = await axiosInstance.get('/api/v1/admin/collections', { params: queryParams })
  const data = res.data?.data ?? res.data
  const rawList = Array.isArray(data)
    ? data
    : (data?.collections ?? data?.items ?? [])
  const collections: CollectionItem[] = rawList.map((item: Record<string, unknown>) =>
    formatCollectionFromApi(item)
  )

  const metaRaw = res.data?.meta
  const meta: AdminCollectionMeta = metaRaw
    ? {
        page: Number(metaRaw.page ?? queryParams.page),
        limit: Number(metaRaw.limit ?? queryParams.limit),
        totalItems: Number(metaRaw.totalItems ?? collections.length),
        totalPages: Number(metaRaw.totalPages ?? 1),
        hasNextPage: Boolean(metaRaw.hasNextPage),
        hasPrevPage: Boolean(metaRaw.hasPrevPage),
      }
    : {
        page: Number(queryParams.page),
        limit: Number(queryParams.limit),
        totalItems: collections.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }

  return { collections, meta }
}

/**
 * 3.3 GET /api/v1/admin/collections/metrics
 */
export async function getAdminCollectionMetrics(): Promise<CollectionMetrics> {
  const res = await axiosInstance.get('/api/v1/admin/collections/metrics')
  const d = res.data?.data ?? res.data ?? {}
  return {
    totalCollections: Number(d.totalCollections ?? 0),
    activeCollections: Number(d.activeCollections ?? 0),
    featuredCount: Number(d.featuredCount ?? 0),
    curatedProductsCount: Number(d.curatedProductsCount ?? d.totalProducts ?? 0),
  }
}

/**
 * 3.4 GET /api/v1/admin/collections/check-slug
 */
export async function checkCollectionSlugAvailability(
  slug: string
): Promise<CheckCollectionSlugResult> {
  const cleanSlug = slug.trim().toLowerCase()
  if (!cleanSlug) {
    return { available: false, slug: '', message: 'Slug is required' }
  }
  const res = await axiosInstance.get('/api/v1/admin/collections/check-slug', {
    params: { slug: cleanSlug },
  })
  const d = res.data?.data ?? res.data ?? {}
  return {
    available: Boolean(d.available),
    slug: String(d.slug ?? cleanSlug),
    message: d.message ? String(d.message) : undefined,
  }
}

/**
 * 3.5 GET /api/v1/admin/collections/:id
 */
export async function getAdminCollectionById(id: string): Promise<CollectionItem> {
  const res = await axiosInstance.get(`/api/v1/admin/collections/${encodeURIComponent(id)}`)
  return formatCollectionFromApi((res.data?.data ?? res.data ?? {}) as Record<string, unknown>)
}

/**
 * 3.1 POST /api/v1/admin/collections (multipart/form-data)
 */
export async function createAdminCollection(
  formData: CollectionFormData,
  imageFile?: File | null
): Promise<CollectionItem> {
  const fd = new FormData()
  fd.append('title', formData.title.trim())
  fd.append('slug', formData.slug.trim().toLowerCase())
  if (formData.description?.trim()) fd.append('description', formData.description.trim())
  fd.append('displayLocation', toApiLocation(formData.displayLocation))
  fd.append('status', formData.status.toUpperCase())
  fd.append('isFeatured', String(formData.isFeatured))
  if (formData.badgeText?.trim()) fd.append('badgeText', formData.badgeText.trim())
  if (imageFile) fd.append('image', imageFile)

  const res = await axiosInstance.post('/api/v1/admin/collections', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return formatCollectionFromApi((res.data?.data ?? res.data ?? {}) as Record<string, unknown>)
}

/**
 * 3.6 PUT /api/v1/admin/collections/:id (multipart/form-data)
 */
export async function updateAdminCollection(
  id: string,
  formData: CollectionFormData,
  imageFile?: File | null
): Promise<CollectionItem> {
  const fd = new FormData()
  fd.append('title', formData.title.trim())
  fd.append('slug', formData.slug.trim().toLowerCase())
  if (formData.description?.trim()) fd.append('description', formData.description.trim())
  fd.append('displayLocation', toApiLocation(formData.displayLocation))
  fd.append('status', formData.status.toUpperCase())
  fd.append('isFeatured', String(formData.isFeatured))
  if (formData.badgeText?.trim()) fd.append('badgeText', formData.badgeText.trim())
  if (imageFile) fd.append('image', imageFile)

  const res = await axiosInstance.put(
    `/api/v1/admin/collections/${encodeURIComponent(id)}`,
    fd,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return formatCollectionFromApi((res.data?.data ?? res.data ?? {}) as Record<string, unknown>)
}

/**
 * 3.7 DELETE /api/v1/admin/collections/:id
 */
export async function deleteAdminCollection(id: string): Promise<void> {
  await axiosInstance.delete(`/api/v1/admin/collections/${encodeURIComponent(id)}`)
}

/**
 * 3.8 POST /api/v1/admin/collections/bulk-status
 */
export async function bulkUpdateCollectionStatus(
  input: BulkCollectionStatusInput
): Promise<{ affectedCount: number }> {
  const res = await axiosInstance.post('/api/v1/admin/collections/bulk-status', {
    collectionIds: input.collectionIds,
    status: input.status.toUpperCase(),
  })
  const d = res.data?.data ?? res.data ?? {}
  return { affectedCount: Number(d.affectedCount ?? input.collectionIds.length) }
}

/**
 * 3.9 POST /api/v1/admin/collections/bulk-delete
 */
export async function bulkDeleteCollections(
  input: BulkCollectionDeleteInput
): Promise<{ affectedCount: number }> {
  const res = await axiosInstance.post('/api/v1/admin/collections/bulk-delete', input)
  const d = res.data?.data ?? res.data ?? {}
  return { affectedCount: Number(d.affectedCount ?? input.collectionIds.length) }
}

/**
 * 3.10 POST /api/v1/admin/collections/:id/products
 */
export async function updateCollectionProducts(
  collectionId: string,
  payload: CollectionProductsPayload
): Promise<CollectionProductsResponse> {
  const response = await axiosInstance.post<CollectionProductsResponse>(
    `/api/v1/admin/collections/${encodeURIComponent(collectionId)}/products`,
    payload
  )
  return response.data
}
