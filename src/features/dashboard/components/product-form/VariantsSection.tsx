import { useState } from 'react'
import {
  SlidersHorizontal,
  Palette,
  ShieldCheck,
  Table,
  Wand2,
  Plus,
  X,
  Trash2,
  Layers,
} from 'lucide-react'
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
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Variants &amp; Options</h2>
        </div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => onToggleHasVariants(e.target.checked)}
            className="w-4 h-4 rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
            Has Variants
          </span>
        </label>
      </div>

      {hasVariants && (
        <>
          {/* Option 1: Colors */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/60 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-primary" />
                <span>Option 1: Color Variants</span>
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {colorOptions.length} added
              </span>
            </div>

            {/* Chips list */}
            {colorOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {colorOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="py-1 px-3 rounded-lg bg-white text-on-surface text-xs font-medium flex items-center gap-2 shadow-xs border border-outline-variant/60"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-inner"
                      style={{ backgroundColor: opt.colorHex || '#1e293b' }}
                    />
                    <span>{opt.label}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveColor(opt.id)}
                      className="text-on-surface-variant cursor-pointer hover:text-red-600 transition-colors ml-1"
                      title="Remove color"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Inline Input Form */}
            <form onSubmit={handleAddColorSubmit} className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <div className="relative flex items-center">
                  <input
                    type="color"
                    value={colorHexInput}
                    onChange={(e) => setColorHexInput(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-outline-variant/60 p-0.5 bg-white shadow-xs"
                    title="Choose color shade"
                  />
                </div>
                <input
                  type="text"
                  value={colorNameInput}
                  onChange={(e) => setColorNameInput(e.target.value)}
                  placeholder="Type color name (e.g. Midnight Black)..."
                  className="h-9 px-3 rounded-lg bg-white text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 flex-1 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="h-9 px-3.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
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
                  className="px-2 py-0.5 rounded-full bg-white text-on-surface text-[11px] flex items-center gap-1 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/60 shadow-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: p.hex }}
                  />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 2: Care / Tier / Size */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/60 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Option 2: Care Plan / Warranty / Tier</span>
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {careOptions.length} added
              </span>
            </div>

            {/* Chips list */}
            {careOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {careOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="px-3 py-1 rounded-lg bg-white text-on-surface text-xs font-medium flex items-center gap-2 shadow-xs border border-outline-variant/60"
                  >
                    <span>{opt.label}</span>
                    {Boolean(opt.extraPrice && opt.extraPrice > 0) && (
                      <span className="text-primary font-mono text-xs font-semibold">
                        (+${opt.extraPrice})
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveCare(opt.id)}
                      className="text-on-surface-variant cursor-pointer hover:text-red-600 transition-colors ml-1"
                      title="Remove tier"
                    >
                      <X className="w-3 h-3" />
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
                className="h-9 px-3 rounded-lg bg-white text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 flex-1 min-w-[200px] shadow-xs"
              />

              <div className="flex items-center gap-1 bg-white rounded-lg border border-outline-variant/60 px-2.5 h-9 shadow-xs">
                <span className="text-on-surface-variant text-xs font-mono">+$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={careExtraInput}
                  onChange={(e) => setCareExtraInput(e.target.value)}
                  placeholder="Extra $"
                  className="w-16 bg-transparent text-on-surface font-mono text-xs focus:outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                className="h-9 px-3.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
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
                  className="px-2 py-0.5 rounded-full bg-white text-on-surface text-[11px] hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/60 shadow-xs"
                >
                  <span>{t.label}</span>
                  {t.extra > 0 && <span className="text-primary font-mono ml-0.5 font-semibold">+{t.extra}$</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Matrix Combinations Table */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                <Table className="w-4 h-4 text-primary" />
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
                    className="h-8 px-3 rounded-lg bg-white hover:bg-surface-container text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-outline-variant/60 shadow-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Load Recommended Template</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddCustomRow(!showAddCustomRow)}
                  className="h-8 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-outline-variant/60 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddCustomRow ? 'Hide Custom' : 'Add Custom Row'}</span>
                </button>
              </div>
            </div>

            {/* Custom variant inline addition form */}
            {showAddCustomRow && (
              <form
                onSubmit={handleAddCustomVariantSubmit}
                className="p-3 rounded-lg bg-surface-container-low border border-primary/30 flex flex-wrap items-center gap-2 animate-fade-in shadow-xs"
              >
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Variant Title (e.g. Special Edition Gold)..."
                  className="h-8 px-2.5 rounded bg-white text-on-surface text-xs border border-outline-variant/60 flex-1 min-w-[180px]"
                />
                <input
                  type="text"
                  value={customSku}
                  onChange={(e) => setCustomSku(e.target.value)}
                  placeholder="Custom SKU"
                  className="h-8 px-2 rounded bg-white font-mono text-on-surface text-xs border border-outline-variant/60 w-32"
                />
                <div className="flex items-center gap-1 bg-white rounded px-2 h-8 border border-outline-variant/60">
                  <span className="text-xs text-on-surface-variant">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-16 bg-transparent text-xs font-mono text-on-surface focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 bg-white rounded px-2 h-8 border border-outline-variant/60">
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
                  className="h-8 px-3 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  Save Row
                </button>
              </form>
            )}

            {/* Table or Empty State */}
            {variants.length > 0 ? (
              <div className="overflow-x-auto rounded-xl bg-white border border-outline-variant/60 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider border-b border-outline-variant/60">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-8">
                        <SlidersHorizontal className="w-3.5 h-3.5 mx-auto" />
                      </th>
                      <th className="py-2.5 px-3 min-w-[200px]">Variant</th>
                      <th className="py-2.5 px-3 min-w-[130px]">SKU</th>
                      <th className="py-2.5 px-3 min-w-[100px]">Price ($)</th>
                      <th className="py-2.5 px-3 min-w-[90px]">Stock</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {variants.map((v) => (
                      <tr
                        key={v.id}
                        className={`transition-colors ${
                          v.isActive
                            ? 'bg-white hover:bg-stone-50/80'
                            : 'bg-stone-50/50 opacity-60'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={v.isActive}
                            onChange={() => onToggleVariantActive(v.id)}
                            className="rounded cursor-pointer text-primary border-outline-variant/80 focus:ring-primary/30 w-4 h-4"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-on-surface flex items-center gap-2">
                          {v.colorHex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-xs"
                              style={{ backgroundColor: v.colorHex }}
                            />
                          )}
                          <span>{v.title}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-on-surface-variant">
                          {v.sku}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <div className="flex items-center gap-1 bg-surface-container-low rounded px-2 py-1 border border-outline-variant/60 w-24">
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
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) =>
                              onVariantStockChange(v.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="w-16 h-7 px-2 rounded bg-surface-container-low text-right font-mono border border-outline-variant/60 text-on-surface font-semibold focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              v.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            {v.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onRemoveVariant?.(v.id)}
                            className="p-1 rounded text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center">
                <Layers className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                <p className="text-sm font-semibold text-on-surface">
                  No variant combinations generated yet
                </p>
                <p className="text-xs text-on-surface-variant max-w-sm mt-1 mb-4">
                  Add color or care options above to automatically generate matrix combinations, or load the default template.
                </p>
                {onLoadPresetVariants && (
                  <button
                    type="button"
                    onClick={onLoadPresetVariants}
                    className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Wand2 className="w-4 h-4" />
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
