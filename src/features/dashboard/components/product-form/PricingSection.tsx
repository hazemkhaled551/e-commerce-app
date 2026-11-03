import { DollarSign } from 'lucide-react'

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
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Pricing, Taxes &amp; Margins</h2>
        </div>
        <span className="text-xs text-on-surface-variant font-mono font-medium">
          Currency: USD ($)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Base Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="price-base">
            Base Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">
              $
            </span>
            <input
              id="price-base"
              type="number"
              step="0.01"
              min="0"
              value={basePrice || ''}
              onChange={(e) => onBasePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-8 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-semibold text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>
        </div>

        {/* Compare-at Price */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="price-compare">
              Compare-at Price
            </label>
            {savedPercent > 0 && (
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Save {savedPercent}%
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">
              $
            </span>
            <input
              id="price-compare"
              type="number"
              step="0.01"
              min="0"
              value={comparePrice || ''}
              onChange={(e) => onComparePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-8 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>
        </div>

        {/* Cost per Item */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="cost-item">
            Cost per Item (COGS)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">
              $
            </span>
            <input
              id="cost-item"
              type="number"
              step="0.01"
              min="0"
              value={costPrice || ''}
              onChange={(e) => onCostPriceChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 pl-8 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Profit & Margin Calculation Bar */}
      <div className="p-3 px-4 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/60 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-on-surface-variant uppercase tracking-wider">
              Gross Margin:
            </span>
            <span className="text-primary font-bold text-sm">
              {grossMargin}%
            </span>
          </div>
          <span className="text-outline-variant font-mono">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-on-surface-variant uppercase tracking-wider">
              Net Profit / Unit:
            </span>
            <span className="text-on-surface font-bold text-sm font-mono">
              ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>
        <span className="text-xs text-on-surface-variant">
          Automatic calculation active
        </span>
      </div>

      {/* Tax Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-outline-variant/60">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={chargeTax}
            onChange={(e) => onChargeTaxChange(e.target.checked)}
            className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
            Charge sales tax on this product
          </span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tax Profile:</span>
          <select
            value={taxProfile}
            onChange={(e) => onTaxProfileChange(e.target.value)}
            className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium shadow-xs"
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
