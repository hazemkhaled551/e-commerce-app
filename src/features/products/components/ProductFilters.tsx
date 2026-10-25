import { Search, X } from 'lucide-react'
import type { ProductSortOption } from '../types/product'
import { Input } from '@/components/ui/Input'

export interface ProductFiltersProps {
  categories: string[]
  selectedCategory: string
  searchQuery: string
  sortBy: ProductSortOption
  totalResults: number
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: ProductSortOption) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  searchQuery,
  sortBy,
  totalResults,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top bar: Search + Sort + Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full sm:max-w-md">
          <Input
            type="text"
            placeholder="Search products by title, category, description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="hover:text-neutral-core text-neutral-subdued cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Sort & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-neutral-subdued whitespace-nowrap">
            <strong className="text-neutral-core tabular-nums">{totalResults}</strong>{' '}
            {totalResults === 1 ? 'product' : 'products'}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-neutral-subdued whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              className="bg-surface-card border border-border-divider text-xs font-semibold text-neutral-core rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-action-primary/15 focus:border-action-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Chips (DESIGN.md lines 236-237: Height 32px, rounded-lg, border #E2E8F0, active: bg #DBEAFE, text #1D4ED8, border #93C5FD) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`h-8 px-3.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-filter-active-bg text-filter-active-text border-filter-active-border'
                  : 'bg-surface-card text-neutral-subdued hover:bg-neutral-slate border-border-divider'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
