import { useState, useEffect } from 'react'
import {
  FolderTree,
  X,
  Copy,
  Check,
  Edit2,
  Calendar,
  Layers,
  Package,
  Loader2,
  AlertCircle,
  Folder,
} from 'lucide-react'
import type { CategoryItem } from '../../types/category'
import { getAdminCategoryById } from '../../api/adminCategoryApi'

interface CategoryViewModalProps {
  isOpen: boolean
  onClose: () => void
  category: CategoryItem | null
  onEdit: (category: CategoryItem) => void
}

export function CategoryViewModal({
  isOpen,
  onClose,
  category,
  onEdit,
}: CategoryViewModalProps) {
  const [copied, setCopied] = useState(false)
  const [fetchedCategory, setFetchedCategory] = useState<CategoryItem | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const activeCategoryId = isOpen ? category?.id : undefined

  useEffect(() => {
    if (!activeCategoryId) return

    let ignore = false
    getAdminCategoryById(activeCategoryId)
      .then((fresh) => {
        if (!ignore) {
          setFetchedCategory(fresh)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('Could not fetch fresh category details:', err)
          setFetchError('Could not load latest category data from server.')
        }
      })

    return () => {
      ignore = true
    }
  }, [activeCategoryId])

  const liveCategory =
    fetchedCategory && fetchedCategory.id === category?.id
      ? fetchedCategory
      : category

  const isLoading = Boolean(activeCategoryId && (!fetchedCategory || fetchedCategory.id !== activeCategoryId))

  if (!isOpen || !liveCategory) return null

  const handleCopySlug = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveCategory.fullPath || `/${liveCategory.slug}`)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStatusBadge = () => {
    switch (liveCategory.status) {
      case 'active':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        )
      case 'draft':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-semibold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            <span>Draft</span>
          </span>
        )
      case 'scheduled':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold inline-flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{liveCategory.scheduledDateText || 'Scheduled'}</span>
          </span>
        )
      case 'archived':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold inline-flex items-center gap-1.5 border border-outline-variant/60">
            <span>Archived</span>
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/60">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between shrink-0 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-on-surface">Category Details</h2>
                {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              </div>
              <p className="text-xs text-on-surface-variant">
                Live taxonomy node and metadata from database
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {fetchError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 flex items-center justify-center border border-outline-variant/60 shadow-xs">
                {liveCategory.imageUrl ? (
                  <img
                    src={liveCategory.imageUrl}
                    alt={liveCategory.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Folder className="w-7 h-7 text-primary/60" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-on-surface">{liveCategory.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    {liveCategory.level === 'root' ? 'Root Category' : 'Subcategory'}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                  ID: {liveCategory.id}
                </p>
              </div>
            </div>

            <div>{renderStatusBadge()}</div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Linked Products</p>
                <p className="text-base font-bold text-on-surface">
                  {liveCategory.totalProductsCount} SKUs
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Subcategories</p>
                <p className="text-base font-bold text-on-surface">
                  {liveCategory.subcategoriesCount || 0} Children
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Display Order</p>
                <p className="text-base font-bold text-on-surface">{liveCategory.displayOrder}</p>
              </div>
            </div>
          </div>

          {/* URL & Routing */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Storefront Routing &amp; Slug Path
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm">
              <span className="font-mono text-primary font-semibold break-all">
                {liveCategory.fullPath || `/${liveCategory.slug}`}
              </span>
              <button
                type="button"
                onClick={handleCopySlug}
                className="ml-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/60 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>Copy Path</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parent Info if Subcategory */}
          {liveCategory.level === 'subcategory' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Parent Hierarchy Node
              </label>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">
                    {liveCategory.parentName || 'Root Category'}
                  </p>
                  <p className="text-xs text-on-surface-variant font-mono">
                    Parent ID: {liveCategory.parentId || 'N/A'}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-white text-on-surface-variant border border-outline-variant/60 font-semibold">
                  Parent Node
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Description
            </label>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface">
              {liveCategory.description || (
                <span className="text-on-surface-variant italic">No description provided.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between shrink-0 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose()
                onEdit(liveCategory)
              }}
              className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Category</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
