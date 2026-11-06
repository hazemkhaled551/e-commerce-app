import {
  Edit2,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  Clock,
  Archive,
} from 'lucide-react'
import type { CollectionItem } from '../../types/collection'

interface CollectionTableProps {
  collections: CollectionItem[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onSelectAll: () => void
  onView: (collection: CollectionItem) => void
  onEdit: (collection: CollectionItem) => void
  onDelete: (collection: CollectionItem) => void
  onAddNew: () => void
}

export function CollectionTable({
  collections,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}: CollectionTableProps) {
  const isAllSelected =
    collections.length > 0 && selectedIds.length === collections.length
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < collections.length

  if (collections.length === 0) {
    return (
      <div className="p-12 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
          <Layers className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-base font-bold text-on-surface mb-1">No Collections Found</h3>
        <p className="text-xs text-on-surface-variant max-w-sm mb-5">
          No collections match your filter parameters. Create promotional sets or adjust your search filter.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Create New Collection</span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/60 text-[11px] font-bold uppercase tracking-wider text-outline">
              {/* Checkbox */}
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected
                  }}
                  onChange={onSelectAll}
                  aria-label="Select all collections"
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                />
              </th>
              <th className="py-3.5 px-3">Collection &amp; Curated Theme</th>
              <th className="py-3.5 px-3">Slug</th>
              <th className="py-3.5 px-3">Placement</th>
              <th className="py-3.5 px-3 text-center">Products</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Updated</th>
              <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50 text-xs">
            {collections.map((col) => {
              const isSelected = selectedIds.includes(col.id)
              const updatedDate = new Date(col.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              return (
                <tr
                  key={col.id}
                  className={`hover:bg-surface-container-low/60 transition-colors group ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(col.id)}
                      aria-label={`Select ${col.title}`}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                    />
                  </td>

                  {/* Thumbnail + Title + Featured */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/60 flex items-center justify-center shadow-2xs">
                        {col.imageUrl ? (
                          <img
                            src={col.imageUrl}
                            alt={col.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <Layers className="w-5 h-5 text-on-surface-variant/50" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onView(col)}
                            className="text-xs font-bold text-on-surface hover:text-primary transition-colors text-left truncate cursor-pointer"
                          >
                            {col.title}
                          </button>
                          {col.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-bold tracking-tight">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>FEATURED</span>
                            </span>
                          )}
                        </div>
                        {col.description && (
                          <p className="text-[11px] text-on-surface-variant truncate max-w-xs">
                            {col.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      /{col.slug}
                    </span>
                  </td>

                  {/* Placement Location */}
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-medium">
                      {col.displayLocation}
                    </span>
                  </td>

                  {/* Curated Products */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold">
                      {col.productCount} SKUs
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    {col.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {col.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        SCHEDULED
                      </span>
                    )}
                    {col.status === 'draft' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                        DRAFT
                      </span>
                    )}
                    {col.status === 'archived' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                        <Archive className="w-3 h-3" />
                        ARCHIVED
                      </span>
                    )}
                  </td>

                  {/* Updated Date */}
                  <td className="py-3.5 px-3 text-on-surface-variant text-[11px]">
                    {updatedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pr-4 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onView(col)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
                        title="View collection"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(col)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 cursor-pointer transition-colors"
                        title="Edit collection"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(col)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
