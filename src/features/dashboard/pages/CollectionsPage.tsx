import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type {
  CollectionItem,
  CollectionFilters,
  CollectionFormData,
  CollectionMetrics,
  CollectionProductAction,
} from '../types/collection'
import {
  getAdminCollections,
  getAdminCollectionMetrics,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  bulkUpdateCollectionStatus,
  bulkDeleteCollections,
  updateCollectionProducts,
  type AdminCollectionMeta,
} from '../api/adminCollectionApi'
import { CollectionHeader } from '../components/collections/CollectionHeader'
import { CollectionMetricCards } from '../components/collections/CollectionMetricCards'
import { CollectionToolbar } from '../components/collections/CollectionToolbar'
import { CollectionTable } from '../components/collections/CollectionTable'
import { CollectionFormModal } from '../components/collections/CollectionFormModal'
import { CollectionViewModal } from '../components/collections/CollectionViewModal'
import { CollectionProductsModal } from '../components/collections/CollectionProductsModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

const EMPTY_METRICS: CollectionMetrics = {
  totalCollections: 0,
  activeCollections: 0,
  featuredCount: 0,
  curatedProductsCount: 0,
}

export function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<CollectionMetrics>(EMPTY_METRICS)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [meta, setMeta] = useState<AdminCollectionMeta>({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Filters State
  const [filters, setFilters] = useState<CollectionFilters>({
    searchTerm: '',
    status: 'all',
    location: 'all',
    sortBy: 'title',
  })

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchTerm)
      setPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [filters.searchTerm])

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editCollection, setEditCollection] = useState<CollectionItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewCollection, setViewCollection] = useState<CollectionItem | null>(null)
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false)
  const [productsTargetCollection, setProductsTargetCollection] =
    useState<CollectionItem | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const mapSortParams = useCallback((sortBy: CollectionFilters['sortBy']) => {
    if (sortBy === 'productCount') {
      return { sortBy: 'productCount' as const, sortOrder: 'desc' as const }
    }
    if (sortBy === 'recent') {
      return { sortBy: 'updatedAt' as const, sortOrder: 'desc' as const }
    }
    return { sortBy: 'title' as const, sortOrder: 'asc' as const }
  }, [])

  // Fetch metrics independently from API
  const refreshMetrics = useCallback(async () => {
    setIsMetricsLoading(true)
    try {
      const apiMetrics = await getAdminCollectionMetrics()
      setMetrics(apiMetrics)
    } catch (err) {
      console.warn('Failed to fetch collection metrics:', err)
    } finally {
      setIsMetricsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    getAdminCollectionMetrics()
      .then((apiMetrics) => {
        if (!ignore) {
          setMetrics(apiMetrics)
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch collection metrics:', err)
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

  // Fetch collections from API
  const fetchCollections = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { sortBy, sortOrder } = mapSortParams(filters.sortBy)

    try {
      const result = await getAdminCollections({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        location: filters.location !== 'all' ? filters.location : undefined,
        sortBy,
        sortOrder,
      })
      setCollections(result.collections)
      setMeta(result.meta)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load collections from API'
      setError(msg)
      setCollections([])
    } finally {
      setIsLoading(false)
    }
  }, [
    page,
    limit,
    debouncedSearch,
    filters.status,
    filters.location,
    filters.sortBy,
    mapSortParams,
  ])

  useEffect(() => {
    let ignore = false
    const { sortBy, sortOrder } = mapSortParams(filters.sortBy)

    getAdminCollections({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      location: filters.location !== 'all' ? filters.location : undefined,
      sortBy,
      sortOrder,
    })
      .then((result) => {
        if (!ignore) {
          setCollections(result.collections)
          setMeta(result.meta)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load collections from API'
          setError(msg)
          setCollections([])
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [
    page,
    limit,
    debouncedSearch,
    filters.status,
    filters.location,
    filters.sortBy,
    mapSortParams,
  ])

  const handleFilterChange = (nextFilters: CollectionFilters) => {
    if (
      nextFilters.status !== filters.status ||
      nextFilters.location !== filters.location ||
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
    if (selectedIds.length === collections.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(collections.map((c) => c.id))
    }
  }

  // Create / Edit Save Handler (multipart/form-data)
  const handleSaveCollection = async (
    formData: CollectionFormData,
    imageFile: File | null
  ) => {
    if (formData.id) {
      const updated = await updateAdminCollection(formData.id, formData, imageFile)
      showToast(`Updated collection "${updated.title}".`)
    } else {
      const created = await createAdminCollection(formData, imageFile)
      showToast(`Created collection "${created.title}".`)
    }
    setIsFormModalOpen(false)
    setEditCollection(null)
    await Promise.all([fetchCollections(), refreshMetrics()])
  }

  // Open Manage Products Modal
  const handleOpenManageProducts = (collection: CollectionItem) => {
    setProductsTargetCollection(collection)
    setIsProductsModalOpen(true)
  }

  // Update Collection Products Handler (POST /api/v1/admin/collections/:id/products)
  const handleUpdateCollectionProducts = async (
    collectionId: string,
    action: CollectionProductAction,
    productIds: string[]
  ) => {
    const target = collections.find((c) => c.id === collectionId)
    const response = await updateCollectionProducts(collectionId, { action, productIds })
    const count = response.data?.productCount ?? productIds.length
    showToast(
      `Updated products for "${target?.title || 'collection'}" (${count} items).`
    )
    await Promise.all([fetchCollections(), refreshMetrics()])
  }

  // Single Delete
  const handleDeleteCollection = (collection: CollectionItem) => {
    setConfirmDialog({
      title: `Delete Collection "${collection.title}"?`,
      description: `Are you sure you want to delete "${collection.title}"? This will unassign all products currently associated with this promotional grouping.`,
      confirmText: 'Delete Collection',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Permanent Action',
      onConfirm: async () => {
        try {
          await deleteAdminCollection(collection.id)
          setSelectedIds((prev) => prev.filter((id) => id !== collection.id))
          setConfirmDialog(null)
          showToast(`Deleted collection "${collection.title}".`)
          await Promise.all([fetchCollections(), refreshMetrics()])
        } catch (err) {
          setConfirmDialog(null)
          showToast(err instanceof Error ? err.message : 'Failed to delete collection')
        }
      },
    })
  }

  // Bulk Actions
  const handleBulkActivate = async () => {
    try {
      await bulkUpdateCollectionStatus({
        collectionIds: selectedIds,
        status: 'ACTIVE',
      })
      showToast(`Published ${selectedIds.length} collections live.`)
      setSelectedIds([])
      await Promise.all([fetchCollections(), refreshMetrics()])
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to activate collections')
    }
  }

  const handleBulkArchive = async () => {
    try {
      await bulkUpdateCollectionStatus({
        collectionIds: selectedIds,
        status: 'ARCHIVED',
      })
      showToast(`Archived ${selectedIds.length} collections.`)
      setSelectedIds([])
      await Promise.all([fetchCollections(), refreshMetrics()])
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to archive collections')
    }
  }

  const handleBulkDelete = () => {
    setConfirmDialog({
      title: `Delete ${selectedIds.length} Collections?`,
      description: `This will permanently remove the selected ${selectedIds.length} collections.`,
      confirmText: 'Delete Selected',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Bulk Deletion',
      onConfirm: async () => {
        try {
          await bulkDeleteCollections({ collectionIds: selectedIds })
          showToast(`Deleted ${selectedIds.length} collections.`)
          setSelectedIds([])
          setConfirmDialog(null)
          await Promise.all([fetchCollections(), refreshMetrics()])
        } catch (err) {
          setConfirmDialog(null)
          showToast(
            err instanceof Error ? err.message : 'Failed to delete collections'
          )
        }
      },
    })
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Slug', 'Status', 'Location', 'IsFeatured', 'ProductCount']
    const rows = collections.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.slug,
      c.status,
      `"${c.displayLocation}"`,
      c.isFeatured ? 'Yes' : 'No',
      c.productCount,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `collections-export-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported collections CSV successfully.')
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

      {/* 1. Header */}
      <CollectionHeader
        onAddCollection={() => {
          setEditCollection(null)
          setIsFormModalOpen(true)
        }}
        onExport={handleExportCsv}
        totalCount={meta.totalItems}
      />

      {/* 2. Metric KPI Cards (Directly from API) */}
      <CollectionMetricCards metrics={metrics} isLoading={isMetricsLoading} />

      {/* 3. Filter & Search Toolbar */}
      <CollectionToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedCount={selectedIds.length}
        onBulkActivate={handleBulkActivate}
        onBulkArchive={handleBulkArchive}
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
            onClick={fetchCollections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-100 font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 5. Collections Table */}
      {isLoading ? (
        <div className="p-16 rounded-xl bg-white border border-outline-variant/60 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs font-semibold text-on-surface-variant">
            Loading collections...
          </p>
        </div>
      ) : (
        <CollectionTable
          collections={collections}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
          onView={(col) => {
            setViewCollection(col)
            setIsViewModalOpen(true)
          }}
          onEdit={(col) => {
            setEditCollection(col)
            setIsFormModalOpen(true)
          }}
          onDelete={handleDeleteCollection}
          onAddNew={() => {
            setEditCollection(null)
            setIsFormModalOpen(true)
          }}
          onManageProducts={handleOpenManageProducts}
        />
      )}

      {/* Pagination Bar */}
      {!isLoading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-outline-variant/60 text-xs text-on-surface-variant">
          <span>
            Page <strong className="text-on-surface">{meta.page}</strong> of{' '}
            <strong className="text-on-surface">{meta.totalPages}</strong> (
            {meta.totalItems} collections)
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

      {/* 6. Add / Edit Collection Form Modal */}
      <CollectionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditCollection(null)
        }}
        onSave={handleSaveCollection}
        editItem={editCollection}
      />

      {/* 7. View Detail Modal */}
      <CollectionViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewCollection(null)
        }}
        collection={viewCollection}
        onEdit={(col) => {
          setEditCollection(col)
          setIsFormModalOpen(true)
        }}
        onManageProducts={handleOpenManageProducts}
      />

      {/* 8. Manage Collection Products Modal (API Contract 3.10) */}
      <CollectionProductsModal
        isOpen={isProductsModalOpen}
        onClose={() => {
          setIsProductsModalOpen(false)
          setProductsTargetCollection(null)
        }}
        collection={productsTargetCollection}
        onSave={handleUpdateCollectionProducts}
      />
    </div>
  )
}
