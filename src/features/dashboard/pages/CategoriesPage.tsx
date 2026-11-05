import { useState, useMemo, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, RefreshCw, FolderPlus } from 'lucide-react'
import type { CategoryItem, CategoryFilters, CategoryFormData, CategoryKpis } from '../types/category'
import {
  getAdminCategories,
  getAdminCategoryKpis,
  createAdminCategory,
  updateAdminCategory,
  type AdminCategoryMeta,
} from '../api/adminCategoryApi'
import { CategoryHeader } from '../components/categories/CategoryHeader'
import { CategoryMetricCards } from '../components/categories/CategoryMetricCards'
import { CategoryToolbar } from '../components/categories/CategoryToolbar'
import { CategoryTable } from '../components/categories/CategoryTable'
import { CategoryTreeVisual } from '../components/categories/CategoryTreeVisual'
import { CategoryFormModal } from '../components/categories/CategoryFormModal'
import { CategoryViewModal } from '../components/categories/CategoryViewModal'

export function CategoriesPage() {
  // Live category data from API
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [kpis, setKpis] = useState<CategoryKpis>({
    totalCategories: 0,
    newThisQuarter: 0,
    activeDisplay: 0,
    activePercentText: '0% Live',
    avgProductsPerCategory: 0,
    featuredCollectionsCount: 0,
  })
  const [meta, setMeta] = useState<AdminCategoryMeta>({
    page: 1,
    limit: 50,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<CategoryItem | null>(null)
  const [parentItem, setParentItem] = useState<CategoryItem | null>(null)

  // View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewItem, setViewItem] = useState<CategoryItem | null>(null)

  // Filters State
  const [filters, setFilters] = useState<CategoryFilters>({
    searchTerm: '',
    status: 'all',
    level: 'all',
  })

  // Debounced search to prevent excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchTerm)
    }, 350)
    return () => clearTimeout(timer)
  }, [filters.searchTerm])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Load KPI metrics from API on mount
  useEffect(() => {
    let ignore = false
    getAdminCategoryKpis()
      .then((data) => {
        if (!ignore) {
          setKpis(data)
        }
      })
      .catch((err) => {
        console.warn('Could not load category KPIs from API:', err)
      })

    return () => {
      ignore = true
    }
  }, [])

  // Fetch categories with query filters
  const refreshCategories = useCallback(() => {
    setIsLoading(true)
    setError(null)
    const apiViewMode = viewMode === 'table' ? 'flat' : 'tree'
    getAdminCategories({
      view: apiViewMode,
      status: filters.status,
      level: filters.level,
      search: debouncedSearch,
      page: 1,
      limit: 50,
    })
      .then((res) => {
        setCategories(res.categories)
        setMeta(res.meta)
        setIsLoading(false)
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load categories'
        setError(msg)
        showToast(msg)
        setIsLoading(false)
      })
  }, [viewMode, filters.status, filters.level, debouncedSearch])

  useEffect(() => {
    let ignore = false
    const apiViewMode = viewMode === 'table' ? 'flat' : 'tree'
    getAdminCategories({
      view: apiViewMode,
      status: filters.status,
      level: filters.level,
      search: debouncedSearch,
      page: 1,
      limit: 50,
    })
      .then((res) => {
        if (!ignore) {
          setCategories(res.categories)
          setMeta(res.meta)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Failed to load categories'
          setError(msg)
          showToast(msg)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [viewMode, filters.status, filters.level, debouncedSearch])

  const handleFilterChange = (key: keyof CategoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Calculate effective KPIs fallback
  const effectiveKpis: CategoryKpis = useMemo(() => {
    if (kpis.totalCategories > 0) return kpis
    const activeCount = categories.filter((c) => c.status === 'active').length
    return {
      totalCategories: meta.totalItems || categories.length,
      newThisQuarter: meta.totalItems || categories.length,
      activeDisplay: activeCount,
      activePercentText:
        categories.length > 0
          ? `${Math.round((activeCount / categories.length) * 100)}% Live`
          : '0% Live',
      avgProductsPerCategory: 0,
      featuredCollectionsCount: categories.filter((c) => c.isFeatured).length,
    }
  }, [kpis, meta.totalItems, categories])

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    const allFilteredIds = categories.map((c) => c.id)
    const isAll =
      allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id))

    if (isAll) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  // Copy Slug
  const handleCopySlug = (path: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(path)
    }
    showToast(`Copied slug path: ${path}`)
  }

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditItem(null)
    setParentItem(null)
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditItem(cat)
    setParentItem(null)
    setIsModalOpen(true)
  }

  // Open View Modal
  const handleViewCategory = (cat: CategoryItem) => {
    setViewItem(cat)
    setIsViewModalOpen(true)
  }

  // Open Add Subcategory Modal
  const handleOpenAddSubcategoryModal = (parent: CategoryItem) => {
    setEditItem(null)
    setParentItem(parent)
    setIsModalOpen(true)
  }

  // Preview Category on storefront
  const handlePreviewCategory = (cat: CategoryItem) => {
    showToast(`Opening storefront category view: ${cat.fullPath}`)
  }

  // Save Category Form (create or edit) connected to backend API
  const handleSaveCategory = async (formData: CategoryFormData) => {
    if (formData.id) {
      await updateAdminCategory(formData.id, {
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId || null,
        description: formData.description,
        status: formData.status,
      })
      showToast(`Category "${formData.name}" updated successfully.`)
    } else {
      await createAdminCategory({
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId || null,
        description: formData.description,
        status: formData.status,
      })
      showToast(`Category "${formData.name}" created successfully.`)
    }

    refreshCategories()
    getAdminCategoryKpis()
      .then((data) => setKpis(data))
      .catch(() => {})
  }

  const existingRootCategories = categories.filter((c) => c.level === 'root')

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-2xl flex items-center gap-2 text-sm animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header & Actions */}
      <CategoryHeader onAddCategory={handleOpenAddModal} />

      {/* 2. KPI Metric Cards */}
      <CategoryMetricCards kpis={effectiveKpis} />

      {/* 3. Search, Filter & View Controls */}
      <CategoryToolbar
        filters={filters}
        viewMode={viewMode}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
      />

      {/* 4. Error State Banner */}
      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refreshCategories}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-700 hover:bg-red-100 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 5. View Mode: Table View vs Tree Visual vs Empty State */}
      {isLoading ? (
        <div className="p-16 rounded-2xl bg-white border border-outline-variant/60 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs font-semibold text-on-surface-variant">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-outline-variant/60 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <FolderPlus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-on-surface">No Categories Found</h3>
          <p className="text-xs text-on-surface-variant max-w-md">
            There are currently no categories matching your filter criteria, or the store taxonomy is empty.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
          >
            Create First Category
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <CategoryTable
          categories={categories}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewCategory={handleViewCategory}
          onEditCategory={handleOpenEditModal}
          onAddSubcategory={handleOpenAddSubcategoryModal}
          onPreviewCategory={handlePreviewCategory}
          onCopySlug={handleCopySlug}
        />
      ) : (
        <CategoryTreeVisual
          categories={categories}
          onViewCategory={handleViewCategory}
          onEditCategory={handleOpenEditModal}
          onAddSubcategory={handleOpenAddSubcategoryModal}
        />
      )}

      {/* 6. Add/Edit Category Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editItem={editItem}
        parentItem={parentItem}
        existingRootCategories={existingRootCategories}
      />

      {/* 7. View Category Details Modal */}
      <CategoryViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        category={viewItem}
        onEdit={(cat) => {
          setIsViewModalOpen(false)
          handleOpenEditModal(cat)
        }}
      />
    </div>
  )
}
