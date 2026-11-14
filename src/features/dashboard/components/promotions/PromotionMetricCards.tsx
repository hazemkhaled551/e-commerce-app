import { Tag, CheckCircle2, Ticket, TrendingUp, AlertCircle } from 'lucide-react'
import type { PromotionMetrics } from '../../types/promotion'

interface PromotionMetricCardsProps {
  metrics: PromotionMetrics
  isLoading?: boolean
}

export function PromotionMetricCards({
  metrics,
  isLoading = false,
}: PromotionMetricCardsProps) {
  const activeRate =
    metrics.totalPromotions > 0
      ? Math.round((metrics.activePromotions / metrics.totalPromotions) * 100)
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
              <div className="h-7 w-12 bg-surface-container-high rounded" />
              <div className="h-3 w-16 bg-surface-container rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* 1. Total Promotions */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Total Campaigns
          </span>
          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Tag className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.totalPromotions}</span>
          <span className="text-[11px] font-medium text-on-surface-variant">registered</span>
        </div>
      </div>

      {/* 2. Active Discounts */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Active Discounts
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">{metrics.activePromotions}</span>
          <span className="text-[11px] font-semibold text-emerald-600">
            {activeRate}% currently live
          </span>
        </div>
      </div>

      {/* 3. Total Redemptions */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Total Redemptions
          </span>
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Ticket className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-on-surface">
            {metrics.totalRedemptions.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-sky-600">times claimed</span>
        </div>
      </div>

      {/* 4. Customer Savings or Expiring Alert */}
      <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            {metrics.expiringSoonCount > 0 ? 'Expiring Soon' : 'Customer Savings'}
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              metrics.expiringSoonCount > 0
                ? 'bg-amber-50 text-amber-600'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {metrics.expiringSoonCount > 0 ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {metrics.expiringSoonCount > 0 ? (
            <>
              <span className="text-2xl font-bold text-amber-600">
                {metrics.expiringSoonCount}
              </span>
              <span className="text-[11px] font-semibold text-amber-600">
                within 72 hours
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-on-surface">
                ${Math.round(metrics.totalDiscountGiven).toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-primary">discounted value</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

