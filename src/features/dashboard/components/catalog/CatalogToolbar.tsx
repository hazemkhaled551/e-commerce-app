import type { CatalogFilters } from '../../types/catalog'

interface CatalogToolbarProps {
  filters: CatalogFilters
  onFilterChange: (key: keyof CatalogFilters, value: string) => void
  onResetFilters?: () => void
}

export function CatalogToolbar({ filters, onFilterChange }: CatalogToolbarProps) {
  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md border border-outline-variant/15">
      {/* Search Field */}
      <div className="relative flex-1 max-w-2xl">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          placeholder="Search by product name, SKU, barcode, or tag..."
          className="w-full pl-11 pr-20 h-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner transition-all border border-outline-variant/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="font-label-caps text-label-caps px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-semibold shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Faceted Selectors */}
      <div className="flex items-center gap-space-xs flex-wrap">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
          >
            <option value="all">All Categories (4)</option>
            <option value="Electronics & Audio">Electronics &amp; Audio</option>
            <option value="Kitchen & Culinary">Kitchen &amp; Culinary</option>
            <option value="Home & Office">Home &amp; Office</option>
            <option value="Accessories">Accessories</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
          >
            <option value="all">Status: All (428)</option>
            <option value="published">Published (394)</option>
            <option value="draft">Draft (20)</option>
            <option value="unpublished">Unpublished (8)</option>
            <option value="archived">Archived (6)</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* Stock Filter */}
        <div className="relative">
          <select
            value={filters.stock}
            onChange={(e) => onFilterChange('stock', e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
          >
            <option value="all">Stock: All Quantities</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (≤ 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
          >
            <option value="all">Brand: All Brands</option>
            <option value="AeroSound">AeroSound</option>
            <option value="DeskPower">DeskPower</option>
            <option value="Cast & Clay">Cast &amp; Clay</option>
            <option value="Nordic Minimalist">Nordic Minimalist</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant">
            expand_more
          </span>
        </div>

        {/* More Filters Toggle */}
        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer border border-outline-variant/20"
          title="More Filters"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
    </div>
  )
}

