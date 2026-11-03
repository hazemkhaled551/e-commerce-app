import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type { CatalogProduct, CatalogFilters } from '../types/catalog'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null
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
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
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

  // Bulk Actions with Mandatory Admin Confirmations
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
          prev.map((p) => (p.id === product.id ? { ...p, status: 'draft', lastUpdatedDate: 'Just now' } : p))
        )
        setConfirmDialog(null)
        showToast(`Product "${product.name}" restored to draft status.`)
      },
    })
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
      <CatalogMetricCards metrics={mockCatalogMetrics} />

      {/* 3. Search and Faceted Filtering Toolbar */}
      <CatalogToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
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
