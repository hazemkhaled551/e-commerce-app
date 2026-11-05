import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { CatalogFilters } from '../../types/catalog'

interface CatalogToolbarProps {
  filters: CatalogFilters
  onFilterChange: (key: keyof CatalogFilters, value: string) => void
  onResetFilters?: () => void
  categories?: string[]
  brands?: string[]
}

export function CatalogToolbar({
  filters,
  onFilterChange,
  categories,
  brands,
}: CatalogToolbarProps) {
  const categoryOptions =
    categories && categories.length > 0
      ? categories
      : ['Electronics & Audio', 'Kitchen & Culinary', 'Home & Office', 'Accessories']

  const brandOptions =
    brands && brands.length > 0
      ? brands
      : ['AeroSound', 'DeskPower', 'Cast & Clay', 'Nordic Minimalist']
  return (
    <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(36,51,49,0.03)] flex flex-col xl:flex-row xl:items-center justify-between gap-3 border border-outline-variant/60">
      {/* Search Field */}
      <div className="relative flex-1 max-w-2xl">
        <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          placeholder="Search by product name, SKU, barcode, or tag..."
          className="w-full pl-10 pr-16 h-10 rounded-xl bg-surface-container-low/70 text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all border border-outline-variant/60"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/70 text-outline">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Faceted Selectors */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-xl bg-surface-container-low/70 text-on-surface text-xs font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:border-primary border border-outline-variant/60"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-xl bg-surface-container-low/70 text-on-surface text-xs font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:border-primary border border-outline-variant/60"
          >
            <option value="all">Status: All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unpublished">Unpublished</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Stock Filter */}
        <div className="relative">
          <select
            value={filters.stock}
            onChange={(e) => onFilterChange('stock', e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-xl bg-surface-container-low/70 text-on-surface text-xs font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:border-primary border border-outline-variant/60"
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (≤ 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-xl bg-surface-container-low/70 text-on-surface text-xs font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:border-primary border border-outline-variant/60"
          >
            <option value="all">Brand: All</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* More Filters Toggle */}
        <button
          type="button"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-surface-container-low/70 text-outline hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/60"
          title="More Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
