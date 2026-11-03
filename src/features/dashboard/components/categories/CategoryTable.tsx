import {
  CornerDownRight,
  FolderTree,
  Star,
  Clock,
  Copy,
  Edit2,
  PlusCircle,
  ExternalLink,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { CategoryItem } from '../../types/category'

interface CategoryTableProps {
  categories: CategoryItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onEditCategory: (category: CategoryItem) => void
  onAddSubcategory: (parentCategory: CategoryItem) => void
  onPreviewCategory: (category: CategoryItem) => void
  onCopySlug: (slug: string) => void
}

export function CategoryTable({
  categories,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditCategory,
  onAddSubcategory,
  onPreviewCategory,
  onCopySlug,
}: CategoryTableProps) {
  const isAllSelected =
    categories.length > 0 && categories.every((c) => selectedIds.includes(c.id))

  const renderStatusBadge = (category: CategoryItem) => {
    switch (category.status) {
      case 'active':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        )
      case 'draft':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-semibold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            <span>Draft</span>
          </span>
        )
      case 'scheduled':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{category.scheduledDateText || 'Scheduled'}</span>
          </span>
        )
      case 'archived':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold inline-flex items-center gap-1.5 border border-outline-variant/60">
            <span>Archived</span>
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-outline-variant/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider border-b border-outline-variant/60">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 min-w-[280px]">Category Name &amp; Visual</th>
              <th className="py-3 px-4 min-w-[180px]">Slug / Path</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Total Products</th>
              <th className="py-3 px-4">Visibility</th>
              <th className="py-3 px-4 text-center">Display Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface divide-y divide-outline-variant/40">
            {categories.map((cat) => {
              const isSelected = selectedIds.includes(cat.id)
              const isSubcategory = cat.level === 'subcategory'

              return (
                <tr
                  key={cat.id}
                  className={`transition-colors group ${
                    isSubcategory ? 'bg-stone-50/40' : 'bg-white'
                  } hover:bg-stone-50/80`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(cat.id)}
                      className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
                    />
                  </td>

                  {/* Category Name & Visual */}
                  <td className="py-3 px-4">
                    <div
                      className={`flex items-center gap-3 ${
                        isSubcategory ? 'pl-6' : ''
                      }`}
                    >
                      {isSubcategory && (
                        <CornerDownRight className="text-on-surface-variant/70 w-4 h-4 shrink-0" />
                      )}

                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high shrink-0 flex items-center justify-center text-primary shadow-xs border border-outline-variant/60">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FolderTree className="w-5 h-5 text-primary" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm">
                            {cat.name}
                          </span>
                          {cat.isFeatured && (
                            <span title="Featured Collection" className="inline-flex items-center">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            </span>
                          )}
                          {cat.status === 'scheduled' && (
                            <Clock className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        <span className="text-xs text-on-surface-variant truncate max-w-xs">
                          {cat.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Slug / Path */}
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-low px-2 py-1 rounded border border-outline-variant/60 font-mono">
                      <span className="truncate max-w-[170px]">{cat.fullPath}</span>
                      <button
                        type="button"
                        onClick={() => onCopySlug(cat.fullPath)}
                        className="p-0.5 rounded text-on-surface-variant hover:text-on-surface cursor-pointer hover:bg-white"
                        title="Copy slug"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="py-3 px-4">
                    {cat.level === 'root' ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                        Root Parent
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                        Sub-category
                      </span>
                    )}
                  </td>

                  {/* Total Products */}
                  <td className="py-3 px-4 font-semibold text-on-surface text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{cat.totalProductsCount} SKUs</span>
                      {cat.subcategoriesCount && cat.subcategoriesCount > 0 ? (
                        <span className="text-xs text-on-surface-variant font-normal">
                          ({cat.subcategoriesCount} subcats)
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="py-3 px-4">{renderStatusBadge(cat)}</td>

                  {/* Display Order */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded font-mono border border-outline-variant/40">
                      {cat.displayOrder}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEditCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {cat.level === 'root' && (
                        <button
                          type="button"
                          onClick={() => onAddSubcategory(cat)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Add Subcategory"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onPreviewCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Preview on Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Footer Summary */}
      <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/60">
        <span className="text-xs text-on-surface-variant">
          Showing 1 to {categories.length} of 28 total categories across 2 levels
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="px-3 py-1.5 rounded-lg bg-white text-on-surface-variant opacity-50 cursor-not-allowed text-xs border border-outline-variant/60 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <span className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold shadow-xs">
            1
          </span>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-lg bg-white text-on-surface-variant hover:text-on-surface border border-outline-variant/60 cursor-pointer transition-colors"
          >
            2
          </button>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-lg bg-white text-on-surface-variant hover:text-on-surface border border-outline-variant/60 cursor-pointer transition-colors"
          >
            3
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white text-on-surface-variant hover:text-on-surface text-xs border border-outline-variant/60 cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
