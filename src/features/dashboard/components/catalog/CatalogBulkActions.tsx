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
      className="p-space-sm px-space-md rounded-xl bg-surface-container-high shadow-sm flex flex-wrap items-center justify-between gap-space-sm animate-fade-in border border-outline-variant/30"
      id="bulk-selection-bar"
    >
      <div className="flex items-center gap-space-md flex-wrap">
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm font-bold text-on-surface">
          <span className="w-5 h-5 rounded bg-primary-container text-on-primary flex items-center justify-center text-[12px] font-bold">
            {selectedCount}
          </span>
          <span>products selected</span>
        </div>

        <div className="h-4 w-px bg-surface-container-highest hidden sm:block" />

        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            type="button"
            onClick={onBulkPublish}
            className="h-8 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">publish</span>
            <span>Bulk Publish</span>
          </button>

          <button
            type="button"
            onClick={onBulkUnpublish}
            className="h-8 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              visibility_off
            </span>
            <span>Unpublish</span>
          </button>

          <button
            type="button"
            onClick={onBulkUpdatePrice}
            className="h-8 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              price_change
            </span>
            <span>Update Price</span>
          </button>

          <button
            type="button"
            onClick={onBulkArchive}
            className="h-8 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs hover:bg-surface-container transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              archive
            </span>
            <span>Archive</span>
          </button>

          {/* Destructive Delete Action with Dependency Warning Tooltip */}
          <div className="relative group">
            <button
              type="button"
              onClick={onBulkDelete}
              className="h-8 px-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm font-semibold shadow-xs hover:bg-error hover:text-on-error transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_forever</span>
              <span>Delete</span>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-64 p-space-sm rounded-xl bg-inverse-surface text-inverse-on-surface font-body-sm text-body-sm shadow-xl z-30 pointer-events-none text-left">
              <div className="font-bold flex items-center gap-1 text-primary-fixed-dim">
                <span className="material-symbols-outlined text-[14px]">info</span>
                <span>Deletion Dependency Check</span>
              </div>
              <span className="text-[11px] leading-tight mt-1 opacity-90">
                Cannot delete products active in pending orders across stores.
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="font-body-sm text-body-sm text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
      >
        <span>Clear selection</span>
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  )
}

