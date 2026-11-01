import { useState } from 'react'
import type { CategoryItem } from '../../types/category'

interface CategoryTreeVisualProps {
  categories: CategoryItem[]
  onEditCategory: (cat: CategoryItem) => void
  onAddSubcategory: (cat: CategoryItem) => void
}

export function CategoryTreeVisual({
  categories,
  onEditCategory,
  onAddSubcategory,
}: CategoryTreeVisualProps) {
  const rootCategories = categories.filter((c) => c.level === 'root')
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg mb-space-2xl border border-outline-variant/15">
      <div className="flex items-center justify-between mb-space-md pb-space-sm border-b border-outline-variant/15">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">account_tree</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Hierarchical Taxonomy Tree
          </h3>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          2 Levels • {rootCategories.length} Root Nodes
        </span>
      </div>

      <div className="space-y-space-md">
        {rootCategories.map((root) => {
          const children = categories.filter(
            (c) => c.level === 'subcategory' && c.parentId === root.id
          )
          const isCollapsed = collapsedMap[root.id]

          return (
            <div
              key={root.id}
              className="rounded-xl bg-surface-container-low p-space-md border border-outline-variant/20 shadow-xs"
            >
              {/* Root Row */}
              <div className="flex items-center justify-between gap-space-sm flex-wrap">
                <div className="flex items-center gap-space-sm min-w-0">
                  {children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCollapse(root.id)}
                      className="w-7 h-7 rounded-md hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCollapsed ? 'chevron_right' : 'expand_more'}
                      </span>
                    </button>
                  )}

                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 flex items-center justify-center border border-outline-variant/20">
                    {root.imageUrl ? (
                      <img src={root.imageUrl} alt={root.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-primary">
                        folder
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        {root.name}
                      </span>
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                        Root Parent
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                        {root.fullPath}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {root.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm">
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface bg-surface-container px-2 py-1 rounded">
                    {root.totalProductsCount} SKUs
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddSubcategory(root)}
                    className="h-8 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>Add Child</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditCategory(root)}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>

              {/* Children Subtree */}
              {!isCollapsed && children.length > 0 && (
                <div className="mt-space-md ml-6 pl-4 border-l-2 border-primary/20 space-y-space-sm">
                  {children.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between gap-space-sm border border-outline-variant/15"
                    >
                      <div className="flex items-center gap-space-sm min-w-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          subdirectory_arrow_right
                        </span>
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                          {sub.imageUrl ? (
                            <img
                              src={sub.imageUrl}
                              alt={sub.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[16px]">category</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">
                            {sub.name}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant font-mono truncate text-xs">
                            {sub.fullPath}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-space-sm">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {sub.totalProductsCount} SKUs
                        </span>
                        <button
                          type="button"
                          onClick={() => onEditCategory(sub)}
                          className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

