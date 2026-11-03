import { SearchX, RotateCcw, FileEdit } from 'lucide-react'

interface CatalogEmptyStateProps {
  onClearFilters: () => void
  onBrowseDrafts: () => void
}

export function CatalogEmptyState({ onClearFilters, onBrowseDrafts }: CatalogEmptyStateProps) {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-[0_2px_12px_rgba(36,51,49,0.03)]">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline mb-4 shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-base font-bold text-on-surface mb-1">
        No catalog products match your search criteria
      </h3>

      <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
        Try adjusting your keywords, removing active category or stock filters, or browse draft items pending approval.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          type="button"
          onClick={onClearFilters}
          className="h-9 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/60 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>

        <button
          type="button"
          onClick={onBrowseDrafts}
          className="h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Browse Drafts</span>
        </button>
      </div>
    </div>
  )
}
