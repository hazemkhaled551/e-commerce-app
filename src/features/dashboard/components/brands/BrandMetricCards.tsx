import { Building2, CheckCircle2, ShieldCheck, Package } from 'lucide-react'
import type { BrandMetrics } from '../../types/brand'

interface BrandMetricCardsProps {
  metrics: BrandMetrics
  isLoading?: boolean
}

export function BrandMetricCards({ metrics, isLoading = false }: BrandMetricCardsProps) {
  const activeRate =
    metrics.totalBrands > 0
      ? Math.round((metrics.activeBrands / metrics.totalBrands) * 100)
      : 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between gap-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-surface-container-high rounded" />
              <div className="w-7 h-7 rounded-lg bg-surface-container-high" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <div className="h-7 w-10 bg-surface-container-high rounded" />
              <div className="h-3 w-16 bg-surface-container rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* 1. Total Brands */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Total Brands
          </span>
          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Building2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.totalBrands}</span>
          <span className="text-[11px] font-medium text-on-surface-variant">registered</span>
        </div>
      </div>

      {/* 2. Active Brands */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Active Brands
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.activeBrands}</span>
          <span className="text-[11px] font-semibold text-emerald-600">
            {activeRate}% catalog live
          </span>
        </div>
      </div>

      {/* 3. In-House / Internal */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            In-House Makers
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.internalBrands}</span>
          <span className="text-[11px] font-medium text-primary">proprietary</span>
        </div>
      </div>

      {/* 4. Products Covered */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Products Assigned
          </span>
          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
            <Package className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">
            {metrics.totalProductsAssigned}
          </span>
          <span className="text-[11px] font-medium text-on-surface-variant">total catalog SKUs</span>
        </div>
      </div>
    </div>
  )
}
