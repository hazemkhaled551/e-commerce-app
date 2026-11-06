import { useState, useMemo, useEffect } from 'react'
import {
  X,
  Search,
  Check,
  Package,
  Layers,
  Save,
  Loader2,
  Filter,
} from 'lucide-react'
import type { CollectionItem, CollectionProductAction } from '../../types/collection'
import type { CatalogProduct } from '../../types/catalog'
import { getAdminProducts } from '../../api/adminProductApi'
import { FALLBACK_PRODUCTS } from '@/features/products/api/productApi'

interface CollectionProductsModalProps {
  isOpen: boolean
  onClose: () => void
  collection: CollectionItem | null
  onSave: (
    collectionId: string,
    action: CollectionProductAction,
    productIds: string[]
  ) => Promise<void> | void
}

function getFallbackCatalogProducts(): CatalogProduct[] {
  return FALLBACK_PRODUCTS.map((p) => ({
    id: String(p.id),
    name: p.title,
    variantLabel: p.variantLabel || 'Standard',
    sku: `SKU-${p.id}`,
    upc: `UPC-${p.id}`,
    category: p.category || 'General',
    brand: 'Nexa Hardware',
    stockCount: p.stockStatus === 'low-stock' ? 2 : 25,
    stockState: p.stockStatus === 'low-stock' ? ('low_stock' as const) : ('in_stock' as const),
    stockPercentage: p.stockStatus === 'low-stock' ? 10 : 85,
    stockNote: p.stockLabel || 'In stock',
    price: p.price,
    originalPrice: p.originalPrice,
    costPrice: Math.round(p.price * 0.6),
    marginPercent: 40,
    status: 'published' as const,
    unitsSold30d: 12,
    revenue30dText: `$${(p.price * 12).toFixed(0)}`,
    lastUpdatedDate: 'Recently',
    lastUpdatedBy: 'Admin',
    imageUrl: p.image,
  }))
}

export function CollectionProductsModal({
  isOpen,
  onClose,
  collection,
  onSave,
}: CollectionProductsModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tabFilter, setTabFilter] = useState<'all' | 'assigned' | 'unassigned'>('all')
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Reset state when collection changes or modal opens
  useEffect(() => {
    if (isOpen && collection) {
      setSelectedIds(collection.productIds || [])
      setSearchTerm('')
      setTabFilter('all')
    }
  }, [isOpen, collection?.id])

  // Load available products when modal opens
  useEffect(() => {
    if (!isOpen) return

    let isCancelled = false
    setIsLoadingProducts(true)

    async function load() {
      try {
        const result = await getAdminProducts({ limit: 100 })
        if (!isCancelled) {
          setProducts(
            result.products && result.products.length > 0
              ? result.products
              : getFallbackCatalogProducts()
          )
        }
      } catch {
        if (!isCancelled) {
          setProducts(getFallbackCatalogProducts())
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProducts(false)
        }
      }
    }

    load()
    return () => {
      isCancelled = true
    }
  }, [isOpen])

  const filteredProducts = useMemo(() => {
    if (!isOpen) return []
    const q = searchTerm.trim().toLowerCase()
    return products.filter((p) => {
      const isAssigned = selectedIds.includes(p.id)
      if (tabFilter === 'assigned' && !isAssigned) return false
      if (tabFilter === 'unassigned' && isAssigned) return false
      if (q) {
        const ok = p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        if (!ok) return false
      }
      return true
    })
  }, [products, selectedIds, searchTerm, tabFilter, isOpen])

  const handleToggleProduct = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAllVisible = () => {
    const visibleIds = filteredProducts.map((p) => p.id)
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
  }

  const handleDeselectAllVisible = () => {
    const visibleIds = new Set(filteredProducts.map((p) => p.id))
    setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)))
  }

  const handleSave = async () => {
    if (!collection) return
    setIsSaving(true)
    try {
      await onSave(collection.id, 'set', selectedIds)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !collection) return null

  const initialCount = collection.productIds?.length ?? collection.productCount ?? 0
  const diffCount = selectedIds.length - initialCount

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-on-surface">
                  Manage Collection Products
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  {selectedIds.length} Selected
                </span>
                {diffCount !== 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    diffCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {diffCount > 0 ? `+${diffCount} added` : `${diffCount} removed`}
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                <span className="font-semibold text-on-surface">{collection.title}</span>
                <span className="font-mono text-[10px] text-outline ml-1">
                  (/{collection.slug})
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-outline-variant/50 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-on-surface-variant/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, SKU, or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-outline-variant/60 bg-surface-container-low/50 text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-[10px]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-surface-container-low border border-outline-variant/50 self-start sm:self-auto">
            {(['all', 'assigned', 'unassigned'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTabFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                  tabFilter === tab
                    ? 'bg-white text-on-surface font-bold shadow-2xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'all' && `All (${products.length})`}
                {tab === 'assigned' && `Assigned (${selectedIds.length})`}
                {tab === 'unassigned' && `Unassigned (${Math.max(0, products.length - selectedIds.length)})`}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk helpers */}
        <div className="px-6 py-2 bg-surface-container-low/30 border-b border-outline-variant/40 flex items-center justify-between text-[11px] text-on-surface-variant shrink-0">
          <span>Showing {filteredProducts.length} products</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleSelectAllVisible} className="hover:text-primary font-medium cursor-pointer">
              Select All Visible
            </button>
            <span>•</span>
            <button type="button" onClick={handleDeselectAllVisible} className="hover:text-primary font-medium cursor-pointer">
              Deselect Visible
            </button>
            {selectedIds.length > 0 && (
              <>
                <span>•</span>
                <button type="button" onClick={() => setSelectedIds([])} className="text-red-600 hover:text-red-700 font-medium cursor-pointer">
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/40 min-h-[280px]">
          {isLoadingProducts ? (
            <div className="py-16 flex flex-col items-center justify-center text-on-surface-variant gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading catalog products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
                <Filter className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-xs font-bold text-on-surface">No Products Found</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5 max-w-xs">
                Try adjusting the search or switching tabs.
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isSelected = selectedIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  onClick={() => handleToggleProduct(p.id)}
                  className={`px-6 py-3 flex items-center justify-between gap-4 cursor-pointer transition-colors hover:bg-surface-container-low/60 ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary text-white'
                          : 'border-outline-variant/80 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/60 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <Package className="w-5 h-5 text-on-surface-variant/40" />
                      )}
                    </div>

                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-bold text-on-surface truncate">{p.name}</span>
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
                        <span className="font-mono text-[10px] px-1.5 rounded bg-surface-container">{p.sku}</span>
                        <span>•</span>
                        <span>{p.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-on-surface block">${p.price.toFixed(2)}</span>
                      <span className="text-[10px] text-on-surface-variant block">{p.stockCount} in stock</span>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Assigned
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleToggleProduct(p.id) }}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium">
                          Excluded
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleToggleProduct(p.id) }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-on-surface-variant">
            Total: <strong className="text-on-surface">{selectedIds.length}</strong> products
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-white border border-outline-variant/60 text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {diffCount > 0
                      ? `Save & Add ${diffCount} Product${diffCount !== 1 ? 's' : ''}`
                      : diffCount < 0
                        ? `Save (${Math.abs(diffCount)} removed)`
                        : 'Save Collection Products'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
