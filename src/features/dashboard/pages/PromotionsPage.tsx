import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import { DEFAULT_DEBOUNCE_MS } from '@/hooks/useDebounce'
import type {
  PromotionItem,
  PromotionFilters,
  PromotionFormData,
  PromotionMetrics,
  PromotionStatus,
} from '../types/promotion'
import {
  getAdminPromotions,
  getAdminPromotionMetrics,
  createAdminPromotion,
  updateAdminPromotion,
  deleteAdminPromotion,
  bulkUpdatePromotionStatus,
  bulkDeletePromotions,
  type AdminPromotionMeta,
} from '../api/adminPromotionApi'
import { PromotionHeader } from '../components/promotions/PromotionHeader'
import { PromotionMetricCards } from '../components/promotions/PromotionMetricCards'
import { PromotionToolbar } from '../components/promotions/PromotionToolbar'
import { PromotionTable } from '../components/promotions/PromotionTable'
import { PromotionFormModal } from '../components/promotions/PromotionFormModal'
import { PromotionViewModal } from '../components/promotions/PromotionViewModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

const EMPTY_METRICS: PromotionMetrics = {
  totalPromotions: 0,
  activePromotions: 0,
  totalRedemptions: 0,
  totalDiscountGiven: 0,
  expiringSoonCount: 0,
}

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<PromotionMetrics>(EMPTY_METRICS)

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [meta, setMeta] = useState<AdminPromotionMeta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Filters State
  const [filters, setFilters] = useState<PromotionFilters>({
    searchTerm: '',
    status: 'all',
    discountType: 'all',
    sortBy: 'code',
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

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editPromotion, setEditPromotion] = useState<PromotionItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewPromotion, setViewPromotion] = useState<PromotionItem | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Fetch metrics for event handlers
  const refreshMetrics = useCallback(async () => {
    setIsMetricsLoading(true)
    try {
      const apiMetrics = await getAdminPromotionMetrics()
      setMetrics(apiMetrics)
    } catch (err) {
      console.error('Failed to load metrics:', err)
    } finally {
      setIsMetricsLoading(false)
    }
  }, [])

  // Fetch promotions list for event handlers
  const refreshPromotions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAdminPromotions({
        page,
        limit,
        search: debouncedSearch,
        status: filters.status,
        discountType: filters.discountType,
        sortBy: filters.sortBy,
      })

      setPromotions(result.promotions)
      setMeta(result.meta)
    } catch (err) {
      console.error('Failed to fetch promotions:', err)
      setError('Unable to load promotions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch, filters.status, filters.discountType, filters.sortBy])

  // Initial and param change data synchronization
  useEffect(() => {
    let ignore = false

    getAdminPromotionMetrics()
      .then((m) => {
        if (!ignore) {
          setMetrics(m)
          setIsMetricsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err)
        if (!ignore) setIsMetricsLoading(false)
      })

    getAdminPromotions({
      page,
      limit,
      search: debouncedSearch,
      status: filters.status,
      discountType: filters.discountType,
      sortBy: filters.sortBy,
    })
      .then((result) => {
        if (!ignore) {
          setPromotions(result.promotions)
          setMeta(result.meta)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch promotions:', err)
        if (!ignore) {
          setError('Unable to load promotions. Please try again.')
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [page, limit, debouncedSearch, filters.status, filters.discountType, filters.sortBy])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(promotions.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // Create / Edit Save
  const handleSavePromotion = async (formData: PromotionFormData) => {
    if (editPromotion) {
      await updateAdminPromotion(editPromotion.id, formData)
      showToast(`Promotion "${formData.code}" updated successfully`)
    } else {
      await createAdminPromotion(formData)
      showToast(`Promotion "${formData.code}" created successfully`)
    }
    await refreshPromotions()
    await refreshMetrics()
  }

  // Toggle single status
  const handleToggleStatus = async (promo: PromotionItem) => {
    const nextStatus: PromotionStatus = promo.status === 'active' ? 'disabled' : 'active'
    try {
      await updateAdminPromotion(promo.id, { status: nextStatus })
      showToast(`Promotion ${promo.code} set to ${nextStatus}`)
      await refreshPromotions()
      await refreshMetrics()
    } catch {
      showToast('Failed to update promotion status')
    }
  }

  // Single Delete
  const handleDeletePromotion = (promo: PromotionItem) => {
    setConfirmDialog({
      title: 'Delete Promotion',
      description: `Are you sure you want to permanently delete coupon "${promo.code}"? Customers will no longer be able to use it at checkout.`,
      confirmText: 'Delete Campaign',
      variant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        try {
          await deleteAdminPromotion(promo.id)
          setSelectedIds((prev) => prev.filter((id) => id !== promo.id))
          showToast(`Promotion "${promo.code}" deleted`)
          await refreshPromotions()
          await refreshMetrics()
        } catch {
          showToast('Failed to delete promotion')
        } finally {
          setConfirmDialog(null)
        }
      },
    })
  }

  // Bulk Activate
  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) return
    try {
      await bulkUpdatePromotionStatus({
        promotionIds: selectedIds,
        status: 'active',
      })
      showToast(`Activated ${selectedIds.length} promotions`)
      setSelectedIds([])
      await refreshPromotions()
      await refreshMetrics()
    } catch {
      showToast('Bulk update failed')
    }
  }

  // Bulk Deactivate
  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return
    try {
      await bulkUpdatePromotionStatus({
        promotionIds: selectedIds,
        status: 'disabled',
      })
      showToast(`Disabled ${selectedIds.length} promotions`)
      setSelectedIds([])
      await refreshPromotions()
      await refreshMetrics()
    } catch {
      showToast('Bulk update failed')
    }
  }

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setConfirmDialog({
      title: 'Delete Selected Promotions',
      description: `Are you sure you want to permanently delete ${selectedIds.length} selected promotion campaigns? This action cannot be reversed.`,
      confirmText: `Delete (${selectedIds.length})`,
      variant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        try {
          await bulkDeletePromotions({ promotionIds: selectedIds })
          showToast(`Deleted ${selectedIds.length} promotions`)
          setSelectedIds([])
          await refreshPromotions()
          await refreshMetrics()
        } catch {
          showToast('Failed to delete selected promotions')
        } finally {
          setConfirmDialog(null)
        }
      },
    })
  }

  // Export CSV
  const handleExportCSV = () => {
    if (promotions.length === 0) {
      showToast('No promotions to export')
      return
    }

    const headers = [
      'ID',
      'Code',
      'Title',
      'Type',
      'Value',
      'Min Order',
      'Usage Count',
      'Usage Limit',
      'Status',
      'Start Date',
      'End Date',
    ]

    const rows = promotions.map((p) => [
      `"${p.id}"`,
      `"${p.code}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.discountType}"`,
      p.discountValue,
      p.minOrderValue ?? '',
      p.usageCount,
      p.usageLimit ?? 'Unlimited',
      `"${p.status}"`,
      `"${p.startDate}"`,
      `"${p.endDate ?? 'None'}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `promotions_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Promotions exported to CSV')
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-xl text-xs font-semibold animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmDialog(null)}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          icon={confirmDialog.icon}
          onConfirm={confirmDialog.onConfirm}
        />
      )}

      {/* 1. Header */}
      <PromotionHeader
        totalCount={meta.totalItems}
        onAddPromotion={() => {
          setEditPromotion(null)
          setIsFormModalOpen(true)
        }}
        onExport={handleExportCSV}
      />

      {/* 2. KPI Metrics Cards */}
      <PromotionMetricCards metrics={metrics} isLoading={isMetricsLoading} />

      {/* 3. Filter Toolbar & Floating Bulk Bar */}
      <PromotionToolbar
        filters={filters}
        onFilterChange={(newFilters) => {
          if (
            newFilters.status !== filters.status ||
            newFilters.discountType !== filters.discountType ||
            newFilters.sortBy !== filters.sortBy
          ) {
            setPage(1)
          }
          setFilters(newFilters)
        }}
        selectedCount={selectedIds.length}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* 4. Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refreshPromotions}
            className="inline-flex items-center gap-1 font-semibold hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 5. Promotions Table */}
      <PromotionTable
        promotions={promotions}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onView={(promo) => {
          setViewPromotion(promo)
          setIsViewModalOpen(true)
        }}
        onEdit={(promo) => {
          setEditPromotion(promo)
          setIsFormModalOpen(true)
        }}
        onDelete={handleDeletePromotion}
        onToggleStatus={handleToggleStatus}
        onAddNew={() => {
          setEditPromotion(null)
          setIsFormModalOpen(true)
        }}
        isLoading={isLoading}
      />

      {/* 6. Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs text-on-surface-variant">
          <div>
            Showing <span className="font-semibold text-on-surface">{promotions.length}</span> of{' '}
            <span className="font-semibold text-on-surface">{meta.totalItems}</span> campaigns
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta.hasPrevPage || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-white hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none text-on-surface font-medium shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-medium">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              type="button"
              disabled={!meta.hasNextPage || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-white hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none text-on-surface font-medium shadow-2xs transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      <PromotionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePromotion}
        editItem={editPromotion}
      />

      {/* View Detail Modal */}
      <PromotionViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        promotion={viewPromotion}
        onEdit={(promo) => {
          setEditPromotion(promo)
          setIsFormModalOpen(true)
        }}
      />
    </div>
  )
}
