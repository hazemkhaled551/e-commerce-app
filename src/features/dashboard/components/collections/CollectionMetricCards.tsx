import { Layers, Sparkles, CheckCircle2, PackageCheck } from 'lucide-react'
import type { CollectionMetrics } from '../../types/collection'

interface CollectionMetricCardsProps {
  metrics: CollectionMetrics
}

export function CollectionMetricCards({ metrics }: CollectionMetricCardsProps) {
  const activeRate =
    metrics.totalCollections > 0
      ? Math.round((metrics.activeCollections / metrics.totalCollections) * 100)
      : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* 1. Total Collections */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Total Collections
          </span>
          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.totalCollections}</span>
          <span className="text-[11px] font-medium text-on-surface-variant">curations</span>
        </div>
      </div>

      {/* 2. Active Collections */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Live Curations
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.activeCollections}</span>
          <span className="text-[11px] font-semibold text-emerald-600">
            {activeRate}% published
          </span>
        </div>
      </div>

      {/* 3. Featured on Homepage */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Home Grid Spotlight
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.featuredCount}</span>
          <span className="text-[11px] font-medium text-amber-600">spotlight sets</span>
        </div>
      </div>

      {/* 4. Products Grouped */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Curated Products
          </span>
          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
            <PackageCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">
            {metrics.curatedProductsCount}
          </span>
          <span className="text-[11px] font-medium text-on-surface-variant">item placements</span>
        </div>
      </div>
    </div>
  )
}

