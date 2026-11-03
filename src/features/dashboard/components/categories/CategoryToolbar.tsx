import { Search, ChevronDown, List, FolderTree, SlidersHorizontal } from 'lucide-react'
import type { CategoryFilters } from '../../types/category'

interface CategoryToolbarProps {
  filters: CategoryFilters
  viewMode: 'table' | 'tree'
  onFilterChange: (key: keyof CategoryFilters, value: string) => void
  onViewModeChange: (mode: 'table' | 'tree') => void
}

export function CategoryToolbar({
  filters,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: CategoryToolbarProps) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-outline-variant/60">
      {/* Left: Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            placeholder="Search categories by name, slug or code..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface text-sm appearance-none cursor-pointer border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium transition-all shadow-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (24)</option>
              <option value="draft">Draft (3)</option>
              <option value="scheduled">Scheduled (1)</option>
              <option value="archived">Archived (0)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Level filter */}
          <div className="relative">
            <select
              value={filters.level}
              onChange={(e) => onFilterChange('level', e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface text-sm appearance-none cursor-pointer border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium transition-all shadow-xs"
            >
              <option value="all">All Levels</option>
              <option value="root">Root / Top-level Only (12)</option>
              <option value="subcategory">Sub-categories Only (16)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right: View Switcher */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center p-1 rounded-lg bg-surface-container-low border border-outline-variant/60">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-primary shadow-xs border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('tree')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-white text-primary shadow-xs border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Tree Visual</span>
          </button>
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface border border-outline-variant/60 transition-all cursor-pointer shadow-xs"
          title="Columns & Display Density"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
