import type { CatalogMetrics } from '../../types/catalog'

interface CatalogMetricCardsProps {
  metrics: CatalogMetrics
}

export function CatalogMetricCards({ metrics }: CatalogMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
      {/* Card 1: Total Products */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/15">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Total Products
          </span>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-price-lg text-price-lg text-on-surface font-bold tracking-tight">
              {metrics.totalProducts}
            </span>
            <span className="font-body-sm text-body-sm text-secondary font-medium">
              All active units
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]">inventory_2</span>
        </div>
      </div>

      {/* Card 2: Published Live */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/15">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Published Live
          </span>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-price-lg text-price-lg text-on-surface font-bold tracking-tight">
              {metrics.publishedCount}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[22px]">public</span>
        </div>
      </div>

      {/* Card 3: Low Stock / Critical */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/15">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Low Stock / Critical
          </span>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-price-lg text-price-lg text-error font-bold tracking-tight">
              {metrics.lowStockCount}
            </span>
            <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">
              Needs restock
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-error-container/60 flex items-center justify-center text-error">
          <span className="material-symbols-outlined text-[22px]">notification_important</span>
        </div>
      </div>

      {/* Card 4: Drafts & Staging */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/15">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Drafts &amp; Staging
          </span>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-price-lg text-price-lg text-on-surface font-bold tracking-tight">
              {metrics.draftCount}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Pending approvals
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">edit_note</span>
        </div>
      </div>
    </div>
  )
}

