import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import type { DashboardKpi } from '../types/dashboard'

interface KpiCardProps {
  kpi: DashboardKpi
  onActionClick?: (kpiId: string) => void
}

export function KpiCard({ kpi }: KpiCardProps) {
  // 1. Icon matching the KPI category
  const renderIcon = () => {
    switch (kpi.icon) {
      case 'payments':
        return <DollarSign className="w-4 h-4 text-primary" />
      case 'shopping_cart_checkout':
        return <ShoppingBag className="w-4 h-4 text-primary" />
      case 'insights':
        return <TrendingUp className="w-4 h-4 text-primary" />
      case 'priority_high':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      default:
        return <TrendingUp className="w-4 h-4 text-primary" />
    }
  }

  // 2. Insight badge section below the number
  const renderInsight = () => {
    if (kpi.type === 'sparkline_revenue') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span>+14.2%</span>
        </span>
      )
    }

    if (kpi.type === 'sparkline_orders') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span>+12.4%</span>
        </span>
      )
    }

    if (kpi.type === 'progress_aov') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span>+$4.73</span>
        </span>
      )
    }

    if (kpi.type === 'action_dispatch') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>6 Urgent</span>
        </span>
      )
    }

    return null
  }

  const isWarning = kpi.type === 'action_dispatch'

  return (
    <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
      {/* 1. Header: Title on Left & Icon on Right */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
          {kpi.title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            isWarning
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
        >
          {renderIcon()}
        </div>
      </div>

      {/* 2. Number below them */}
      <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
        {kpi.value}
      </div>

      {/* 3. Insight below the number */}
      <div className="mt-2.5 flex items-center">
        {renderInsight()}
      </div>
    </div>
  )
}
