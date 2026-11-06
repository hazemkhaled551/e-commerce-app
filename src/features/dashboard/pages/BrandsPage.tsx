import { useState, useMemo, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type { BrandItem, BrandFilters, BrandFormData } from '../types/brand'
import {
  loadBrandsFromStorage,
  saveBrandsToStorage,
  calculateBrandMetrics,
} from '../data/mockBrandData'
import { BrandHeader } from '../components/brands/BrandHeader'
import { BrandMetricCards } from '../components/brands/BrandMetricCards'
import { BrandToolbar } from '../components/brands/BrandToolbar'
import { BrandTable } from '../components/brands/BrandTable'
import { BrandFormModal } from '../components/brands/BrandFormModal'
import { BrandViewModal } from '../components/brands/BrandViewModal'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

export function BrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>(() => loadBrandsFromStorage())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filters State
  const [filters, setFilters] = useState<BrandFilters>({
    searchTerm: '',
    status: 'all',
    type: 'all',
    sortBy: 'name',
  })

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

  // Persist to localStorage whenever brands array changes
  useEffect(() => {
    saveBrandsToStorage(brands)
  }, [brands])

  // Filtered & Sorted Brands
  const filteredBrands = useMemo(() => {
    return brands
      .filter((b) => {
        // Search
        if (filters.searchTerm.trim()) {
          const q = filters.searchTerm.toLowerCase()
          const matchesName = b.name.toLowerCase().includes(q)
          const matchesSlug = b.slug.toLowerCase().includes(q)
          const matchesCountry = b.country?.toLowerCase().includes(q)
          if (!matchesName && !matchesSlug && !matchesCountry) return false
        }
        // Status filter
        if (filters.status !== 'all' && b.status !== filters.status) {
          return false
        }
        // Type filter (internal vs partner)
        if (filters.type === 'internal' && !b.isInternal) return false
        if (filters.type === 'partner' && b.isInternal) return false

        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }
        if (filters.sortBy === 'productCount') {
          return (b.productCount || 0) - (a.productCount || 0)
        }
        if (filters.sortBy === 'recent') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }
        return 0
      })
  }, [brands, filters])

  // Metrics
  const metrics = useMemo(() => calculateBrandMetrics(brands), [brands])

  // Selection handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredBrands.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBrands.map((b) => b.id))
    }
  }

  // Create / Edit Save Handler
  const handleSaveBrand = (formData: BrandFormData) => {
    const now = new Date().toISOString()

    if (formData.id) {
      // Edit existing
      setBrands((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                logoUrl: formData.logoUrl?.trim() || undefined,
                websiteUrl: formData.websiteUrl?.trim() || undefined,
                description: formData.description?.trim() || undefined,
                status: formData.status,
                isInternal: formData.isInternal,
                country: formData.country?.trim() || undefined,
                contactEmail: formData.contactEmail?.trim() || undefined,
                updatedAt: now,
              }
            : item
        )
      )
      showToast(`Updated brand "${formData.name}".`)
    } else {
      // Add new
      const newBrand: BrandItem = {
        id: `brand-${Date.now()}`,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        logoUrl:
          formData.logoUrl?.trim() ||
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&auto=format&fit=crop&q=80',
        websiteUrl: formData.websiteUrl?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        status: formData.status,
        productCount: 0,
        isInternal: formData.isInternal,
        country: formData.country?.trim() || 'United States',
        contactEmail: formData.contactEmail?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      setBrands((prev) => [newBrand, ...prev])
      showToast(`Created brand "${newBrand.name}".`)
    }

    setIsFormModalOpen(false)
    setEditBrand(null)
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
      onConfirm: () => {
        setBrands((prev) => prev.filter((b) => b.id !== brand.id))
        setSelectedIds((prev) => prev.filter((id) => id !== brand.id))
        setConfirmDialog(null)
        showToast(`Deleted brand "${brand.name}".`)
      },
    })
  }

  // Bulk Actions
  const handleBulkActivate = () => {
    setBrands((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, status: 'active' } : b))
    )
    showToast(`Activated ${selectedIds.length} brands.`)
    setSelectedIds([])
  }

  const handleBulkDeactivate = () => {
    setBrands((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, status: 'inactive' } : b))
    )
    showToast(`Set ${selectedIds.length} brands to inactive.`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    setConfirmDialog({
      title: `Delete ${selectedIds.length} Brands?`,
      description: `This will permanently remove the selected ${selectedIds.length} brands from your store registry.`,
      confirmText: 'Delete Selected',
      variant: 'danger',
      icon: 'trash',
      badgeText: 'Bulk Deletion',
      onConfirm: () => {
        setBrands((prev) => prev.filter((b) => !selectedIds.includes(b.id)))
        showToast(`Deleted ${selectedIds.length} brands.`)
        setSelectedIds([])
        setConfirmDialog(null)
      },
    })
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Slug', 'Status', 'IsInternal', 'ProductCount', 'Country', 'Website']
    const rows = filteredBrands.map((b) => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      b.slug,
      b.status,
      b.isInternal ? 'Yes' : 'No',
      b.productCount,
      b.country || '',
      b.websiteUrl || '',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
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

      {/* 1. Page Header */}
      <BrandHeader
        onAddBrand={() => {
          setEditBrand(null)
          setIsFormModalOpen(true)
        }}
        onExport={handleExportCsv}
        totalCount={brands.length}
      />

      {/* 2. Metric KPI Cards */}
      <BrandMetricCards metrics={metrics} />

      {/* 3. Filter & Search Toolbar */}
      <BrandToolbar
        filters={filters}
        onFilterChange={setFilters}
        selectedCount={selectedIds.length}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* 4. Brands Table */}
      <BrandTable
        brands={filteredBrands}
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

      {/* 5. Add / Edit Brand Form Modal */}
      <BrandFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditBrand(null)
        }}
        onSave={handleSaveBrand}
        editItem={editBrand}
      />

      {/* 6. View Brand Detail Modal */}
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
