import { Download, Plus } from 'lucide-react'

interface CatalogHeaderProps {
  onExport: () => void
  onAddProduct: () => void
}

export function CatalogHeader({ onExport, onAddProduct }: CatalogHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4">
      <div className="flex flex-col text-left">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
          Products &amp; Catalog
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl">
          Manage master SKU catalog, visibility channels, variant structures, and multi-location availability across all storefronts.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center gap-2 shadow-xs hover:bg-surface-container-low transition-all cursor-pointer border border-outline-variant/60"
        >
          <Download className="w-4 h-4 text-outline" />
          <span>Export Catalog</span>
        </button>

        <button
          type="button"
          onClick={onAddProduct}
          className="h-9 px-3.5 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary-hover transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  )
}
