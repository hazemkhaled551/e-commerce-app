import type { CategoryItem, CategoryKpis, CategoryFormData } from '../types/category'

/**
 * Empty category KPIs placeholder.
 * Live KPIs are loaded from GET /api/v1/admin/categories/kpis.
 */
export const mockCategoryKpis: CategoryKpis = {
  totalCategories: 0,
  newThisQuarter: 0,
  activeDisplay: 0,
  activePercentText: '0% Live',
  avgProductsPerCategory: 0,
  featuredCollectionsCount: 0,
}

/**
 * Empty categories placeholder.
 * Live categories are loaded from GET /api/v1/admin/categories.
 */
export const mockCategories: CategoryItem[] = []

/**
 * Default empty category form data for the Add Category modal.
 */
export const defaultCategoryFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  parentId: '',
  imageUrl: '',
  imageFileName: '',
  imageSizeText: '',
  showInNav: true,
  featureOnHome: false,
  displayOrder: 1,
  seoTitle: '',
  seoDescription: '',
  status: 'active',
}
