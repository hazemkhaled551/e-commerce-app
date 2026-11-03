import { useState } from 'react'
import {
  Package,
  Warehouse,
  Truck,
  Zap,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react'
import type { OrderItemDetail } from '../../types/orderDetails'

interface FulfillmentWorkspaceCardProps {
  items: OrderItemDetail[]
  warehouseLocation: string
  slaRemainingText: string
  carrier: string
  trackingNumber: string
  isEmailNotifyCustomer: boolean
  isFulfilled: boolean
  onCarrierChange: (carrier: string) => void
  onTrackingChange: (tracking: string) => void
  onNotifyToggle: (notify: boolean) => void
  onAutoGenerateTracking: () => void
  onFulfillSelected: (selectedItemIds: string[]) => void
}

export function FulfillmentWorkspaceCard({
  items,
  warehouseLocation,
  slaRemainingText,
  carrier,
  trackingNumber,
  isEmailNotifyCustomer,
  isFulfilled,
  onCarrierChange,
  onTrackingChange,
  onNotifyToggle,
  onAutoGenerateTracking,
  onFulfillSelected,
}: FulfillmentWorkspaceCardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map((i) => i.id))

  const handleToggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  const handleToggleItem = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 overflow-hidden flex flex-col mb-6">
      {/* 1. Header Banner with Location & SLA */}
      <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              {isFulfilled ? 'Fulfilled Order Items' : 'Unfulfilled Items'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {items.length} items awaiting pick &amp; pack from{' '}
              <strong className="text-on-surface font-semibold">{warehouseLocation}</strong>
            </p>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{slaRemainingText}</span>
          </span>
        </div>
      </div>

      {/* 2. Line Items Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container/60 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant/50">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  disabled={isFulfilled}
                  className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
                />
              </th>
              <th className="py-3 px-3 min-w-[240px]">Item &amp; Specifications</th>
              <th className="py-3 px-3 min-w-[120px]">Location / Bin</th>
              <th className="py-3 px-3 text-center min-w-[70px]">Qty</th>
              <th className="py-3 px-3 text-right min-w-[100px]">Price</th>
              <th className="py-3 px-4 text-right min-w-[110px]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-xs text-on-surface">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id)

              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-primary/5' : 'hover:bg-stone-50/70 bg-white'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleItem(item.id)}
                      disabled={isFulfilled}
                      className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
                    />
                  </td>

                  {/* Item info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/60 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-on-surface hover:text-primary transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-mono">
                          SKU: {item.sku} • {item.variant}
                        </span>
                        {item.isLowStock ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded w-fit mt-0.5">
                            Low Stock: {item.stockAvailable} units left
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded w-fit mt-0.5">
                            In Stock: {item.stockAvailable} units available
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Location / Bin */}
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2 py-1 rounded-lg bg-surface-container text-on-surface border border-outline-variant/50">
                      <Warehouse className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{item.binLocation}</span>
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-3 text-center font-bold text-on-surface align-middle">
                    {item.quantity}
                  </td>

                  {/* Unit Price */}
                  <td className="py-3.5 px-3 text-right font-mono text-on-surface align-middle">
                    ${item.unitPrice.toFixed(2)}
                  </td>

                  {/* Line Total */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface align-middle">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Integrated Fulfillment Action Workspace */}
      <div className="p-5 bg-surface-container-low/70 border-t border-outline-variant/50 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <span>Shipping &amp; Label Dispatch Setup</span>
          </h3>
          <span className="text-[11px] text-on-surface-variant font-mono bg-white px-2.5 py-0.5 rounded-full border border-outline-variant/50">
            API Integration: Active (FedEx WebServices)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carrier Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Logistics Carrier &amp; Service
            </label>
            <select
              value={carrier}
              onChange={(e) => onCarrierChange(e.target.value)}
              disabled={isFulfilled}
              className="w-full h-10 px-3 rounded-xl bg-white text-xs font-medium text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs cursor-pointer"
            >
              <option value="FedEx - Priority Overnight (Next Business Morning)">
                FedEx - Priority Overnight (Next Business Morning)
              </option>
              <option value="FedEx - Ground Home Delivery">
                FedEx - Ground Home Delivery
              </option>
              <option value="UPS - Next Day Air Saver">UPS - Next Day Air Saver</option>
              <option value="USPS - Priority Mail Express">USPS - Priority Mail Express</option>
              <option value="DHL Express Worldwide">DHL Express Worldwide</option>
              <option value="Nexa Fleet Logistics Express (Local Direct)">
                Nexa Fleet Logistics Express (Local Direct)
              </option>
            </select>
          </div>

          {/* Tracking Identifier */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Tracking Identifier
              </label>
              {!isFulfilled && (
                <button
                  type="button"
                  onClick={onAutoGenerateTracking}
                  className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-primary" />
                  <span>Auto-Generate via API</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => onTrackingChange(e.target.value)}
                disabled={isFulfilled}
                placeholder="FXG-9842-8819-2041-US"
                className="w-full h-10 pl-3 pr-9 rounded-xl bg-white text-xs font-mono font-medium text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Notification Checkbox & Main Fulfill CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isEmailNotifyCustomer}
              onChange={(e) => onNotifyToggle(e.target.checked)}
              disabled={isFulfilled}
              className="rounded text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer accent-primary"
            />
            <span className="text-xs text-on-surface">
              Send dispatch notification email with tracking portal link to customer immediately
            </span>
          </label>

          <button
            type="button"
            onClick={() => onFulfillSelected(selectedIds)}
            disabled={selectedIds.length === 0 || isFulfilled}
            className={`h-10 px-5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              selectedIds.length === 0 || isFulfilled
                ? 'bg-surface-container text-on-surface-variant cursor-not-allowed border border-outline-variant/60'
                : 'bg-primary hover:bg-primary-hover text-on-primary active:scale-95'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>
              {isFulfilled
                ? 'All Items Already Dispatched'
                : `Fulfill ${selectedIds.length} Selected Item${selectedIds.length > 1 ? 's' : ''}`}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

