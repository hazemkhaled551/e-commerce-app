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
            leftIcon={<Search className="w-4 h-4 text-outline" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="hover:text-on-surface text-outline cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Sort & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-on-surface-variant whitespace-nowrap">
            <strong className="text-on-surface tabular-nums">{totalResults}</strong>{' '}
            {totalResults === 1 ? 'product' : 'products'}
          </span>

          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/60 shadow-xs">
            <label htmlFor="sort-select" className="text-xs text-on-surface-variant font-medium whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`h-8 px-3.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border-outline-variant/60'
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
