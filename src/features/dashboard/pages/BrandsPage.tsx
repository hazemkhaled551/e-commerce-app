import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import { DEFAULT_DEBOUNCE_MS } from '@/hooks/useDebounce'
import type { BrandItem, BrandFilters, BrandFormData, BrandMetrics } from '../types/brand'
import {
  getAdminBrands,
  getAdminBrandMetrics,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
  bulkUpdateBrandStatus,
  bulkDeleteBrands,
  type AdminBrandMeta,
} from '../api/adminBrandApi'
import { BrandHeader } from '../components/brands/BrandHeader'
import { BrandMetricCards } from '../components/brands/BrandMetricCards'
import { BrandToolbar } from '../components/brands/BrandToolbar'
import { BrandTable } from '../components/brands/BrandTable'
import { BrandFormModal } from '../components/brands/BrandFormModal'
import { BrandViewModal } from '../components/brands/BrandViewModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

const EMPTY_METRICS: BrandMetrics = {
  totalBrands: 0,
  activeBrands: 0,
  internalBrands: 0,
  totalProductsAssigned: 0,
}

export function BrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<BrandMetrics>(EMPTY_METRICS)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [meta, setMeta] = useState<AdminBrandMeta>({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Filters State
  const [filters, setFilters] = useState<BrandFilters>({
    searchTerm: '',
    status: 'all',
    type: 'all',
    sortBy: 'name',
  })

  // Debounced search (500ms)
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchTerm)
      setPage(1)
    }, DEFAULT_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [filters.searchTerm])

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<BrandItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewBrand, setViewBrand] = useState<BrandItem | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const mapSortParams = useCallback((sortBy: BrandFilters['sortBy']) => {
    if (sortBy === 'productCount') {
      return { sortBy: 'productCount' as const, sortOrder: 'desc' as const }
    }
    if (sortBy === 'recent') {
      return { sortBy: 'updatedAt' as const, sortOrder: 'desc' as const }
    }
    return { sortBy: 'name' as const, sortOrder: 'asc' as const }
  }, [])

  // Fetch metrics independently from API
  const refreshMetrics = useCallback(async () => {
    setIsMetricsLoading(true)
    try {
      const apiMetrics = await getAdminBrandMetrics()
      setMetrics(apiMetrics)
    } catch (err) {
      console.warn('Failed to fetch brand metrics:', err)
    } finally {
      setIsMetricsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    getAdminBrandMetrics()
      .then((apiMetrics) => {
        if (!ignore) {
          setMetrics(apiMetrics)
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch brand metrics:', err)
      })
      .finally(() => {
        if (!ignore) {
          setIsMetricsLoading(false)
        }
      })
    return () => {
      ignore = true
    }
  }, [])

  // Fetch brands from API using Swagger-aligned query params
  const fetchBrands = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { sortBy, sortOrder } = mapSortParams(filters.sortBy)

    try {
      const result = await getAdminBrands({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        type: filters.type,
        sortBy,
        sortOrder,
      })
      setBrands(result.brands)
      setMeta(result.meta)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load brands from API'
      setError(msg)
      setBrands([])
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch, filters.status, filters.type, filters.sortBy, mapSortParams])

  useEffect(() => {
    let ignore = false
    const { sortBy, sortOrder } = mapSortParams(filters.sortBy)

    getAdminBrands({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      type: filters.type,
      sortBy,
      sortOrder,
    })
      .then((result) => {
        if (!ignore) {
          setBrands(result.brands)
          setMeta(result.meta)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Failed to load brands from API'
          setError(msg)
          setBrands([])
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [page, limit, debouncedSearch, filters.status, filters.type, filters.sortBy, mapSortParams])

  const handleFilterChange = (nextFilters: BrandFilters) => {
    if (
      nextFilters.status !== filters.status ||
      nextFilters.type !== filters.type ||
      nextFilters.sortBy !== filters.sortBy
    ) {
      setPage(1)
    }
    setFilters(nextFilters)
  }

  // Selection handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === brands.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(brands.map((b) => b.id))
    }
  }

  // Create / Edit Save Handler
  const handleSaveBrand = async (formData: BrandFormData, logoFile: File | null) => {
    if (formData.id) {
      const updated = await updateAdminBrand(formData.id, formData, logoFile)
      showToast(`Updated brand "${updated.name}".`)
    } else {
      const created = await createAdminBrand(formData, logoFile)
      showToast(`Created brand "${created.name}".`)
    }
    setIsFormModalOpen(false)
    setEditBrand(null)
    await Promise.all([fetchBrands(), refreshMetrics()])
  }

  // Single Delete
  const handleDeleteBrand = (brand: BrandItem) => {
    setConfirmDialog({
      title: `Delete Brand "${brand.name}"?`,
      description: `Are you sure you want to delete "${brand.name}"? Products currently assigned to this brand will need to be reassigned.`,
      confirmText: 'Delete Brand',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Permanent Action',
      onConfirm: async () => {
        try {
          await deleteAdminBrand(brand.id)
          setSelectedIds((prev) => prev.filter((id) => id !== brand.id))
          setConfirmDialog(null)
          showToast(`Deleted brand "${brand.name}".`)
          await Promise.all([fetchBrands(), refreshMetrics()])
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to delete brand'
          setConfirmDialog(null)
          showToast(msg)
        }
      },
    })
  }

  // Bulk Actions
  const handleBulkActivate = async () => {
    try {
      await bulkUpdateBrandStatus({ brandIds: selectedIds, status: 'ACTIVE' })
      showToast(`Activated ${selectedIds.length} brands.`)
      setSelectedIds([])
      await Promise.all([fetchBrands(), refreshMetrics()])
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to activate brands')
    }
  }

  const handleBulkDeactivate = async () => {
    try {
      await bulkUpdateBrandStatus({ brandIds: selectedIds, status: 'INACTIVE' })
      showToast(`Set ${selectedIds.length} brands to inactive.`)
      setSelectedIds([])
      await Promise.all([fetchBrands(), refreshMetrics()])
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to deactivate brands')
    }
  }

  const handleBulkDelete = () => {
    setConfirmDialog({
      title: `Delete ${selectedIds.length} Brands?`,
      description: `This will permanently remove the selected ${selectedIds.length} brands from your store registry.`,
      confirmText: 'Delete Selected',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Bulk Deletion',
      onConfirm: async () => {
        try {
          await bulkDeleteBrands({ brandIds: selectedIds })
          showToast(`Deleted ${selectedIds.length} brands.`)
          setSelectedIds([])
          setConfirmDialog(null)
          await Promise.all([fetchBrands(), refreshMetrics()])
        } catch (err) {
          setConfirmDialog(null)
          showToast(err instanceof Error ? err.message : 'Failed to delete brands')
        }
      },
    })
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Slug', 'Status', 'IsInternal', 'ProductCount', 'Country', 'Website']
    const rows = brands.map((b) => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      b.slug,
      b.status,
      b.isInternal ? 'Yes' : 'No',
      b.productCount,
      b.country || '',
      b.websiteUrl || '',
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `brands-export-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported brands CSV successfully.')
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-2xl flex items-center gap-2 text-xs md:text-sm animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}

      {/* 1. Page Header */}
      <BrandHeader
        onAddBrand={() => {
          setEditBrand(null)
          setIsFormModalOpen(true)
        }}
        onExport={handleExportCsv}
        totalCount={meta.totalItems}
      />

      {/* 2. Metric KPI Cards (Directly from API) */}
      <BrandMetricCards metrics={metrics} isLoading={isMetricsLoading} />

      {/* 3. Filter & Search Toolbar */}
      <BrandToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedCount={selectedIds.length}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* 4. Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchBrands}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-100 font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 5. Brands Table */}
      {isLoading ? (
        <div className="p-16 rounded-xl bg-white border border-outline-variant/60 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs font-semibold text-on-surface-variant">Loading brands...</p>
        </div>
      ) : (
        <BrandTable
          brands={brands}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
          onView={(b) => {
            setViewBrand(b)
            setIsViewModalOpen(true)
          }}
          onEdit={(b) => {
            setEditBrand(b)
            setIsFormModalOpen(true)
          }}
          onDelete={handleDeleteBrand}
          onAddNew={() => {
            setEditBrand(null)
            setIsFormModalOpen(true)
          }}
        />
      )}

      {/* Pagination Bar */}
      {!isLoading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-outline-variant/60 text-xs text-on-surface-variant">
          <span>
            Page <strong className="text-on-surface">{meta.page}</strong> of{' '}
            <strong className="text-on-surface">{meta.totalPages}</strong> ({meta.totalItems} brands)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              disabled={!meta.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Brand Form Modal */}
      <BrandFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditBrand(null)
        }}
        onSave={handleSaveBrand}
        editItem={editBrand}
      />

      {/* 7. View Brand Detail Modal */}
      <BrandViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewBrand(null)
        }}
        brand={viewBrand}
        onEdit={(b) => {
          setEditBrand(b)
          setIsFormModalOpen(true)
        }}
      />
    </div>
  )
}
