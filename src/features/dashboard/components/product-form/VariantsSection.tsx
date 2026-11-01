import { useState } from 'react'
import type { VariantOptionItem, VariantCombination } from '../../types/productForm'

interface VariantsSectionProps {
  hasVariants: boolean
  colorOptions: VariantOptionItem[]
  careOptions: VariantOptionItem[]
  variants: VariantCombination[]
  basePrice?: number
  baseSku?: string
  onToggleHasVariants: (val: boolean) => void
  onRemoveColor: (id: string) => void
  onAddColor: (label: string, colorHex: string) => void
  onRemoveCare: (id: string) => void
  onAddCare: (label: string, extraPrice: number) => void
  onVariantStockChange: (id: string, stock: number) => void
  onVariantPriceChange?: (id: string, price: number) => void
  onToggleVariantActive: (id: string) => void
  onRemoveVariant?: (id: string) => void
  onAddCustomVariant?: (variant: VariantCombination) => void
  onLoadPresetVariants?: () => void
}

const COLOR_PRESETS = [
  { label: 'Midnight Black', hex: '#0f172a' },
  { label: 'Matte Silver', hex: '#cbd5e1' },
  { label: 'Navy Blue', hex: '#1e3a8a' },
  { label: 'Pure White', hex: '#f8fafc' },
  { label: 'Crimson Red', hex: '#b91c1c' },
  { label: 'Forest Green', hex: '#047857' },
]

const TIER_PRESETS = [
  { label: 'Standard 1-Year', extra: 0 },
  { label: 'NexaCare+ 2-Year', extra: 29 },
  { label: 'Lifetime Care', extra: 79 },
]

