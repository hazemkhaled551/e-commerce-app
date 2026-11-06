import { Search, X, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react'
import type {
  CollectionFilters,
  CollectionStatus,
  CollectionLocation,
} from '../../types/collection'

interface CollectionToolbarProps {
  filters: CollectionFilters
  onFilterChange: (filters: CollectionFilters) => void
  selectedCount: number
  onBulkActivate: () => void
  onBulkArchive: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export function CollectionToolbar({
  filters,
  onFilterChange,
  selectedCount,
  onBulkActivate,
  onBulkArchive,
  onBulkDelete,
  onClearSelection,
}: CollectionToolbarProps) {
  const hasActiveFilters =
    filters.searchTerm.trim() !== '' ||
    filters.status !== 'all' ||
    filters.location !== 'all'

  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      status: 'all',
      location: 'all',
      sortBy: 'title',
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-outline-variant/60 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Search collections by title, slug, or placement..."
            className="w-full h-10 pl-9 pr-8 rounded-lg bg-surface-container-lowest text-on-surface text-xs md:text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/70 shadow-2xs transition-all"
          />
          {filters.searchTerm && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
              className="absolute right-2.5 top-2.5 p-1 rounded hover:bg-surface-container text-on-surface-variant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Select */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as CollectionStatus | 'all',
              })
            }
            className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Location Select */}
          <select
            value={filters.location}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                location: e.target.value as CollectionLocation | 'all',
              })
            }
            className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Placements</option>
            <option value="Home Grid">Home Grid</option>
            <option value="Storefront Catalog">Storefront Catalog</option>
            <option value="Banner">Banner</option>
            <option value="Sidebar">Sidebar</option>
          </select>

          {/* Sort Select */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as 'title' | 'productCount' | 'recent',
              })
            }
            className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
          >
            <option value="title">Sort by Title (A-Z)</option>
            <option value="productCount">Sort by Most Products</option>
            <option value="recent">Sort by Recently Updated</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-medium flex items-center gap-1 border border-outline-variant/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-900 text-white shadow-lg animate-fade-in text-xs font-medium border border-stone-800">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold">
              {selectedCount} selected
            </span>
            <span className="text-stone-300 hidden sm:inline">Apply to selected collections:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBulkActivate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-400 font-semibold cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>

            <button
              type="button"
              onClick={onBulkArchive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>

            <button
              type="button"
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
