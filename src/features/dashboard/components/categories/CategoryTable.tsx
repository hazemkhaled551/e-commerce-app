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
          <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>Active</span>
          </span>
        )
      case 'draft':
        return (
          <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-semibold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            <span>Draft</span>
          </span>
        )
      case 'scheduled':
        return (
          <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-surface-container-highest text-secondary font-semibold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>{category.scheduledDateText || 'Scheduled'}</span>
          </span>
        )
      case 'archived':
        return (
          <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold inline-flex items-center gap-1">
            <span>Archived</span>
          </span>
        )
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-2xl border border-outline-variant/15">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider border-b border-outline-variant/20">
              <th className="py-space-sm px-space-md w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded bg-surface-container text-primary-container cursor-pointer"
                />
              </th>
              <th className="py-space-sm px-space-md min-w-[280px]">Category Name &amp; Visual</th>
              <th className="py-space-sm px-space-md min-w-[180px]">Slug / Path</th>
              <th className="py-space-sm px-space-md">Level</th>
              <th className="py-space-sm px-space-md">Total Products</th>
              <th className="py-space-sm px-space-md">Visibility</th>
              <th className="py-space-sm px-space-md text-center">Display Order</th>
              <th className="py-space-sm px-space-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container/60">
            {categories.map((cat) => {
              const isSelected = selectedIds.includes(cat.id)
              const isSubcategory = cat.level === 'subcategory'

              return (
                <tr
                  key={cat.id}
                  className={`transition-colors group ${
                    isSubcategory ? 'bg-surface-container-lowest/60' : 'bg-surface-container-lowest'
                  } hover:bg-surface-container-low`}
                >
                  {/* Select Checkbox */}
                  <td className="py-space-md px-space-md text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(cat.id)}
                      className="w-4 h-4 rounded bg-surface-container text-primary-container cursor-pointer"
                    />
                  </td>

                  {/* Category Name & Visual */}
                  <td className="py-space-md px-space-md">
                    <div
                      className={`flex items-center gap-space-sm ${
                        isSubcategory ? 'pl-6' : ''
                      }`}
                    >
                      {isSubcategory && (
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
                          subdirectory_arrow_right
                        </span>
                      )}

                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 flex items-center justify-center text-primary shadow-xs border border-outline-variant/20">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[20px]">category</span>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                          {cat.isFeatured && (
                            <span
                              className="material-symbols-outlined text-[16px] text-tertiary"
                              title="Featured Collection"
                            >
                              stars
                            </span>
                          )}
                          {cat.status === 'scheduled' && (
                            <span className="material-symbols-outlined text-[16px] text-tertiary">
                              schedule
                            </span>
                          )}
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-xs">
                          {cat.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Slug / Path */}
                  <td className="py-space-md px-space-md">
                    <div className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/15">
                      <span className="font-mono text-xs truncate max-w-[170px]">{cat.fullPath}</span>
                      <button
                        type="button"
                        onClick={() => onCopySlug(cat.fullPath)}
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-on-surface p-0.5"
                        title="Copy slug"
                      >
                        content_copy
                      </button>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="py-space-md px-space-md">
                    {cat.level === 'root' ? (
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                        Root Parent
                      </span>
                    ) : (
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">
                        Sub-category
                      </span>
                    )}
                  </td>

                  {/* Total Products */}
                  <td className="py-space-md px-space-md font-semibold text-on-surface">
                    <div className="flex items-center gap-space-xs">
                      <span>{cat.totalProductsCount} SKUs</span>
                      {cat.subcategoriesCount && cat.subcategoriesCount > 0 ? (
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                          ({cat.subcategoriesCount} subcats)
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="py-space-md px-space-md">{renderStatusBadge(cat)}</td>

                  {/* Display Order */}
                  <td className="py-space-md px-space-md text-center">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded font-mono">
                      {cat.displayOrder}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-space-md px-space-md text-right">
                    <div className="flex items-center justify-end gap-space-xs">
                      <button
                        type="button"
                        onClick={() => onEditCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      {cat.level === 'root' && (
                        <button
                          type="button"
                          onClick={() => onAddSubcategory(cat)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Add Subcategory"
                        >
                          <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onPreviewCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Preview on Store"
                      >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="More options"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
      <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-outline-variant/15">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing 1 to {categories.length} of 28 total categories across 2 levels
        </span>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            disabled
            className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed font-body-sm text-body-sm border border-outline-variant/15"
          >
            Previous
          </button>
          <span className="font-label-caps text-label-caps px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-semibold shadow-xs">
            1
          </span>
          <button
            type="button"
            className="font-label-caps text-label-caps px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/15 cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="font-label-caps text-label-caps px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/15 cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm border border-outline-variant/15 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

