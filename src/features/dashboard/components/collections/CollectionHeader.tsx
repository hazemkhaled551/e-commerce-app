import { Plus, Download, Layers } from 'lucide-react'

interface CollectionHeaderProps {
  onAddCollection: () => void
  onExport?: () => void
  totalCount: number
}

export function CollectionHeader({
  onAddCollection,
  onExport,
  totalCount,
}: CollectionHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
            Collections &amp; Curations
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            {totalCount} Total
          </span>
        </div>
        <p className="text-xs md:text-sm text-on-surface-variant">
          Group products into promotional sets, home grid showcases, seasonal edits, and smart automated rule filters.
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
          onClick={onAddCollection}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Collection</span>
        </button>
      </div>
    </header>
  )
}
