import { ShoppingBag, TrendingUp, Clock, Truck, RotateCcw } from 'lucide-react'
import type { OrdersKpiData } from '../../data/mockOrdersData'

interface OrdersMetricCardsProps {
  kpis: OrdersKpiData
}

export function OrdersMetricCards({ kpis }: OrdersMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Total Orders */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Total Orders (30d)
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.totalOrders.value}
        </div>

        {/* 3. Insight Badge below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{kpis.totalOrders.changePercent}</span>
          </span>
        </div>
      </div>

      {/* Metric 2: Needs Dispatch */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Needs Dispatch
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.needsDispatch.value}
        </div>

        {/* 3. Insight Badge below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{kpis.needsDispatch.urgentCount} Urgent</span>
          </span>
        </div>
      </div>

      {/* Metric 3: In Transit */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            In Transit
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.inTransit.value}
        </div>

        {/* 3. Insight Badge below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Truck className="w-3 h-3 text-primary" />
            <span>{kpis.inTransit.arrivingTodayCount} Today</span>
          </span>
        </div>
      </div>

      {/* Metric 4: Returns & Exceptions */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Returns &amp; Exceptions
          </span>
          <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.returnsExceptions.value}
        </div>

        {/* 3. Insight Badge below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            <RotateCcw className="w-3 h-3 text-stone-600" />
            <span>{kpis.returnsExceptions.inspectionPendingCount} Pending</span>
          </span>
        </div>
      </div>
    </div>
  )
}

