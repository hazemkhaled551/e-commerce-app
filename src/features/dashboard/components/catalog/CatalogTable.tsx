import {
  Edit3,
  Eye,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import type { CatalogProduct } from '../../types/catalog'

interface CatalogTableProps {
  products: CatalogProduct[]
  selectedIds: string[]
  onToggleSelect: (productId: string) => void
  onToggleSelectAll: () => void
  onEditProduct: (product: CatalogProduct) => void
  onViewProduct: (product: CatalogProduct) => void
  onUnarchiveProduct?: (product: CatalogProduct) => void
}

export function CatalogTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditProduct,
  onViewProduct,
  onUnarchiveProduct,
}: CatalogTableProps) {
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id))

  const renderStockBadge = (stockState: CatalogProduct['stockState']) => {
    switch (stockState) {
      case 'in_stock':
        return (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
            In Stock
          </span>
        )
      case 'low_stock':
        return (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700">
            Low Stock
          </span>
        )
      case 'critical_low':
        return (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
            Critical
          </span>
        )
      case 'out_of_stock':
        return (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            Out of Stock
          </span>
        )
    }
  }

  const renderStatusBadge = (status: CatalogProduct['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface text-[11px] font-semibold border border-outline-variant/60">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Draft
          </span>
        )
      case 'unpublished':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Unpublished
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            Archived
          </span>
        )
    }
  }

  return (
    <div className="w-full rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(36,51,49,0.03)] overflow-hidden flex flex-col border border-outline-variant/60">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider select-none border-b border-outline-variant/60">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                />
              </th>
              <th className="py-3 px-4 min-w-[280px]">Product &amp; SKU</th>
              <th className="py-3 px-4 min-w-[130px]">Category</th>
              <th className="py-3 px-4 min-w-[170px]">Inventory &amp; Stock</th>
              <th className="py-3 px-4 min-w-[160px]">Price &amp; Margin</th>
              <th className="py-3 px-4 min-w-[120px]">Status</th>
              <th className="py-3 px-4 min-w-[120px]">30d Sales</th>
              <th className="py-3 px-4 min-w-[140px]">Last Updated</th>
              <th className="py-3 px-4 w-24 text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/40 text-xs text-on-surface">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id)
              const isArchived = product.status === 'archived'

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-surface-container-low/50 transition-colors ${
                    isArchived
                      ? 'bg-surface-container-lowest opacity-75'
                      : isSelected
                      ? 'bg-primary/5'
                      : 'bg-surface-container-lowest'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(product.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                    />
                  </td>

                  {/* Product Info & Variants */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low overflow-hidden shrink-0 shadow-xs flex items-center justify-center border border-outline-variant/40">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-outline" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onViewProduct(product)}
                            className="text-xs font-bold text-on-surface truncate hover:text-primary cursor-pointer text-left"
                          >
                            {product.name}
                          </button>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-medium">
                            {product.variantLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[11px] font-semibold text-primary">
                            SKU: {product.sku}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span className="text-on-surface-variant text-[11px]">
                            UPC {product.upc}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 font-medium text-on-surface-variant">
                    {product.category}
                  </td>

                  {/* Inventory & Stock */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            product.stockState === 'critical_low' || product.stockState === 'low_stock'
                              ? 'text-rose-600'
                              : 'text-on-surface'
                          }`}
                        >
                          {product.stockCount > 0 ? `${product.stockCount} units` : '0 units'}
                        </span>
                        {renderStockBadge(product.stockState)}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-low overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.stockState === 'critical_low' || product.stockState === 'low_stock'
                              ? 'bg-rose-500'
                              : product.stockPercentage > 0
                              ? 'bg-primary'
                              : 'bg-outline-variant'
                          }`}
                          style={{ width: `${product.stockPercentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {product.stockNote}
                      </span>
                    </div>
                  </td>

                  {/* Price & Margin */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-sm text-on-surface font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-on-surface-variant line-through text-[11px] font-mono">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        Cost: ${product.costPrice.toFixed(2)}{' '}
                        {product.marginPercent > 0 && (
                          <span className="text-emerald-600 font-semibold">
                            ({product.marginPercent}% margin)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">{renderStatusBadge(product.status)}</td>

                  {/* 30d Velocity */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      {product.unitsSold30d > 0 ? (
                        <>
                          <span className="font-semibold text-on-surface">
                            {product.unitsSold30d} sold
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {product.revenue30dText}
                          </span>
                        </>
                      ) : (
                        <span className="text-outline">—</span>
                      )}
                    </div>
                  </td>

                  {/* Last Updated */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-on-surface font-medium">
                        {product.lastUpdatedDate}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        by {product.lastUpdatedBy}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right pr-4">
                    <div className="flex items-center justify-end gap-1 text-on-surface-variant">
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewProduct(product)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                        title="View Catalog Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isArchived ? (
                        <button
                          type="button"
                          onClick={() => onUnarchiveProduct?.(product)}
                          className="w-7 h-7 rounded-lg hover:bg-surface-container hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                          title="Restore / Unarchive"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-all cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination Controls */}
      <div className="p-3.5 bg-surface-container-low/70 flex flex-col sm:flex-row items-center justify-between gap-3 select-none border-t border-outline-variant/60 text-xs text-on-surface-variant">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Showing <strong className="text-on-surface font-semibold">1 to {products.length}</strong> of{' '}
            <strong className="text-on-surface font-semibold">428</strong> products
          </span>
          <div className="h-3.5 w-px bg-outline-variant/60 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <select className="h-7 pl-2 pr-6 rounded-lg bg-surface-container-lowest text-on-surface font-semibold focus:outline-none border border-outline-variant/60 cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-outline opacity-40 cursor-not-allowed flex items-center justify-center border border-outline-variant/50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center shadow-xs cursor-pointer text-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium flex items-center justify-center transition-all cursor-pointer border border-outline-variant/50 text-xs"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium flex items-center justify-center transition-all cursor-pointer border border-outline-variant/50 text-xs"
          >
            3
          </button>
          <span className="px-1 text-outline">...</span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-medium flex items-center justify-center transition-all cursor-pointer border border-outline-variant/50 text-xs"
          >
            43
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center transition-all cursor-pointer border border-outline-variant/50"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
