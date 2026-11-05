import type { CatalogProduct, CatalogMetrics } from '../types/catalog'

/**
 * Empty catalog metrics placeholder.
 * All live metrics are fetched from GET /api/v1/admin/products/metrics.
 */
export const mockCatalogMetrics: CatalogMetrics = {
  totalProducts: 0,
  publishedCount: 0,
  lowStockCount: 0,
  draftCount: 0,
}

/**
 * Empty catalog products placeholder.
 * All live products are fetched dynamically from GET /api/v1/admin/products.
 */
export const mockCatalogProducts: CatalogProduct[] = []
