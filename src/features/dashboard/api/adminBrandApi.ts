import { axiosInstance, normalizeImageUrl } from '@/lib/api/axiosInstance'
import type { BrandItem, BrandFormData, BrandMetrics, BrandStatus } from '../types/brand'

export interface BrandQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: BrandStatus | 'all' | 'ALL' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  type?: 'all' | 'internal' | 'partner' | 'ALL' | 'INTERNAL' | 'PARTNER'
  sortBy?: 'name' | 'productCount' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface AdminBrandMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetAdminBrandsResult {
  brands: BrandItem[]
  meta: AdminBrandMeta
}

export interface CheckSlugResult {
  available: boolean
  slug: string
  message?: string
}

export interface BulkStatusInput {
  brandIds: string[]
  status: 'active' | 'inactive' | 'archived' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}

export interface BulkDeleteInput {
  brandIds: string[]
}

function formatBrandFromApi(item: Record<string, unknown>): BrandItem {
  const logoObj = item.logo as Record<string, unknown> | undefined
  const rawStatus = ((item.status as string) ?? 'active').toLowerCase()
  const status: BrandStatus =
    rawStatus === 'active' || rawStatus === 'inactive' || rawStatus === 'archived'
      ? rawStatus
      : 'active'
  const rawLogo =
    (item.logoUrl as string | undefined) ??
    (typeof item.logo === 'string' ? item.logo : logoObj?.url) ??
    (item.imageUrl as string | undefined)

  return {
    id: (item.id ?? item._id ?? '') as string,
    name: (item.name ?? '') as string,
    slug: (item.slug ?? '') as string,
    logoUrl: normalizeImageUrl(rawLogo),
    websiteUrl: (item.websiteUrl ?? '') as string | undefined,
    description: (item.description ?? '') as string | undefined,
    status,
    productCount: Number(item.productCount ?? 0),
    isInternal: Boolean(item.isInternal),
    country: (item.country ?? '') as string | undefined,
    contactEmail: (item.contactEmail ?? '') as string | undefined,
    createdAt: (item.createdAt ?? new Date().toISOString()) as string,
    updatedAt: (item.updatedAt ?? new Date().toISOString()) as string,
  }
}

export async function getAdminBrands(params?: BrandQueryParams): Promise<GetAdminBrandsResult> {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    type: params?.type ? params.type.toUpperCase() : 'ALL',
    sortBy: params?.sortBy ?? 'name',
    sortOrder: params?.sortOrder ?? 'asc',
  }

  if (params?.search?.trim()) {
    queryParams.search = params.search.trim()
  }
  if (params?.status) {
    queryParams.status = params.status.toUpperCase()
  }

  const res = await axiosInstance.get('/api/v1/admin/brands', { params: queryParams })
  const data = res.data?.data ?? res.data
  const items: BrandItem[] = Array.isArray(data)
    ? data.map(formatBrandFromApi)
    : (data?.brands ?? data?.items ?? []).map(formatBrandFromApi)

  const metaRaw = res.data?.meta
  const meta: AdminBrandMeta = metaRaw
    ? {
        page: Number(metaRaw.page ?? queryParams.page),
        limit: Number(metaRaw.limit ?? queryParams.limit),
        totalItems: Number(metaRaw.totalItems ?? items.length),
        totalPages: Number(metaRaw.totalPages ?? 1),
        hasNextPage: Boolean(metaRaw.hasNextPage),
        hasPrevPage: Boolean(metaRaw.hasPrevPage),
      }
    : {
        page: Number(queryParams.page),
        limit: Number(queryParams.limit),
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
  return { brands: items, meta }
}

export async function getAdminBrandMetrics(): Promise<BrandMetrics> {
  const res = await axiosInstance.get('/api/v1/admin/brands/metrics')
  const d = res.data?.data ?? res.data ?? {}
  return {
    totalBrands: Number(d.totalBrands ?? 0),
    activeBrands: Number(d.activeBrands ?? 0),
    internalBrands: Number(d.internalBrands ?? 0),
    totalProductsAssigned: Number(d.totalProductsAssigned ?? d.totalProducts ?? 0),
  }
}

