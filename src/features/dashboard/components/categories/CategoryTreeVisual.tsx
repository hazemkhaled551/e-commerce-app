import { useState } from 'react'
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Folder,
  CornerDownRight,
  PlusCircle,
  Edit2,
  Eye,
} from 'lucide-react'
import type { CategoryItem } from '../../types/category'

interface CategoryTreeVisualProps {
  categories: CategoryItem[]
  onViewCategory?: (cat: CategoryItem) => void
  onEditCategory: (cat: CategoryItem) => void
  onAddSubcategory: (cat: CategoryItem) => void
}

export function CategoryTreeVisual({
  categories,
  onViewCategory,
  onEditCategory,
  onAddSubcategory,
}: CategoryTreeVisualProps) {
  const rootCategories = categories.filter((c) => c.level === 'root')
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-outline-variant/60">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/60">
        <div className="flex items-center gap-2.5">
          <FolderTree className="text-primary w-5 h-5" />
          <h3 className="text-base font-semibold text-on-surface">
            Hierarchical Taxonomy Tree
          </h3>
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          2 Levels • {rootCategories.length} Root Nodes
        </span>
      </div>

      <div className="space-y-4">
        {rootCategories.map((root) => {
          const children = categories.filter(
            (c) => c.level === 'subcategory' && c.parentId === root.id
          )
          const isCollapsed = collapsedMap[root.id]

          return (
            <div
              key={root.id}
              className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/60 shadow-xs"
            >
              {/* Root Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  {children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCollapse(root.id)}
                      className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors border border-transparent hover:border-outline-variant/40"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 flex items-center justify-center border border-outline-variant/60 shadow-xs">
                    {root.imageUrl ? (
                      <img src={root.imageUrl} alt={root.name} className="w-full h-full object-cover" />
                    ) : (
                      <Folder className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface text-sm">
                        {root.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                        Root Parent
                      </span>
                      <span className="text-xs text-on-surface-variant font-mono">
                        {root.fullPath}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant truncate">
                      {root.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface bg-white px-2.5 py-1 rounded border border-outline-variant/60">
                    {root.totalProductsCount} SKUs
                  </span>
                  {onViewCategory && (
                    <button
                      type="button"
                      onClick={() => onViewCategory(root)}
                      className="p-1.5 rounded-lg hover:bg-white text-on-surface-variant hover:text-primary cursor-pointer border border-transparent hover:border-outline-variant/40 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onAddSubcategory(root)}
                    className="h-8 px-3 rounded-lg bg-white hover:bg-primary hover:text-white text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-outline-variant/60 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Child</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditCategory(root)}
                    className="p-1.5 rounded-lg hover:bg-white text-on-surface-variant hover:text-on-surface cursor-pointer border border-transparent hover:border-outline-variant/40 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Children Subtree */}
              {!isCollapsed && children.length > 0 && (
                <div className="mt-3 ml-6 pl-4 border-l-2 border-primary/30 space-y-2">
                  {children.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-lg bg-white flex items-center justify-between gap-3 border border-outline-variant/60 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CornerDownRight className="text-primary w-4 h-4 shrink-0" />
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-outline-variant/40 flex items-center justify-center">
                          {sub.imageUrl ? (
                            <img
                              src={sub.imageUrl}
                              alt={sub.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FolderTree className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-on-surface">
                            {sub.name}
                          </span>
                          <span className="text-xs text-on-surface-variant font-mono truncate">
                            {sub.fullPath}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant font-medium">
                          {sub.totalProductsCount} SKUs
                        </span>
                        {onViewCategory && (
                          <button
                            type="button"
                            onClick={() => onViewCategory(sub)}
                            className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditCategory(sub)}
                          className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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
