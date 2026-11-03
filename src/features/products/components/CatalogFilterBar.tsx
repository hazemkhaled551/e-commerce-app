export interface CategoryTab {
  id: string
  label: string
  count?: number
}

export interface CatalogFilterBarProps {
  categories: CategoryTab[]
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  totalCount: number
}

export function CatalogFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
}: CatalogFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
          activeCategory === 'all'
            ? 'bg-primary text-on-primary shadow-sm'
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
                ? 'bg-primary text-on-primary shadow-sm'
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
  )
}

