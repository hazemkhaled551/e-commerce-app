import { Warehouse } from 'lucide-react'

interface InventorySectionProps {
  sku: string
  barcode: string
  stockCount: number
  lowStockThreshold: number
  outOfStockPolicy: 'stop_selling' | 'accept_backorders'
  onSkuChange: (val: string) => void
  onBarcodeChange: (val: string) => void
  onStockCountChange: (val: number) => void
  onThresholdChange: (val: number) => void
  onPolicyChange: (policy: 'stop_selling' | 'accept_backorders') => void
  onAutoGenerateSku: () => void
}

export function InventorySection({
  sku,
  barcode,
  stockCount,
  lowStockThreshold,
  outOfStockPolicy,
  onSkuChange,
  onBarcodeChange,
  onStockCountChange,
  onThresholdChange,
  onPolicyChange,
  onAutoGenerateSku,
}: InventorySectionProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Inventory &amp; Stock</h2>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            stockCount > 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {stockCount > 0 ? `${stockCount} In Stock` : 'Out of Stock'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SKU */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="sku-input">
              SKU (Stock Keeping Unit)
            </label>
            <button
              type="button"
              onClick={onAutoGenerateSku}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Auto-Generate
            </button>
          </div>
          <input
            id="sku-input"
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>

        {/* Barcode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="barcode-input">
            Barcode (GTIN / UPC / EAN)
          </label>
          <input
            id="barcode-input"
            type="text"
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>
      </div>

      {/* Stock Quantity & Threshold */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Available Stock Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="stock-count-input">
            Available Stock Quantity <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="stock-count-input"
              type="number"
              min="0"
              value={stockCount}
              onChange={(e) => onStockCountChange(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-semibold border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none">
              units
            </span>
          </div>
        </div>

        {/* Low Stock Alert Threshold */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="threshold-input">
            Low Stock Alert Threshold
          </label>
          <div className="relative">
            <input
              id="threshold-input"
              type="number"
              min="0"
              value={lowStockThreshold}
              onChange={(e) => onThresholdChange(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none">
              units triggers alert
            </span>
          </div>
        </div>
      </div>

      {/* Out-of-Stock Policy */}
      <div className="pt-2 border-t border-outline-variant/60 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Out-of-Stock Policy
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-0.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="oos-policy"
              checked={outOfStockPolicy === 'stop_selling'}
              onChange={() => onPolicyChange('stop_selling')}
              className="text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4"
            />
            <span className="text-xs text-on-surface group-hover:text-primary transition-colors">
              Stop selling when inventory reaches zero
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="oos-policy"
              checked={outOfStockPolicy === 'accept_backorders'}
              onChange={() => onPolicyChange('accept_backorders')}
              className="text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4"
            />
            <span className="text-xs text-on-surface group-hover:text-primary transition-colors">
              Continue selling / Accept backorders
            </span>
          </label>
        </div>
      </div>
    </section>
  )
}
