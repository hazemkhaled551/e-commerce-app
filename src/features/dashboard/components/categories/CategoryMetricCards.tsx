import type { CategoryKpis } from '../../types/category'

interface CategoryMetricCardsProps {
  kpis: CategoryKpis
}

export function CategoryMetricCards({ kpis }: CategoryMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
      {/* Card 1: Total Categories */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/15">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Total Categories
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">folder_copy</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-space-xs mb-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {kpis.totalCategories}
            </span>
            <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              +{kpis.newThisQuarter} this quarter
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Spread across 2 taxonomic tiers
          </p>
        </div>
      </div>

      {/* Card 2: Active Display */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/15">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Active Display
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-space-xs mb-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {kpis.activeDisplay}
            </span>
            <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">
              {kpis.activePercentText}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Published &amp; indexed on storefront
          </p>
        </div>
      </div>

      {/* Card 3: Avg Products / Category */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/15">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Avg Products / Category
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">sell</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-space-xs mb-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {kpis.avgProductsPerCategory}
            </span>
            <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-semibold">
              Balanced
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            SKU distribution healthy; min 8 / max 215
          </p>
        </div>
      </div>

      {/* Card 4: Featured Collections */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/15">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Featured Collections
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shadow-xs">
            <span className="material-symbols-outlined text-[18px]">star</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-space-xs mb-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {kpis.featuredCollectionsCount}
            </span>
            <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              Home &amp; Hero
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Promoted with rich merchandising graphics
          </p>
        </div>
      </div>
    </div>
  )
}

