export type CategoryStatus = 'active' | 'draft' | 'scheduled' | 'archived'
export type CategoryLevel = 'root' | 'subcategory'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  fullPath: string
  description: string
  level: CategoryLevel
  parentId?: string
  parentName?: string
  imageUrl: string
  imageFileName?: string
  imageSizeText?: string
  totalProductsCount: number
  subcategoriesCount?: number
  status: CategoryStatus
  scheduledDateText?: string
  isFeatured: boolean
  displayOrder: string
  showInNav: boolean
  featureOnHome: boolean
  seoTitle: string
  seoDescription: string
}

export interface CategoryKpis {
  totalCategories: number
  newThisQuarter: number
  activeDisplay: number
  activePercentText: string
  avgProductsPerCategory: number
  featuredCollectionsCount: number
}

export interface CategoryFilters {
  searchTerm: string
  status: string
  level: string
}

export interface CategoryFormData {
  id?: string
  name: string
  slug: string
  description: string
  parentId: string
  imageUrl: string
  imageFileName: string
  imageSizeText: string
  showInNav: boolean
  featureOnHome: boolean
  displayOrder: number
  seoTitle: string
  seoDescription: string
  status: CategoryStatus
}

