import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CatalogProduct, CatalogFilters } from '../types/catalog'
import { mockCatalogProducts, mockCatalogMetrics } from '../data/mockCatalogData'
import { CatalogHeader } from '../components/catalog/CatalogHeader'
import { CatalogMetricCards } from '../components/catalog/CatalogMetricCards'
import { CatalogToolbar } from '../components/catalog/CatalogToolbar'
import { CatalogBulkActions } from '../components/catalog/CatalogBulkActions'
import { CatalogTable } from '../components/catalog/CatalogTable'
import { CatalogEmptyState } from '../components/catalog/CatalogEmptyState'
import { AddProductModal } from '../components/catalog/AddProductModal'

export function ProductsCatalogPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<CatalogProduct[]>(mockCatalogProducts)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [filters, setFilters] = useState<CatalogFilters>({
    searchTerm: '',
    category: 'all',
    status: 'all',
    stock: 'all',
    brand: 'all',
  })

  // Show temporary feedback toast
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof CatalogFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      status: 'all',
      stock: 'all',
      brand: 'all',
    })
  }

  // Compute filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search keyword
      if (filters.searchTerm.trim()) {
        const query = filters.searchTerm.toLowerCase()
        const matchName = item.name.toLowerCase().includes(query)
        const matchSku = item.sku.toLowerCase().includes(query)
        const matchUpc = item.upc.toLowerCase().includes(query)
        const matchBrand = item.brand.toLowerCase().includes(query)
        const matchCategory = item.category.toLowerCase().includes(query)
        if (!matchName && !matchSku && !matchUpc && !matchBrand && !matchCategory) {
          return false
        }
      }

      // 2. Category
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false
      }

      // 3. Status
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false
      }

      // 4. Stock state
      if (filters.stock !== 'all') {
        if (filters.stock === 'in_stock' && item.stockState !== 'in_stock') return false
        if (filters.stock === 'low_stock' && item.stockState !== 'low_stock' && item.stockState !== 'critical_low') return false
        if (filters.stock === 'out_of_stock' && item.stockState !== 'out_of_stock') return false
      }

      // 5. Brand
      if (filters.brand !== 'all' && item.brand !== filters.brand) {
        return false
      }

      return true
    })
  }, [products, filters])

  // Selection handlers
  const handleToggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleToggleSelectAll = () => {
    const allFilteredIds = filteredProducts.map((p) => p.id)
    const isAllSelected =
      allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id))

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // Bulk Actions
  const handleBulkPublish = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'published' } : p))
    )
    showToast(`Published ${selectedIds.length} products to storefront.`)
    setSelectedIds([])
  }

  const handleBulkUnpublish = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'unpublished' } : p))
    )
    showToast(`Unpublished ${selectedIds.length} products from storefront.`)
    setSelectedIds([])
  }

  const handleBulkArchive = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'archived' } : p))
    )
    showToast(`Archived ${selectedIds.length} products.`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    const count = selectedIds.length
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
    showToast(`Deleted ${count} products from catalog.`)
    setSelectedIds([])
  }

  const handleBulkUpdatePrice = () => {
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
    showToast(`Updated retail price (+5%) on ${selectedIds.length} products.`)
    setSelectedIds([])
  }

  // Product Row Actions
  const handleEditProduct = (product: CatalogProduct) => {
    navigate(`/admin/products/${product.id}/edit`)
  }

  const handleViewProduct = (product: CatalogProduct) => {
    navigate(`/admin/products/${product.id}`)
  }

  const handleUnarchiveProduct = (product: CatalogProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: 'draft', lastUpdatedDate: 'Just now' } : p))
    )
    showToast(`Product "${product.name}" moved to draft status.`)
  }

  // Add Product
  const handleAddProduct = (newProduct: CatalogProduct) => {
    setProducts((prev) => [newProduct, ...prev])
    showToast(`Created new product: ${newProduct.name}`)
  }

  // Export Catalog
  const handleExportCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `nexa-catalog-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Catalog exported successfully.')
  }

  return (
    <div className="space-y-space-lg pb-space-2xl">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-space-md py-space-sm rounded-xl bg-on-surface text-surface shadow-xl flex items-center gap-2 font-body-sm text-body-sm animate-fade-in border border-outline-variant/30">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with breadcrumbs & primary CTAs */}
      <CatalogHeader
        onExport={handleExportCatalog}
        onAddProduct={() => navigate('/admin/products/new')}
      />

      {/* 2. KPI Metric Cards */}
      <CatalogMetricCards metrics={mockCatalogMetrics} />

      {/* 3. Search and Faceted Filtering Toolbar */}
      <CatalogToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Bulk Action Floating Bar (when rows are selected) */}
      <CatalogBulkActions
        selectedCount={selectedIds.length}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkUpdatePrice={handleBulkUpdatePrice}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

      {/* 5. Products Table or Zero Results Empty State */}
      {filteredProducts.length > 0 ? (
        <CatalogTable
          products={filteredProducts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEditProduct={handleEditProduct}
          onViewProduct={handleViewProduct}
          onUnarchiveProduct={handleUnarchiveProduct}
        />
      ) : (
        <CatalogEmptyState
          onClearFilters={handleResetFilters}
          onBrowseDrafts={() => handleFilterChange('status', 'draft')}
        />
      )}

      {/* 6. Add Product Modal Dialog */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  )
}

