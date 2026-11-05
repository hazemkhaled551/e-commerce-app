export { DashboardOverviewPage } from './pages/DashboardOverviewPage'
export { OrdersPage } from './pages/OrdersPage'
export { OrderDetailPage } from './pages/OrderDetailPage'
export { ProductsCatalogPage } from './pages/ProductsCatalogPage'
export { ProductEditPage } from './pages/ProductEditPage'
export { CategoriesPage } from './pages/CategoriesPage'
export {
  getAdminProducts,
  getAdminProductMetrics,
  getAdminProductById,
} from './api/adminProductApi'
export {
  getAdminCategories,
  getAdminCategoryKpis,
} from './api/adminCategoryApi'

export type { DashboardOrder, DashboardKpi, OrderFilterTab } from './types/dashboard'
export type {
  CatalogProduct,
  CatalogMetrics,
  CatalogFilters,
  ProductStatus,
  ProductStockState,
} from './types/catalog'
export type {
  ProductFormData,
  ProductMediaItem,
  WarehouseAllocation,
  VariantOptionItem,
  VariantCombination,
} from './types/productForm'
export type {
  CategoryItem,
  CategoryKpis,
  CategoryFilters,
  CategoryFormData,
  CategoryStatus,
  CategoryLevel,
} from './types/category'
