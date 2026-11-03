import { Truck } from 'lucide-react'

interface ShippingSectionProps {
  weight: number
  weightUnit: 'g' | 'oz' | 'lb'
  length: number
  width: number
  height: number
  dimensionUnit: 'cm' | 'in'
  hsCode: string
  shippingProfile: string
  onWeightChange: (val: number) => void
  onWeightUnitChange: (unit: 'g' | 'oz' | 'lb') => void
  onLengthChange: (val: number) => void
  onWidthChange: (val: number) => void
  onHeightChange: (val: number) => void
  onHsCodeChange: (code: string) => void
  onShippingProfileChange: (profile: string) => void
}

export function ShippingSection({
  weight,
  weightUnit,
  length,
  width,
  height,
  dimensionUnit,
  hsCode,
  shippingProfile,
  onWeightChange,
  onWeightUnitChange,
  onLengthChange,
  onWidthChange,
  onHeightChange,
  onHsCodeChange,
  onShippingProfileChange,
}: ShippingSectionProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">
            Shipping &amp; Physical Fulfillment
          </h2>
        </div>
        <span className="text-xs text-on-surface-variant font-mono font-medium">
          Parcel Standard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Weight */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">Weight</label>
          <div className="flex shadow-xs rounded-lg overflow-hidden border border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <input
              type="number"
              min="0"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-surface-container-lowest text-on-surface text-sm font-mono focus:outline-none"
            />
            <select
              value={weightUnit}
              onChange={(e) => onWeightUnitChange(e.target.value as 'g' | 'oz' | 'lb')}
              className="h-10 px-2.5 bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none border-l border-outline-variant/60 cursor-pointer"
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        {/* Length */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">Length</label>
          <div className="flex shadow-xs rounded-lg overflow-hidden border border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <input
              type="number"
              min="0"
              value={length}
              onChange={(e) => onLengthChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-surface-container-lowest text-on-surface text-sm font-mono focus:outline-none"
            />
            <span className="h-10 px-3 bg-surface-container-low text-on-surface-variant text-xs flex items-center font-semibold border-l border-outline-variant/60">
              {dimensionUnit}
            </span>
          </div>
        </div>

        {/* Width */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">Width</label>
          <div className="flex shadow-xs rounded-lg overflow-hidden border border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <input
              type="number"
              min="0"
              value={width}
              onChange={(e) => onWidthChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-surface-container-lowest text-on-surface text-sm font-mono focus:outline-none"
            />
            <span className="h-10 px-3 bg-surface-container-low text-on-surface-variant text-xs flex items-center font-semibold border-l border-outline-variant/60">
              {dimensionUnit}
            </span>
          </div>
        </div>

        {/* Height */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">Height</label>
          <div className="flex shadow-xs rounded-lg overflow-hidden border border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <input
              type="number"
              min="0"
              value={height}
              onChange={(e) => onHeightChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-surface-container-lowest text-on-surface text-sm font-mono focus:outline-none"
            />
            <span className="h-10 px-3 bg-surface-container-low text-on-surface-variant text-xs flex items-center font-semibold border-l border-outline-variant/60">
              {dimensionUnit}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/60">
        {/* HS Code */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Harmonized Tariff (HS Code)
          </label>
          <input
            type="text"
            value={hsCode}
            onChange={(e) => onHsCodeChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>

        {/* Shipping Profile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Shipping Profile
          </label>
          <select
            value={shippingProfile}
            onChange={(e) => onShippingProfileChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
          >
            <option>Standard Fragile Electronics (Insured 2-Day)</option>
            <option>Heavy Freight / Oversized</option>
            <option>Free Economy Ground (Nexa Free)</option>
          </select>
        </div>
      </div>
    </section>
  )
}
