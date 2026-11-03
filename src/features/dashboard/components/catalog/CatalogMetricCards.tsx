import { Package, Globe, AlertTriangle, FileEdit } from 'lucide-react'
import type { CatalogMetrics } from '../../types/catalog'

interface CatalogMetricCardsProps {
  metrics: CatalogMetrics
}

export function CatalogMetricCards({ metrics }: CatalogMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Products */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Total Products
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {metrics.totalProducts}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            All Active Units
          </span>
        </div>
      </div>

      {/* Card 2: Published Live */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Published Live
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Globe className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {metrics.publishedCount}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            On Storefront
          </span>
        </div>
      </div>

      {/* Card 3: Low Stock / Critical */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Low Stock / Critical
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 font-mono">
          {metrics.lowStockCount}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Needs Restock</span>
          </span>
        </div>
      </div>

      {/* Card 4: Drafts & Staging */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Drafts &amp; Staging
          </span>
          <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <FileEdit className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {metrics.draftCount}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            Pending Review
          </span>
        </div>
      </div>
    </div>
  )
}
