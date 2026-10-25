export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  originalPrice?: number
  description: string
  category: string
  image: string
  rating: ProductRating
  badge?: string
  badgeVariant?: 'accent' | 'limited' | 'danger' | 'primary' | 'default'
  stockLabel?: string
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
  variantLabel?: string
  rankTag?: string
}

export type ProductSortOption = 'featured' | 'price-low' | 'price-high' | 'rating'

export interface ProductFilterState {
  searchQuery: string
  category: string
  sortBy: ProductSortOption
}