export async function checkBrandSlugAvailability(
  slug: string,
  excludeId?: string
): Promise<CheckSlugResult> {
  const cleanSlug = slug.trim().toLowerCase()
  if (!cleanSlug) {
    return { available: false, slug: '', message: 'Slug is required' }
  }
  const params: Record<string, string> = { slug: cleanSlug }
  if (excludeId) params.excludeId = excludeId
  const res = await axiosInstance.get('/api/v1/admin/brands/check-slug', { params })
  const d = res.data?.data ?? res.data
  return {
    available: Boolean(d.available),
    slug: d.slug ?? cleanSlug,
    message: d.message,
  }
}

export async function getAdminBrandById(id: string): Promise<BrandItem> {
  const res = await axiosInstance.get(`/api/v1/admin/brands/${encodeURIComponent(id)}`)
  return formatBrandFromApi(res.data?.data ?? res.data)
}

export async function createAdminBrand(formData: BrandFormData, logoFile?: File | null): Promise<BrandItem> {
  const fd = new FormData()
  fd.append('name', formData.name.trim())
  fd.append('slug', formData.slug.trim().toLowerCase())
  if (formData.websiteUrl?.trim()) fd.append('websiteUrl', formData.websiteUrl.trim())
  if (formData.description?.trim()) fd.append('description', formData.description.trim())
  fd.append('status', formData.status.toUpperCase())
  fd.append('isInternal', String(formData.isInternal))
  if (formData.country?.trim()) fd.append('country', formData.country.trim())
  if (formData.contactEmail?.trim()) fd.append('contactEmail', formData.contactEmail.trim())
  if (logoFile) fd.append('logo', logoFile)

  const res = await axiosInstance.post('/api/v1/admin/brands', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return formatBrandFromApi(res.data?.data ?? res.data)
}

export async function updateAdminBrand(
  id: string,
  formData: BrandFormData,
  logoFile?: File | null
): Promise<BrandItem> {
  const fd = new FormData()
  fd.append('name', formData.name.trim())
  fd.append('slug', formData.slug.trim().toLowerCase())
  if (formData.websiteUrl?.trim()) fd.append('websiteUrl', formData.websiteUrl.trim())
  if (formData.description?.trim()) fd.append('description', formData.description.trim())
  fd.append('status', formData.status.toUpperCase())
  fd.append('isInternal', String(formData.isInternal))
  if (formData.country?.trim()) fd.append('country', formData.country.trim())
  if (formData.contactEmail?.trim()) fd.append('contactEmail', formData.contactEmail.trim())
  if (logoFile) fd.append('logo', logoFile)

  const res = await axiosInstance.put(`/api/v1/admin/brands/${encodeURIComponent(id)}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return formatBrandFromApi(res.data?.data ?? res.data)
}

export async function deleteAdminBrand(id: string): Promise<void> {
  await axiosInstance.delete(`/api/v1/admin/brands/${encodeURIComponent(id)}`)
}

export async function bulkUpdateBrandStatus(input: BulkStatusInput): Promise<{ affectedCount: number }> {
  const res = await axiosInstance.post('/api/v1/admin/brands/bulk-status', {
    brandIds: input.brandIds,
    status: input.status.toUpperCase(),
  })
  const d = res.data?.data ?? res.data
  return { affectedCount: Number(d.affectedCount ?? input.brandIds.length) }
}

export async function bulkDeleteBrands(input: BulkDeleteInput): Promise<{ affectedCount: number }> {
  const res = await axiosInstance.post('/api/v1/admin/brands/bulk-delete', input)
  const d = res.data?.data ?? res.data
  return { affectedCount: Number(d.affectedCount ?? input.brandIds.length) }
}
