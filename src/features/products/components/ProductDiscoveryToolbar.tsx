import type { ProductSortOption } from '../types/product'

export interface CategoryTab {
  id: string
  label: string
  count?: number
}

export interface ProductDiscoveryToolbarProps {
  categories: CategoryTab[]
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  totalCount: number
  sortBy: ProductSortOption
  onSortChange: (sort: ProductSortOption) => void
  searchQuery: string
  onSearchChange: (search: string) => void
  inStockOnly?: boolean
  onToggleInStock?: () => void
  viewMode?: 'grid' | 'detailed'
  onViewModeChange?: (mode: 'grid' | 'detailed') => void
  onClearAllFilters?: () => void
}

export function ProductDiscoveryToolbar({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  inStockOnly = false,
  onToggleInStock,
  viewMode = 'grid',
  onViewModeChange,
  onClearAllFilters,
}: ProductDiscoveryToolbarProps) {
  const hasActiveFilters =
    activeCategory !== 'all' || Boolean(searchQuery.trim()) || inStockOnly

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Primary Toolbar: Category Pills + Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Filter Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-outline-variant/60'
            }`}
          >
            <span>All Objects</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase()
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-outline-variant/60'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Secondary Controls: In-Stock Toggle + Sort Dropdown + View Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* In-Stock Filter Toggle */}
          {onToggleInStock && (
            <button
              type="button"
              onClick={onToggleInStock}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                inStockOnly
                  ? 'bg-stock-in-bg text-stock-in border-stock-in/30 shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  inStockOnly ? 'bg-stock-in' : 'bg-outline'
                }`}
              />
              <span>In Stock Only</span>
            </button>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/60 shadow-xs">
            <span className="material-symbols-outlined text-outline text-base">swap_vert</span>
            <label htmlFor="sort-select" className="text-xs text-on-surface-variant font-medium">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid vs Detailed) */}
          {onViewModeChange && (
            <div className="hidden sm:flex items-center bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/60 shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-outline hover:text-on-surface'
                }`}
                title="Standard Grid (4 Columns)"
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('detailed')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'detailed'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-outline hover:text-on-surface'
                }`}
                title="Detailed View (2 Columns)"
              >
                <span className="material-symbols-outlined text-base">view_agenda</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Indicators Bar (if filters are active) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-on-surface-variant font-medium">Active filters:</span>

          {activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold border border-primary/20">
              <span>Category: {activeCategory}</span>
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="hover:text-secondary cursor-pointer"
                title="Clear category filter"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold border border-primary/20">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-secondary cursor-pointer"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stock-in-bg text-stock-in font-semibold border border-stock-in/25">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={onToggleInStock}
                className="hover:opacity-75 cursor-pointer"
                title="Clear in-stock filter"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          )}

          {onClearAllFilters && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-primary hover:underline font-semibold ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

