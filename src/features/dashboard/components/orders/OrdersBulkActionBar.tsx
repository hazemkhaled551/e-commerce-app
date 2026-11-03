import { Printer, Truck, Download, XCircle } from 'lucide-react'

interface OrdersBulkActionBarProps {
  selectedCount: number
  onBulkFulfill: () => void
  onBulkMarkInTransit: () => void
  onBulkExport: () => void
  onBulkCancel: () => void
  onClearSelection: () => void
}

export function OrdersBulkActionBar({
  selectedCount,
  onBulkFulfill,
  onBulkMarkInTransit,
  onBulkExport,
  onBulkCancel,
  onClearSelection,
}: OrdersBulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-stone-900 text-white shadow-xl mb-4 transition-all duration-200 border border-stone-800 animate-fade-in flex-wrap gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {selectedCount}
          </span>
          <span>orders selected</span>
        </div>

        <div className="h-4 w-px bg-white/20 hidden sm:block" />

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBulkFulfill}
            className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Bulk Fulfill &amp; Print Labels</span>
          </button>

          <button
            type="button"
            onClick={onBulkMarkInTransit}
            className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Mark In-Transit</span>
          </button>

          <button
            type="button"
            onClick={onBulkExport}
            className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Selected</span>
          </button>

          <button
            type="button"
            onClick={onBulkCancel}
            className="h-8 px-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Orders</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="text-xs text-stone-300 hover:text-white underline font-medium cursor-pointer ml-auto sm:ml-0 transition-colors"
      >
        Clear Selection
      </button>
    </div>
  )
}

