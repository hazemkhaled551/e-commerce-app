import { useState, useMemo } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { CategoryItem, CategoryFilters, CategoryFormData } from '../types/category'
import { mockCategories, mockCategoryKpis } from '../data/mockCategoryData'
import { CategoryTopBanner } from '../components/categories/CategoryTopBanner'
import { CategoryHeader } from '../components/categories/CategoryHeader'
import { CategoryMetricCards } from '../components/categories/CategoryMetricCards'
import { CategoryToolbar } from '../components/categories/CategoryToolbar'
import { CategoryTable } from '../components/categories/CategoryTable'
import { CategoryTreeVisual } from '../components/categories/CategoryTreeVisual'
import { CategoryFormModal } from '../components/categories/CategoryFormModal'

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<CategoryItem | null>(null)
  const [parentItem, setParentItem] = useState<CategoryItem | null>(null)

  // Filters State
  const [filters, setFilters] = useState<CategoryFilters>({
    searchTerm: '',
    status: 'all',
    level: 'all',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleFilterChange = (key: keyof CategoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // 1. Search keyword
      if (filters.searchTerm.trim()) {
        const q = filters.searchTerm.toLowerCase()
        const matchName = cat.name.toLowerCase().includes(q)
        const matchSlug = cat.slug.toLowerCase().includes(q)
        const matchDesc = cat.description.toLowerCase().includes(q)
        if (!matchName && !matchSlug && !matchDesc) return false
      }

      // 2. Status
      if (filters.status !== 'all' && cat.status !== filters.status) {
        return false
      }

      // 3. Level
      if (filters.level !== 'all' && cat.level !== filters.level) {
        return false
      }

      return true
    })
  }, [categories, filters])

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    const allFilteredIds = filteredCategories.map((c) => c.id)
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

  // Save Category Form (create or edit)
  const handleSaveCategory = (formData: CategoryFormData) => {
    if (formData.id) {
      // Edit
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== formData.id) return c
          const parent = categories.find((item) => item.id === formData.parentId)
          const level = formData.parentId ? 'subcategory' : 'root'
          const fullPath = parent ? `${parent.fullPath}/${formData.slug}` : `/${formData.slug}`

          return {
            ...c,
            name: formData.name,
            slug: formData.slug,
            fullPath,
            description: formData.description,
            level,
            parentId: formData.parentId || undefined,
            parentName: parent?.name,
            imageUrl: formData.imageUrl,
            imageFileName: formData.imageFileName,
            imageSizeText: formData.imageSizeText,
            showInNav: formData.showInNav,
            featureOnHome: formData.featureOnHome,
            displayOrder: `#${formData.displayOrder}`,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            status: formData.status,
          }
        })
      )
      showToast(`Category "${formData.name}" updated successfully.`)
    } else {
      // Create new
      const parent = categories.find((item) => item.id === formData.parentId)
      const level = formData.parentId ? 'subcategory' : 'root'
      const fullPath = parent ? `${parent.fullPath}/${formData.slug}` : `/${formData.slug}`

      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug,
        fullPath,
        description: formData.description,
        level,
        parentId: formData.parentId || undefined,
        parentName: parent?.name,
        imageUrl:
          formData.imageUrl ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        imageFileName: formData.imageFileName,
        imageSizeText: formData.imageSizeText,
        totalProductsCount: 0,
        subcategoriesCount: 0,
        status: formData.status,
        isFeatured: formData.featureOnHome,
        displayOrder: `#${formData.displayOrder}`,
        showInNav: formData.showInNav,
        featureOnHome: formData.featureOnHome,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      }

      setCategories((prev) => [newCategory, ...prev])
      showToast(`Category "${formData.name}" created successfully.`)
    }
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

      {/* 1. Dynamic Notification / CDN Status Banner */}
      <CategoryTopBanner />

      {/* 2. Page Header & Actions */}
      <CategoryHeader onAddCategory={handleOpenAddModal} />

      {/* 3. KPI Metric Cards */}
      <CategoryMetricCards kpis={mockCategoryKpis} />

      {/* 4. Search, Filter & View Controls */}
      <CategoryToolbar
        filters={filters}
        viewMode={viewMode}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
      />

      {/* 5. View Mode: Table View vs Tree Visual */}
      {viewMode === 'table' ? (
        <CategoryTable
          categories={filteredCategories}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEditCategory={handleOpenEditModal}
          onAddSubcategory={handleOpenAddSubcategoryModal}
          onPreviewCategory={handlePreviewCategory}
          onCopySlug={handleCopySlug}
        />
      ) : (
        <CategoryTreeVisual
          categories={filteredCategories}
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
    </div>
  )
}

