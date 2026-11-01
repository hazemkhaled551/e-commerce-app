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
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm mb-space-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md border border-outline-variant/15">
      {/* Left: Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm flex-1">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            placeholder="Search categories by name, slug or code..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-outline-variant/20 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-space-xs flex-wrap">
          {/* Status filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none cursor-pointer focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (24)</option>
              <option value="draft">Draft (3)</option>
              <option value="scheduled">Scheduled (1)</option>
              <option value="archived">Archived (0)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Level filter */}
          <div className="relative">
            <select
              value={filters.level}
              onChange={(e) => onFilterChange('level', e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none cursor-pointer focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/20 font-medium"
            >
              <option value="all">All Levels</option>
              <option value="root">Root / Top-level Only (12)</option>
              <option value="subcategory">Sub-categories Only (16)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Right: View Switcher */}
      <div className="flex items-center justify-between sm:justify-end gap-space-sm">
        <div className="flex items-center p-1 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`px-space-sm py-1 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_list</span>
            <span>Table View</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('tree')}
            className={`px-space-sm py-1 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>Tree Visual</span>
          </button>
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface border border-outline-variant/20 transition-all cursor-pointer"
          title="Columns &amp; Display Density"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </div>
  )
}

