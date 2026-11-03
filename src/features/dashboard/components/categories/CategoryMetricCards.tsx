import { Folder, Eye, Tag, Sparkles } from 'lucide-react'
import type { CategoryKpis } from '../../types/category'

interface CategoryMetricCardsProps {
  kpis: CategoryKpis
}

export function CategoryMetricCards({ kpis }: CategoryMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 text-left">
      {/* Card 1: Total Categories */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Total Categories
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Folder className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.totalCategories}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            +{kpis.newThisQuarter} Qtr
          </span>
        </div>
      </div>

      {/* Card 2: Active Display */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Display
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.activeDisplay}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {kpis.activePercentText}
          </span>
        </div>
      </div>

      {/* Card 3: Avg Products / Category */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Avg Products / Category
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Tag className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.avgProductsPerCategory}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Balanced
          </span>
        </div>
      </div>

      {/* Card 4: Featured Collections */}
      <div className="p-5 rounded-2xl bg-white shadow-xs border border-outline-variant/60 flex flex-col transition-all hover:shadow-sm">
        {/* 1. Header: Title on Left & Icon on Right */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Featured Collections
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Number below them */}
        <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
          {kpis.featuredCollectionsCount}
        </div>

        {/* 3. Insight below the number */}
        <div className="mt-2.5 flex items-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            Hero Slots
          </span>
        </div>
      </div>
    </div>
  )
}
