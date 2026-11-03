import { Globe, EyeOff, DollarSign, Archive, Trash2, X, Info } from 'lucide-react'

interface CatalogBulkActionsProps {
  selectedCount: number
  onBulkPublish: () => void
  onBulkUnpublish: () => void
  onBulkUpdatePrice: () => void
  onBulkArchive: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export function CatalogBulkActions({
  selectedCount,
  onBulkPublish,
  onBulkUnpublish,
  onBulkUpdatePrice,
  onBulkArchive,
  onBulkDelete,
  onClearSelection,
}: CatalogBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className="p-3 px-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-fade-in text-left"
      id="bulk-selection-bar"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
          <span className="w-5 h-5 rounded-md bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">
            {selectedCount}
          </span>
          <span className="text-primary font-semibold">{selectedCount} products selected</span>
        </div>

        <div className="h-4 w-px bg-primary/20 hidden sm:block" />

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBulkPublish}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Publish</span>
          </button>

          <button
            type="button"
            onClick={onBulkUnpublish}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
          >
            <EyeOff className="w-3.5 h-3.5 text-outline" />
            <span>Unpublish</span>
          </button>

          <button
            type="button"
            onClick={onBulkUpdatePrice}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
          >
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span>Adjust Price (+5%)</span>
          </button>

          <button
            type="button"
            onClick={onBulkArchive}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60"
          >
            <Archive className="w-3.5 h-3.5 text-outline" />
            <span>Archive</span>
          </button>

          {/* Delete Action with Dependency Warning Tooltip */}
          <div className="relative group">
            <button
              type="button"
              onClick={onBulkDelete}
              className="h-8 px-2.5 rounded-lg bg-error/10 text-error text-xs font-semibold shadow-xs hover:bg-error hover:text-on-error transition-all flex items-center gap-1.5 cursor-pointer border border-error/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-60 p-2.5 rounded-xl bg-on-surface text-surface text-xs shadow-xl z-30 pointer-events-none text-left">
              <div className="font-bold flex items-center gap-1 text-primary">
                <Info className="w-3.5 h-3.5" />
                <span>Deletion Safety Rule</span>
              </div>
              <span className="text-[11px] mt-0.5 opacity-90 leading-tight">
                Products currently assigned to pending orders cannot be permanently removed.
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
      >
        <span>Clear</span>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
