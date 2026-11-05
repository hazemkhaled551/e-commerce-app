import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type { CatalogProduct, CatalogFilters, CatalogMetrics } from '../types/catalog'
import {
  getAdminProducts,
  getAdminProductMetrics,
  type AdminProductMeta,
} from '../api/adminProductApi'
import { CatalogHeader } from '../components/catalog/CatalogHeader'
import { CatalogMetricCards } from '../components/catalog/CatalogMetricCards'
import { CatalogToolbar } from '../components/catalog/CatalogToolbar'
import { CatalogBulkActions } from '../components/catalog/CatalogBulkActions'
import { CatalogTable } from '../components/catalog/CatalogTable'
import { CatalogEmptyState } from '../components/catalog/CatalogEmptyState'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function ProductsCatalogPage() {
  const navigate = useNavigate()

  // Master product data state (loaded from API)
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [metrics, setMetrics] = useState<CatalogMetrics>({
    totalProducts: 0,
    publishedCount: 0,
    lowStockCount: 0,
    draftCount: 0,
  })
  const [meta, setMeta] = useState<AdminProductMeta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Pagination & Request State
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Faceted Filters
  const [filters, setFilters] = useState<CatalogFilters>({
    searchTerm: '',
    category: 'all',
    status: 'all',
    stock: 'all',
    brand: 'all',
  })

  // Debounced search to prevent excessive API calls while typing
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchTerm)
    }, 350)
    return () => clearTimeout(timer)
  }, [filters.searchTerm])

  // Show temporary feedback toast
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Fetch catalog metrics from API on mount
  useEffect(() => {
    let ignore = false
    getAdminProductMetrics()
      .then((data) => {
        if (!ignore) {
          setMetrics(data)
        }
      })
      .catch((err) => {
        console.warn('Could not load product metrics from API:', err)
      })

    return () => {
      ignore = true
    }
  }, [])

  // Fetch products catalog with query filters & pagination
  const refreshProducts = useCallback(() => {
    setIsLoading(true)
    setError(null)
    getAdminProducts({
      page,
      limit,
      search: debouncedSearch,
      category: filters.category,
      status: filters.status,
      stock: filters.stock,
      brand: filters.brand,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    })
      .then((res) => {
        setProducts(res.products)
        setMeta(res.meta)
        setIsLoading(false)
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load catalog products'
        setError(msg)
        showToast(msg)
        setIsLoading(false)
      })
  }, [page, limit, debouncedSearch, filters.category, filters.status, filters.stock, filters.brand])

  useEffect(() => {
    let ignore = false

    getAdminProducts({
      page,
      limit,
      search: debouncedSearch,
      category: filters.category,
      status: filters.status,
      stock: filters.stock,
      brand: filters.brand,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    })
      .then((res) => {
        if (!ignore) {
          setProducts(res.products)
          setMeta(res.meta)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Failed to load catalog products'
          setError(msg)
          showToast(msg)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [page, limit, debouncedSearch, filters.category, filters.status, filters.stock, filters.brand])

  // Handle filter changes (resets page to 1)
  const handleFilterChange = (key: keyof CatalogFilters, value: string) => {
    setPage(1)
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setPage(1)
    setFilters({
      searchTerm: '',
      category: 'all',
      status: 'all',
      stock: 'all',
      brand: 'all',
    })
  }

  // Extract available categories & brands dynamically from loaded products
  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category && p.category !== 'Uncategorized') set.add(p.category)
    })
    return Array.from(set)
  }, [products])

  const availableBrands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.brand && p.brand !== 'General') set.add(p.brand)
    })
    return Array.from(set)
  }, [products])

  // Effective metrics fallback
  const effectiveMetrics: CatalogMetrics = useMemo(() => {
    if (metrics.totalProducts > 0) return metrics
    return {
      totalProducts: meta.totalItems || products.length,
      publishedCount: products.filter((p) => p.status === 'published').length,
      lowStockCount: products.filter(
        (p) => p.stockState === 'low_stock' || p.stockState === 'critical_low'
      ).length,
      draftCount: products.filter((p) => p.status === 'draft').length,
    }
  }, [metrics, meta.totalItems, products])

  // Selection handlers
  const handleToggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleToggleSelectAll = () => {
    const allIds = products.map((p) => p.id)
    const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])))
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // Bulk Actions
  const handleBulkPublish = () => {
    const count = selectedIds.length
    setConfirmDialog({
      title: 'Publish Selected Products',
      description: `Are you sure you want to publish ${count} selected product(s) to the storefront? They will become immediately visible and available for customer purchases.`,
      confirmText: `Publish ${count} Products`,
      variant: 'primary',
      icon: 'check',
      badgeText: 'Catalog Status Update',
      itemDetails: [
        { label: 'Products Selected', value: `${count} items` },
        { label: 'Target State', value: 'Active / Published' },
        { label: 'Sales Channels', value: 'Online Storefront, POS, Mobile App' },
      ],
      onConfirm: () => {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'published' } : p))
        )
        showToast(`Published ${count} products to storefront.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  const handleBulkUnpublish = () => {
    const count = selectedIds.length
    setConfirmDialog({
      title: 'Unpublish Selected Products',
      description: `Unpublish ${count} product(s) from public storefronts? Customers will no longer be able to discover or buy these items.`,
      confirmText: `Unpublish ${count} Products`,
      variant: 'warning',
      icon: 'pause',
      badgeText: 'Catalog Visibility Change',
      itemDetails: [
        { label: 'Products Selected', value: `${count} items` },
        { label: 'Target State', value: 'Unpublished' },
      ],
      onConfirm: () => {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'unpublished' } : p))
        )
        showToast(`Unpublished ${count} products from storefront.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  const handleBulkArchive = () => {
    const count = selectedIds.length
    setConfirmDialog({
      title: 'Archive Selected Products',
      description: `Move ${count} product(s) to archive? Archived products are delisted from all active sales channels and can be restored at any time.`,
      confirmText: `Archive ${count} Products`,
      variant: 'warning',
      icon: 'archive',
      badgeText: 'Lifecycle Archive',
      itemDetails: [
        { label: 'Products Selected', value: `${count} items` },
        { label: 'Target State', value: 'Archived' },
      ],
      onConfirm: () => {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'archived' } : p))
        )
        showToast(`Archived ${count} products.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  const handleBulkDelete = () => {
    const count = selectedIds.length
    setConfirmDialog({
      title: 'Permanently Delete Products',
      description: `Are you sure you want to permanently delete ${count} selected product(s)? This action cannot be reversed and removes SKU tracking history.`,
      confirmText: `Delete ${count} Products`,
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Irreversible Action',
      itemDetails: [
        { label: 'Products to Delete', value: `${count} items` },
        { label: 'Scope', value: 'Entire Master Catalog' },
      ],
      onConfirm: () => {
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
        showToast(`Deleted ${count} products from catalog.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  const handleBulkUpdatePrice = () => {
    const count = selectedIds.length
    setConfirmDialog({
      title: 'Apply Price Adjustment (+5%)',
      description: `Increase retail prices by +5% on ${count} selected products? Margins and catalog listings will recalculate automatically.`,
      confirmText: 'Apply +5% Increase',
      variant: 'primary',
      icon: 'check',
      badgeText: 'Pricing Margin Change',
      itemDetails: [
        { label: 'Products Affected', value: `${count} items` },
        { label: 'Adjustment Rate', value: '+5.0% on Base MSRP' },
      ],
      onConfirm: () => {
        setProducts((prev) =>
          prev.map((p) => {
            if (!selectedIds.includes(p.id)) return p
            const newPrice = Math.round(p.price * 1.05 * 100) / 100
            const marginPercent = Math.round(((newPrice - p.costPrice) / newPrice) * 100)
            return {
              ...p,
              price: newPrice,
              marginPercent,
              lastUpdatedDate: 'Just now',
            }
          })
        )
        showToast(`Updated retail price (+5%) on ${count} products.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  // Product Row Actions
  const handleEditProduct = (product: CatalogProduct) => {
    navigate(`/admin/products/${product.id}/edit`)
  }

  const handleViewProduct = (product: CatalogProduct) => {
    navigate(`/admin/products/${product.id}`)
  }

  const handleUnarchiveProduct = (product: CatalogProduct) => {
    setConfirmDialog({
      title: 'Restore Product from Archive',
      description: `Restore "${product.name}" back to Draft status so it can be reviewed and published?`,
      confirmText: 'Restore to Draft',
      variant: 'primary',
      icon: 'refresh',
      badgeText: 'Catalog Lifecycle',
      itemDetails: [
        { label: 'Product Name', value: product.name },
        { label: 'SKU Code', value: product.sku },
        { label: 'New State', value: 'Draft' },
      ],
      onConfirm: () => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, status: 'draft', lastUpdatedDate: 'Just now' } : p
          )
        )
        setConfirmDialog(null)
        showToast(`Product "${product.name}" restored to draft status.`)
      },
    })
  }

  // Export Catalog
  const handleExportCatalog = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `nexa-catalog-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Catalog exported successfully.')
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-on-surface text-surface shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-outline-variant/30">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with breadcrumbs & primary CTAs */}
      <CatalogHeader
        onExport={handleExportCatalog}
        onAddProduct={() => navigate('/admin/products/new')}
      />

      {/* 2. KPI Metric Cards */}
      <CatalogMetricCards metrics={effectiveMetrics} />

      {/* 3. Search and Faceted Filtering Toolbar */}
      <CatalogToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        categories={availableCategories}
        brands={availableBrands}
      />

      {/* 4. Bulk Action Floating Bar */}
      <CatalogBulkActions
        selectedCount={selectedIds.length}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkUpdatePrice={handleBulkUpdatePrice}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

      {/* 5. Error State Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refreshProducts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-700 hover:bg-red-100 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 6. Products Table or Zero Results Empty State */}
      {isLoading ? (
        <div className="p-16 rounded-2xl bg-white border border-outline-variant/60 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs font-semibold text-on-surface-variant">Loading catalog products...</p>
        </div>
      ) : products.length > 0 ? (
        <CatalogTable
          products={products}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEditProduct={handleEditProduct}
          onViewProduct={handleViewProduct}
          onUnarchiveProduct={handleUnarchiveProduct}
          page={page}
          limit={limit}
          totalItems={meta.totalItems}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
          isLoading={isLoading}
        />
      ) : (
        <CatalogEmptyState
          onClearFilters={handleResetFilters}
          onBrowseDrafts={() => handleFilterChange('status', 'draft')}
        />
      )}

      {/* 7. Catalog Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}
    </div>
  )
}
