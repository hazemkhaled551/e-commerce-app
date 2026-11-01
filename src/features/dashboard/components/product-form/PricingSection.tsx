interface PricingSectionProps {
  basePrice: number
  comparePrice: number
  costPrice: number
  chargeTax: boolean
  taxProfile: string
  onBasePriceChange: (val: number) => void
  onComparePriceChange: (val: number) => void
  onCostPriceChange: (val: number) => void
  onChargeTaxChange: (val: boolean) => void
  onTaxProfileChange: (val: string) => void
}

export function PricingSection({
  basePrice,
  comparePrice,
  costPrice,
  chargeTax,
  taxProfile,
  onBasePriceChange,
  onComparePriceChange,
  onCostPriceChange,
  onChargeTaxChange,
  onTaxProfileChange,
}: PricingSectionProps) {
  // Calculations
  const savedPercent =
    comparePrice > basePrice && comparePrice > 0
      ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
      : 0

  const netProfit = basePrice > costPrice ? Math.round((basePrice - costPrice) * 100) / 100 : 0
  const grossMargin =
    basePrice > 0 ? Math.round(((basePrice - costPrice) / basePrice) * 1000) / 10 : 0

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Pricing, Taxes &amp; Margins</h2>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant font-medium">
          Currency: USD ($)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        {/* Base Price */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="price-base">
            Base Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">
              $
            </span>
            <input
              id="price-base"
              type="number"
              step="0.01"
              min="0"
              value={basePrice || ''}
              onChange={(e) => onBasePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-7 pr-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-price-md text-price-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>

        {/* Compare-at Price */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="price-compare">
              Compare-at Price
            </label>
            {savedPercent > 0 && (
              <span className="font-label-caps text-label-caps text-secondary font-semibold">
                Saved {savedPercent}%
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">
              $
            </span>
            <input
              id="price-compare"
              type="number"
              step="0.01"
              min="0"
              value={comparePrice || ''}
              onChange={(e) => onComparePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-7 pr-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>

        {/* Cost per Item */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="cost-item">
            Cost per Item (COGS)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">
              $
            </span>
            <input
              id="cost-item"
              type="number"
              step="0.01"
              min="0"
              value={costPrice || ''}
              onChange={(e) => onCostPriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-7 pr-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>
      </div>

      {/* Profit & Margin Calculation Bar */}
      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border border-outline-variant/20">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <div className="flex items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Gross Margin:
            </span>
            <span className="font-price-md text-price-md text-primary font-bold">
              {grossMargin}%
            </span>
          </div>
          <span className="text-outline-variant font-mono">|</span>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Net Profit / Unit:
            </span>
            <span className="font-price-md text-price-md text-on-surface font-bold">
              ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Automatic calculation active
        </span>
      </div>

      {/* Tax Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
        <label className="flex items-center gap-space-xs cursor-pointer">
          <input
            type="checkbox"
            checked={chargeTax}
            onChange={(e) => onChargeTaxChange(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary-container cursor-pointer"
          />
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">
            Charge sales tax on this product
          </span>
        </label>

        <div className="flex items-center gap-space-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Tax Profile:</span>
          <select
            value={taxProfile}
            onChange={(e) => onTaxProfileChange(e.target.value)}
            className="h-8 px-space-xs rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none border border-outline-variant/20 cursor-pointer"
          >
            <option>Standard Consumer Goods (8.25%)</option>
            <option>Reduced Rate Electronics</option>
            <option>Zero-Rated / Exempt</option>
          </select>
        </div>
      </div>
    </section>
  )
}

