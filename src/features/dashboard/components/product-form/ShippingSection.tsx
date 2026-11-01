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
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Shipping &amp; Physical Fulfillment
          </h2>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant font-medium">
          Parcel Standard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm">
        {/* Weight */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">Weight</label>
          <div className="flex">
            <input
              type="number"
              min="0"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-space-xs rounded-l-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-mono border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <select
              value={weightUnit}
              onChange={(e) => onWeightUnitChange(e.target.value as 'g' | 'oz' | 'lb')}
              className="h-10 px-space-xs rounded-r-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold focus:outline-none border border-l-0 border-outline-variant/30 cursor-pointer"
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        {/* Length */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">Length</label>
          <div className="flex">
            <input
              type="number"
              min="0"
              value={length}
              onChange={(e) => onLengthChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-space-xs rounded-l-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-mono border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <span className="h-10 px-2.5 rounded-r-lg bg-surface-container text-on-surface-variant font-label-caps text-label-caps flex items-center font-semibold border border-l-0 border-outline-variant/30">
              {dimensionUnit}
            </span>
          </div>
        </div>

        {/* Width */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">Width</label>
          <div className="flex">
            <input
              type="number"
              min="0"
              value={width}
              onChange={(e) => onWidthChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-space-xs rounded-l-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-mono border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <span className="h-10 px-2.5 rounded-r-lg bg-surface-container text-on-surface-variant font-label-caps text-label-caps flex items-center font-semibold border border-l-0 border-outline-variant/30">
              {dimensionUnit}
            </span>
          </div>
        </div>

        {/* Height */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">Height</label>
          <div className="flex">
            <input
              type="number"
              min="0"
              value={height}
              onChange={(e) => onHeightChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-space-xs rounded-l-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-mono border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
            <span className="h-10 px-2.5 rounded-r-lg bg-surface-container text-on-surface-variant font-label-caps text-label-caps flex items-center font-semibold border border-l-0 border-outline-variant/30">
              {dimensionUnit}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
        {/* HS Code */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">
            Harmonized Tariff (HS Code)
          </label>
          <input
            type="text"
            value={hsCode}
            onChange={(e) => onHsCodeChange(e.target.value)}
            className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-mono font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
          />
        </div>

        {/* Shipping Profile */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">
            Shipping Profile
          </label>
          <select
            value={shippingProfile}
            onChange={(e) => onShippingProfileChange(e.target.value)}
            className="w-full h-10 px-space-sm rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none font-medium border border-outline-variant/20 cursor-pointer"
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

