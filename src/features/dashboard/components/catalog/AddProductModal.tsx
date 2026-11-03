import { useState } from 'react'
import { X, PlusCircle, AlertCircle } from 'lucide-react'
import type { CatalogProduct, ProductStatus, ProductStockState } from '../../types/catalog'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: CatalogProduct) => void
}

function generateDefaultSku(): string {
  return `SKU-${Math.floor(10000 + Math.random() * 90000)}`
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [name, setName] = useState('')
  const [variantLabel, setVariantLabel] = useState('Standard Edition')
  const [category, setCategory] = useState('Electronics & Audio')
  const [brand, setBrand] = useState('AeroSound')
  const [sku, setSku] = useState(generateDefaultSku)
  const [price, setPrice] = useState('199.00')
  const [costPrice, setCostPrice] = useState('89.00')
  const [stockCount, setStockCount] = useState('50')
  const [status, setStatus] = useState<ProductStatus>('published')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Product name is required.')
      return
    }

    const numPrice = parseFloat(price) || 0
    const numCost = parseFloat(costPrice) || 0
    const numStock = parseInt(stockCount, 10) || 0

    let stockState: ProductStockState = 'in_stock'
    if (numStock === 0) stockState = 'out_of_stock'
    else if (numStock <= 5) stockState = 'critical_low'
    else if (numStock <= 20) stockState = 'low_stock'

    const marginPercent = numPrice > 0 ? Math.round(((numPrice - numCost) / numPrice) * 100) : 0

    const newProduct: CatalogProduct = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      variantLabel: variantLabel.trim() || 'Standard Edition',
      sku: sku.trim() || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      upc: `084920${Math.floor(100000 + Math.random() * 900000)}`,
      category,
      brand,
      stockCount: numStock,
      stockState,
      stockPercentage: Math.min(100, Math.max(10, Math.round((numStock / 100) * 100))),
      stockNote: numStock === 0 ? 'Out of stock' : numStock < 10 ? 'Low warehouse reserve' : 'Optimal fulfillment level',
      price: numPrice,
      costPrice: numCost,
      marginPercent,
      status,
      unitsSold30d: 0,
      revenue30dText: '$0.00',
      lastUpdatedDate: 'Just now',
      lastUpdatedBy: 'Admin User',
    }

    onAddProduct(newProduct)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/60 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in text-left">
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant/50 flex items-center justify-between bg-surface-container-low/60">
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Add New Product SKU
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Configure master SKU metadata, pricing margins, and warehouse allocation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-error/10 text-error border border-error/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="e.g. AeroSound ANC Pro"
                required
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Variant Label
              </label>
              <input
                type="text"
                value={variantLabel}
                onChange={(e) => setVariantLabel(e.target.value)}
                placeholder="e.g. Midnight Black / 64GB"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="Electronics & Audio">Electronics &amp; Audio</option>
                <option value="Kitchen & Culinary">Kitchen &amp; Culinary</option>
                <option value="Home & Office">Home &amp; Office</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="AeroSound">AeroSound</option>
                <option value="DeskPower">DeskPower</option>
                <option value="Cast & Clay">Cast &amp; Clay</option>
                <option value="Nordic Minimalist">Nordic Minimalist</option>
              </select>
            </div>
          </div>

          {/* SKU & Initial Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Master SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-..."
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 font-mono text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Pricing & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Retail Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface font-mono text-xs border border-outline-variant/60 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Cost Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low/70 text-on-surface font-mono text-xs border border-outline-variant/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Publishing Status */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1.5">
              Publish Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="accent-primary"
                />
                <span className="text-on-surface">Publish Immediately</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-primary"
                />
                <span className="text-on-surface">Save as Draft</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-outline-variant/50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
