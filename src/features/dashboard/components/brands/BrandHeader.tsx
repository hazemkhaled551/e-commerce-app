import { Plus, Download, Building2 } from 'lucide-react'

interface BrandHeaderProps {
  onAddBrand: () => void
  onExport?: () => void
  totalCount: number
}

export function BrandHeader({ onAddBrand, onExport, totalCount }: BrandHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
            Brands &amp; Manufacturers
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            {totalCount} Total
          </span>
        </div>
        <p className="text-xs md:text-sm text-on-surface-variant">
          Manage hardware makers, partner manufacturers, brand logos, and catalog brand attribution.
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start md:self-auto">
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/60 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Export CSV</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAddBrand}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Add Brand</span>
        </button>
      </div>
    </header>
  )
}
