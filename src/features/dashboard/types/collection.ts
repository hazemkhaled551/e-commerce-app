export type CollectionStatus = 'active' | 'scheduled' | 'draft' | 'archived'
export type CollectionLocation = 'Home Grid' | 'Sidebar' | 'Banner' | 'Storefront Catalog'
export type CollectionRuleType = 'manual' | 'smart_automated'

export interface CollectionItem {
  id: string
  title: string
  slug: string
  description?: string
  imageUrl?: string
  status: CollectionStatus
  productCount: number
  productIds?: string[]
  displayLocation: CollectionLocation
  isFeatured: boolean
  rulesType: CollectionRuleType
  badgeText?: string
  createdAt: string
  updatedAt: string
}

export type CollectionProductAction = 'add' | 'remove' | 'set'

export interface CollectionProductsPayload {
  action: CollectionProductAction
  productIds: string[]
}

export interface CollectionProductsResponse {
  success: boolean
  status: number
  message: string
  data: {
    collectionId: string
    productCount: number
  }
}

export interface CollectionFormData {
  id?: string
  title: string
  slug: string
  description?: string
  imageUrl?: string
  status: CollectionStatus
  displayLocation: CollectionLocation
  isFeatured: boolean
  rulesType: CollectionRuleType
  badgeText?: string
}

export interface CollectionMetrics {
  totalCollections: number
  activeCollections: number
  featuredCount: number
  curatedProductsCount: number
}

export interface CollectionFilters {
  searchTerm: string
  status: CollectionStatus | 'all'
  location: CollectionLocation | 'all'
  sortBy: 'title' | 'productCount' | 'recent'
}