export function VariantsSection({
  hasVariants,
  colorOptions,
  careOptions,
  variants,
  basePrice = 199,
  baseSku = 'SKU',
  onToggleHasVariants,
  onRemoveColor,
  onAddColor,
  onRemoveCare,
  onAddCare,
  onVariantStockChange,
  onVariantPriceChange,
  onToggleVariantActive,
  onRemoveVariant,
  onAddCustomVariant,
  onLoadPresetVariants,
}: VariantsSectionProps) {
  // Inline inputs for Color
  const [colorNameInput, setColorNameInput] = useState('')
  const [colorHexInput, setColorHexInput] = useState('#0f172a')

  // Inline inputs for Care
  const [careLabelInput, setCareLabelInput] = useState('')
  const [careExtraInput, setCareExtraInput] = useState('0')

  // Inline inputs for Custom Variant
  const [customTitle, setCustomTitle] = useState('')
  const [customSku, setCustomSku] = useState('')
  const [customPrice, setCustomPrice] = useState(basePrice.toString())
  const [customStock, setCustomStock] = useState('50')
  const [showAddCustomRow, setShowAddCustomRow] = useState(false)

  const handleAddColorSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!colorNameInput.trim()) return
    onAddColor(colorNameInput.trim(), colorHexInput)
    setColorNameInput('')
  }

  const handleAddCareSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!careLabelInput.trim()) return
    onAddCare(careLabelInput.trim(), parseFloat(careExtraInput) || 0)
    setCareLabelInput('')
    setCareExtraInput('0')
  }

  const handleAddCustomVariantSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTitle.trim()) return
    if (onAddCustomVariant) {
      onAddCustomVariant({
        id: `v-custom-${Date.now()}`,
        title: customTitle.trim(),
        sku: customSku.trim() || `${baseSku}-${Math.floor(100 + Math.random() * 900)}`,
        price: parseFloat(customPrice) || basePrice,
        stock: parseInt(customStock, 10) || 50,
        isActive: true,
      })
      setCustomTitle('')
      setCustomSku('')
      setShowAddCustomRow(false)
    }
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Variants &amp; Options</h2>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => onToggleHasVariants(e.target.checked)}
            className="w-4 h-4 rounded text-primary cursor-pointer"
          />
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">
            Has Variants
          </span>
        </label>
      </div>

      {hasVariants && (
        <>
          {/* Option 1: Colors */}
          <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">palette</span>
                <span>Option 1: Color Variants</span>
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {colorOptions.length} added
              </span>
            </div>

            {/* Chips list */}
            {colorOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-space-xs">
                {colorOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="px- space-xs py-1 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 shadow-xs border border-outline-variant/20"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-outline-variant/30 shrink-0 shadow-inner"
                      style={{ backgroundColor: opt.colorHex || '#1e293b' }}
                    />
                    <span className="font-medium">{opt.label}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveColor(opt.id)}
                      className="material-symbols-outlined text-[15px] text-on-surface-variant cursor-pointer hover:text-error transition-colors ml-1"
                      title="Remove color"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Inline Input Form */}
            <form onSubmit={handleAddColorSubmit} className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
                <div className="relative flex items-center">
                  <input
                    type="color"
                    value={colorHexInput}
                    onChange={(e) => setColorHexInput(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-outline-variant/30 p-0.5 bg-surface-container-lowest"
                    title="Choose color shade"
                  />
                </div>
                <input
                  type="text"
                  value={colorNameInput}
                  onChange={(e) => setColorNameInput(e.target.value)}
                  placeholder="Type color name (e.g. Midnight Black)..."
                  className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container flex-1"
                />
              </div>

              <button
                type="submit"
                className="h-8 px-3 rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Color</span>
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-on-surface-variant font-medium">Quick add:</span>
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onAddColor(p.label, p.hex)}
                  className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-body-sm text-[11px] flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/15"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-outline-variant/30"
                    style={{ backgroundColor: p.hex }}
                  />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 2: Care / Tier / Size */}
          <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <span>Option 2: Care Plan / Warranty / Tier</span>
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {careOptions.length} added
              </span>
            </div>

            {/* Chips list */}
            {careOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-space-xs">
                {careOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 shadow-xs border border-outline-variant/20"
                  >
                    <span className="font-medium">{opt.label}</span>
                    {Boolean(opt.extraPrice && opt.extraPrice > 0) && (
                      <span className="text-secondary font-mono text-xs font-semibold">
                        (+${opt.extraPrice})
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveCare(opt.id)}
                      className="material-symbols-outlined text-[15px] text-on-surface-variant cursor-pointer hover:text-error transition-colors ml-1"
                      title="Remove tier"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Inline Input Form */}
            <form onSubmit={handleAddCareSubmit} className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="text"
                value={careLabelInput}
                onChange={(e) => setCareLabelInput(e.target.value)}
                placeholder="Tier label (e.g. NexaCare+ 2-Year)..."
                className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container flex-1 min-w-[200px]"
              />

              <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg border border-outline-variant/30 px-2 h-8">
                <span className="text-on-surface-variant text-xs font-mono">+$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={careExtraInput}
                  onChange={(e) => setCareExtraInput(e.target.value)}
                  placeholder="Extra $"
                  className="w-16 bg-transparent text-on-surface font-mono text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="h-8 px-3 rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Tier</span>
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-on-surface-variant font-medium">Quick add:</span>
              {TIER_PRESETS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => onAddCare(t.label, t.extra)}
                  className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/15"
                >
                  <span>{t.label}</span>
                  {t.extra > 0 && <span className="text-secondary font-mono ml-0.5">+{t.extra}$</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Matrix Combinations Table */}
          <div className="flex flex-col gap-space-xs mt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">table_rows</span>
                <span>
                  Generated Variant Combinations (
                  <strong className="text-primary font-bold">
                    {variants.filter((v) => v.isActive).length}
                  </strong>{' '}
                  Active)
                </span>
              </span>

              <div className="flex items-center gap-2">
                {onLoadPresetVariants && (
                  <button
                    type="button"
                    onClick={onLoadPresetVariants}
                    className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                    <span>Load Recommended Template</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddCustomRow(!showAddCustomRow)}
                  className="h-7 px-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>{showAddCustomRow ? 'Hide Custom' : 'Add Custom Row'}</span>
                </button>
              </div>
            </div>

            {/* Custom variant inline addition form */}
            {showAddCustomRow && (
              <form
                onSubmit={handleAddCustomVariantSubmit}
                className="p-space-sm rounded-lg bg-surface-container-low border border-primary/30 flex flex-wrap items-center gap-2 animate-fade-in"
              >
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Variant Title (e.g. Special Edition Gold)..."
                  className="h-8 px-2.5 rounded bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/30 flex-1 min-w-[180px]"
                />
                <input
                  type="text"
                  value={customSku}
                  onChange={(e) => setCustomSku(e.target.value)}
                  placeholder="Custom SKU"
                  className="h-8 px-2 rounded bg-surface-container-lowest font-mono text-on-surface text-xs border border-outline-variant/30 w-32"
                />
                <div className="flex items-center gap-1 bg-surface-container-lowest rounded px-2 h-8 border border-outline-variant/30">
                  <span className="text-xs text-on-surface-variant">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-16 bg-transparent text-xs font-mono text-on-surface focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 bg-surface-container-lowest rounded px-2 h-8 border border-outline-variant/30">
                  <span className="text-xs text-on-surface-variant">Qty</span>
                  <input
                    type="number"
                    value={customStock}
                    onChange={(e) => setCustomStock(e.target.value)}
                    className="w-12 bg-transparent text-xs font-mono text-on-surface focus:outline-none text-right"
                  />
                </div>
                <button
                  type="submit"
                  className="h-8 px-3 rounded bg-primary-container text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                >
                  Save Row
                </button>
              </form>
            )}

            {/* Table or Empty State */}
            {variants.length > 0 ? (
              <div className="overflow-x-auto rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-xs">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase border-b border-outline-variant/15">
                    <tr>
                      <th className="p-space-xs text-center w-8">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                      </th>
                      <th className="p-space-xs min-w-[200px]">Variant</th>
                      <th className="p-space-xs min-w-[130px]">SKU</th>
                      <th className="p-space-xs min-w-[100px]">Price ($)</th>
                      <th className="p-space-xs min-w-[90px]">Stock</th>
                      <th className="p-space-xs text-center">Status</th>
                      <th className="p-space-xs text-right w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {variants.map((v) => (
                      <tr
                        key={v.id}
                        className={`transition-colors ${
                          v.isActive
                            ? 'bg-surface-container-lowest hover:bg-surface-container-low'
                            : 'bg-surface-container-low/60 opacity-60'
                        }`}
                      >
                        <td className="p-space-xs text-center">
                          <input
                            type="checkbox"
                            checked={v.isActive}
                            onChange={() => onToggleVariantActive(v.id)}
                            className="rounded cursor-pointer accent-primary"
                          />
                        </td>
                        <td className="p-space-xs font-semibold text-on-surface flex items-center gap-2">
                          {v.colorHex && (
                            <span
                              className="w-3 h-3 rounded-full border border-outline-variant/40 shrink-0 shadow-xs"
                              style={{ backgroundColor: v.colorHex }}
                            />
                          )}
                          <span>{v.title}</span>
                        </td>
                        <td className="p-space-xs font-mono text-[11px] text-on-surface-variant">
                          {v.sku}
                        </td>
                        <td className="p-space-xs font-mono">
                          <div className="flex items-center gap-1 bg-surface-container rounded px-1.5 py-0.5 border border-outline-variant/20 w-24">
                            <span className="text-on-surface-variant text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={v.price}
                              onChange={(e) =>
                                onVariantPriceChange?.(v.id, parseFloat(e.target.value) || 0)
                              }
                              className="w-full bg-transparent font-mono text-xs font-semibold text-on-surface focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="p-space-xs">
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) =>
                              onVariantStockChange(v.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="w-16 h-7 px-1.5 rounded bg-surface-container text-right font-mono border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                          />
                        </td>
                        <td className="p-space-xs text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] font-semibold ${
                              v.isActive
                                ? 'bg-secondary-fixed text-on-secondary-fixed'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            {v.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-space-xs text-right">
                          <button
                            type="button"
                            onClick={() => onRemoveVariant?.(v.id)}
                            className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                            title="Remove variant"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-outline text-[32px] mb-1">
                  layers_clear
                </span>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                  No variant combinations generated yet
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-0.5 mb-3 text-xs">
                  Add color or care options above to automatically generate matrix combinations, or load the default template.
                </p>
                {onLoadPresetVariants && (
                  <button
                    type="button"
                    onClick={onLoadPresetVariants}
                    className="h-8 px-space-md rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold flex items-center gap-1.5 hover:bg-secondary cursor-pointer shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    <span>Load 4 Sample Variations (Ready to Edit)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}
