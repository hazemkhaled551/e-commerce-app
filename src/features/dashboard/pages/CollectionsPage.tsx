import { useState, useMemo, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type {
  CollectionItem,
  CollectionFilters,
  CollectionFormData,
  CollectionProductAction,
} from '../types/collection'
import {
  loadCollectionsFromStorage,
  saveCollectionsToStorage,
  calculateCollectionMetrics,
} from '../data/mockCollectionData'
import { updateCollectionProducts } from '../api/adminCollectionApi'
import { CollectionHeader } from '../components/collections/CollectionHeader'
import { CollectionMetricCards } from '../components/collections/CollectionMetricCards'
import { CollectionToolbar } from '../components/collections/CollectionToolbar'
import { CollectionTable } from '../components/collections/CollectionTable'
import { CollectionFormModal } from '../components/collections/CollectionFormModal'
import { CollectionViewModal } from '../components/collections/CollectionViewModal'
import { CollectionProductsModal } from '../components/collections/CollectionProductsModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(() =>
    loadCollectionsFromStorage()
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filters State
  const [filters, setFilters] = useState<CollectionFilters>({
    searchTerm: '',
    status: 'all',
    location: 'all',
    sortBy: 'title',
  })

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editCollection, setEditCollection] = useState<CollectionItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewCollection, setViewCollection] = useState<CollectionItem | null>(null)
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false)
  const [productsTargetCollection, setProductsTargetCollection] = useState<CollectionItem | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Persist to localStorage whenever collections array changes
  useEffect(() => {
    saveCollectionsToStorage(collections)
  }, [collections])

  // Filtered & Sorted Collections
  const filteredCollections = useMemo(() => {
    return collections
      .filter((c) => {
        // Search
        if (filters.searchTerm.trim()) {
          const q = filters.searchTerm.toLowerCase()
          const matchesTitle = c.title.toLowerCase().includes(q)
          const matchesSlug = c.slug.toLowerCase().includes(q)
          const matchesBadge = c.badgeText?.toLowerCase().includes(q)
          if (!matchesTitle && !matchesSlug && !matchesBadge) return false
        }
        // Status filter
        if (filters.status !== 'all' && c.status !== filters.status) {
          return false
        }
        // Location filter
        if (filters.location !== 'all' && c.displayLocation !== filters.location) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        if (filters.sortBy === 'productCount') {
          return (b.productCount || 0) - (a.productCount || 0)
        }
        if (filters.sortBy === 'recent') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }
        return 0
      })
  }, [collections, filters])

  // Metrics
  const metrics = useMemo(
    () => calculateCollectionMetrics(collections),
    [collections]
  )

  // Selection handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCollections.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCollections.map((c) => c.id))
    }
  }

  // Create / Edit Save Handler
  const handleSaveCollection = (formData: CollectionFormData) => {
    const now = new Date().toISOString()

    if (formData.id) {
      // Edit existing
      setCollections((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                description: formData.description?.trim() || undefined,
                imageUrl: formData.imageUrl?.trim() || undefined,
                status: formData.status,
                displayLocation: formData.displayLocation,
                isFeatured: formData.isFeatured,
                rulesType: formData.rulesType,
                badgeText: formData.badgeText?.trim() || undefined,
                updatedAt: now,
              }
            : item
        )
      )
      showToast(`Updated collection "${formData.title}".`)
    } else {
      // Add new
      const newCol: CollectionItem = {
        id: `col-${Date.now()}`,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || undefined,
        imageUrl:
          formData.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        status: formData.status,
        productCount: 0,
        displayLocation: formData.displayLocation,
        isFeatured: formData.isFeatured,
        rulesType: formData.rulesType,
        badgeText: formData.badgeText?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      setCollections((prev) => [newCol, ...prev])
      showToast(`Created collection "${newCol.title}".`)
    }

    setIsFormModalOpen(false)
    setEditCollection(null)
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
    if (!target) return

    let nextProductIds: string[] = []
    if (action === 'set') {
      nextProductIds = productIds
    } else if (action === 'add') {
      nextProductIds = Array.from(
        new Set([...(target.productIds || []), ...productIds])
      )
    } else if (action === 'remove') {
      nextProductIds = (target.productIds || []).filter(
        (id) => !productIds.includes(id)
      )
    }

    const now = new Date().toISOString()
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              productIds: nextProductIds,
              productCount: nextProductIds.length,
              updatedAt: now,
            }
          : c
      )
    )

    // Call API Contract 3.10 POST /api/v1/admin/collections/:id/products
    await updateCollectionProducts(collectionId, { action, productIds })

    showToast(
      `Updated products for "${target.title}" (${nextProductIds.length} items).`
    )
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
      onConfirm: () => {
        setCollections((prev) => prev.filter((c) => c.id !== collection.id))
        setSelectedIds((prev) => prev.filter((id) => id !== collection.id))
        setConfirmDialog(null)
        showToast(`Deleted collection "${collection.title}".`)
      },
    })
  }

  // Bulk Actions
  const handleBulkActivate = () => {
    setCollections((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: 'active' } : c))
    )
    showToast(`Published ${selectedIds.length} collections live.`)
    setSelectedIds([])
  }

  const handleBulkArchive = () => {
    setCollections((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: 'archived' } : c
      )
    )
    showToast(`Archived ${selectedIds.length} collections.`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    setConfirmDialog({
      title: `Delete ${selectedIds.length} Collections?`,
      description: `This will permanently remove the selected ${selectedIds.length} collections.`,
      confirmText: 'Delete Selected',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Bulk Deletion',
      onConfirm: () => {
        setCollections((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
        showToast(`Deleted ${selectedIds.length} collections.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Title',
      'Slug',
      'Status',
      'Location',
      'IsFeatured',
      'RuleType',
      'ProductCount',
    ]
    const rows = filteredCollections.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.slug,
      c.status,
      `"${c.displayLocation}"`,
      c.isFeatured ? 'Yes' : 'No',
      c.rulesType,
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-16">
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
        totalCount={collections.length}
      />

      {/* 2. Metric KPI Cards */}
      <CollectionMetricCards metrics={metrics} />

      {/* 3. Filter & Search Toolbar */}
      <CollectionToolbar
        filters={filters}
        onFilterChange={setFilters}
        selectedCount={selectedIds.length}
        onBulkActivate={handleBulkActivate}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* 4. Collections Table */}
      <CollectionTable
        collections={filteredCollections}
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

      {/* 5. Add / Edit Collection Form Modal */}
      <CollectionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditCollection(null)
        }}
        onSave={handleSaveCollection}
        editItem={editCollection}
      />

      {/* 6. View Detail Modal */}
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

      {/* 7. Manage Collection Products Modal (API Contract 3.10) */}
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
