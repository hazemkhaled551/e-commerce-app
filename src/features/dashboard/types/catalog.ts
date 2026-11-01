export type ProductStatus = 'published' | 'draft' | 'unpublished' | 'archived'

export type ProductStockState = 'in_stock' | 'low_stock' | 'critical_low' | 'out_of_stock'

export interface CatalogProduct {
  id: string
  name: string
  variantLabel: string
  sku: string
  upc: string
  category: string
  brand: string
  stockCount: number
  stockState: ProductStockState
  stockPercentage: number
  stockNote: string
  price: number
  originalPrice?: number
  costPrice: number
  marginPercent: number
  status: ProductStatus
  unitsSold30d: number
  revenue30dText: string
  lastUpdatedDate: string
  lastUpdatedBy: string
  imageUrl?: string
}

export interface CatalogMetrics {
  totalProducts: number
  publishedCount: number
  lowStockCount: number
  draftCount: number
}

export interface CatalogFilters {
  searchTerm: string
  category: string
  status: string
  stock: string
  brand: string
}

