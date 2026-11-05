import { useState, useEffect } from 'react'
import { Warehouse, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { checkProductSkuAvailability } from '../../api/adminProductApi'

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
  // Remote SKU check state
  const [remoteSkuCheck, setRemoteSkuCheck] = useState<{
    sku: string
    status: 'idle' | 'checking' | 'available' | 'taken'
    message: string | null
  }>({
    sku: '',
    status: 'idle',
    message: null,
  })

  const trimmedSku = sku.trim()

  useEffect(() => {
    if (!trimmedSku) return

    let ignore = false
    const timer = setTimeout(() => {
      checkProductSkuAvailability(trimmedSku)
        .then((result) => {
          if (!ignore) {
            setRemoteSkuCheck({
              sku: trimmedSku,
              status: result.available ? 'available' : 'taken',
              message: result.available ? null : result.message || 'SKU is already in use',
            })
          }
        })
        .catch(() => {
          if (!ignore) {
            setRemoteSkuCheck({
              sku: trimmedSku,
              status: 'taken',
              message: 'Check failed',
            })
          }
        })
    }, 400)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [trimmedSku])

  const skuStatus = !trimmedSku
    ? 'idle'
    : remoteSkuCheck.sku === trimmedSku
      ? remoteSkuCheck.status
      : 'checking'

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
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="sku-input">
                SKU (Stock Keeping Unit)
              </label>
              {skuStatus === 'checking' && (
                <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-600" />
                  <span>Checking</span>
                </span>
              )}
              {skuStatus === 'available' && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Available</span>
                </span>
              )}
              {skuStatus === 'taken' && (
                <span className="flex items-center gap-1 text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-semibold">
                  <AlertCircle className="w-2.5 h-2.5 text-red-600" />
                  <span>Taken</span>
                </span>
              )}
            </div>
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
            onChange={(e) => onSkuChange(e.target.value.toUpperCase())}
            className={`w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-sm border transition-colors focus:outline-none focus:ring-2 shadow-xs ${
              skuStatus === 'available'
                ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                : skuStatus === 'taken'
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                  : 'border-outline-variant/60 focus:border-primary focus:ring-primary/20'
            }`}
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
