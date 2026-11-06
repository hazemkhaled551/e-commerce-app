export type BrandStatus = 'active' | 'inactive' | 'archived'

export interface BrandItem {
  id: string
  name: string
  slug: string
  logoUrl?: string
  websiteUrl?: string
  description?: string
  status: BrandStatus
  productCount: number
  isInternal: boolean
  country?: string
  contactEmail?: string
  createdAt: string
  updatedAt: string
}

export interface BrandFormData {
  id?: string
  name: string
  slug: string
  logoUrl?: string
  websiteUrl?: string
  description?: string
  status: BrandStatus
  isInternal: boolean
  country?: string
  contactEmail?: string
}

export interface BrandMetrics {
  totalBrands: number
  activeBrands: number
  internalBrands: number
  totalProductsAssigned: number
}

export interface BrandFilters {
  searchTerm: string
  status: BrandStatus | 'all'
  type: 'all' | 'internal' | 'partner'
  sortBy: 'name' | 'productCount' | 'recent'
}

