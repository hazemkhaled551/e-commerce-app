interface CatalogEmptyStateProps {
  onClearFilters: () => void
  onBrowseDrafts: () => void
}

export function CatalogEmptyState({ onClearFilters, onBrowseDrafts }: CatalogEmptyStateProps) {
  return (
    <div className="py-16 px-space-md flex flex-col items-center justify-center text-center rounded-xl bg-surface-container-lowest border border-outline-variant/15 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-space-md shadow-inner">
        <span className="material-symbols-outlined text-[36px] text-outline">search_off</span>
      </div>

      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-semibold">
        No catalog items match your search criteria
      </h3>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg leading-relaxed">
        Try adjusting your search terms, removing active category or status filters, or browse draft SKUs waiting for review.
      </p>

      <div className="flex items-center gap-space-sm flex-wrap justify-center">
        <button
          type="button"
          onClick={onClearFilters}
          className="h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/20 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          <span>Clear All Filters</span>
        </button>

        <button
          type="button"
          onClick={onBrowseDrafts}
          className="h-10 px-space-md rounded-lg bg-primary-container text-on-primary font-body-md text-body-md font-semibold hover:bg-secondary transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          <span>Browse Drafts</span>
        </button>
      </div>
    </div>
  )
}

