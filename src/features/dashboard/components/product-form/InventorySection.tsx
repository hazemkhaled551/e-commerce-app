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
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">warehouse</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Inventory &amp; Stock</h2>
        </div>
        <span
          className={`px-space-xs py-0.5 rounded-full font-label-caps text-label-caps font-semibold ${
            stockCount > 0
              ? 'bg-secondary-fixed text-on-secondary-fixed'
              : 'bg-error-container text-on-error-container'
          }`}
        >
          {stockCount > 0 ? `${stockCount} In Stock` : 'Out of Stock'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* SKU */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="sku-input">
              SKU (Stock Keeping Unit)
            </label>
            <button
              type="button"
              onClick={onAutoGenerateSku}
              className="font-label-caps text-label-caps text-primary hover:underline font-semibold cursor-pointer"
            >
              Auto-Generate
            </button>
          </div>
          <input
            id="sku-input"
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-mono font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        {/* Barcode */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="barcode-input">
            Barcode (GTIN / UPC / EAN)
          </label>
          <input
            id="barcode-input"
            type="text"
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-mono font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
      </div>

      {/* Stock Quantity & Threshold */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* Available Stock Quantity */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="stock-count-input">
            Available Stock Quantity *
          </label>
          <div className="relative">
            <input
              id="stock-count-input"
              type="number"
              min="0"
              value={stockCount}
              onChange={(e) => onStockCountChange(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-semibold border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm text-body-sm pointer-events-none">
              units
            </span>
          </div>
        </div>

        {/* Low Stock Alert Threshold */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="threshold-input">
            Low Stock Alert Threshold
          </label>
          <div className="relative">
            <input
              id="threshold-input"
              type="number"
              min="0"
              value={lowStockThreshold}
              onChange={(e) => onThresholdChange(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm text-body-sm pointer-events-none">
              units triggers alert
            </span>
          </div>
        </div>
      </div>

      {/* Out-of-Stock Policy */}
      <div className="pt-space-xs border-t border-outline-variant/15 flex flex-col gap-space-xs">
        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
          Out-of-Stock Policy
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-space-md mt-1">
          <label className="flex items-center gap-space-xs cursor-pointer">
            <input
              type="radio"
              name="oos-policy"
              checked={outOfStockPolicy === 'stop_selling'}
              onChange={() => onPolicyChange('stop_selling')}
              className="text-primary focus:ring-primary-container cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface">
              Stop selling when inventory reaches zero
            </span>
          </label>

          <label className="flex items-center gap-space-xs cursor-pointer">
            <input
              type="radio"
              name="oos-policy"
              checked={outOfStockPolicy === 'accept_backorders'}
              onChange={() => onPolicyChange('accept_backorders')}
              className="text-primary focus:ring-primary-container cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface">
              Continue selling / Accept backorders
            </span>
          </label>
        </div>
      </div>
    </section>
  )
}
