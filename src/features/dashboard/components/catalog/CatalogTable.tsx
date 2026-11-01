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
          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
            In Stock
          </span>
        )
      case 'low_stock':
        return (
          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
            Low Stock
          </span>
        )
      case 'critical_low':
        return (
          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
            Critical Low
          </span>
        )
      case 'out_of_stock':
        return (
          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold">
            Out of Stock
          </span>
        )
    }
  }

  const renderStatusBadge = (status: CatalogProduct['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Published
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Draft
          </span>
        )
      case 'unpublished':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Unpublished
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            Archived
          </span>
        )
    }
  }

  return (
    <div className="w-full rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col border border-outline-variant/15">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider select-none">
              <th className="py-space-md px-space-md w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-primary-container focus:ring-primary-container cursor-pointer"
                />
              </th>
              <th className="py-space-md px-space-md min-w-[320px]">Product Info &amp; Variants</th>
              <th className="py-space-md px-space-md min-w-[140px]">Category</th>
              <th className="py-space-md px-space-md min-w-[180px]">Inventory &amp; Stock</th>
              <th className="py-space-md px-space-md min-w-[170px]">Price &amp; Margin</th>
              <th className="py-space-md px-space-md min-w-[130px]">Status</th>
              <th className="py-space-md px-space-md min-w-[130px]">30d Velocity</th>
              <th className="py-space-md px-space-md min-w-[160px]">Last Updated</th>
              <th className="py-space-md px-space-md w-28 text-right pr-space-md">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id)
              const isArchived = product.status === 'archived'

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-surface-container-low/60 transition-colors ${
                    isArchived
                      ? 'bg-surface-container-lowest opacity-75'
                      : isSelected
                      ? 'bg-surface-container-low/40'
                      : 'bg-surface-container-lowest'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-space-md px-space-md text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(product.id)}
                      className="w-4 h-4 rounded text-primary-container focus:ring-primary-container cursor-pointer"
                    />
                  </td>

                  {/* Product Info & Variants */}
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-low overflow-hidden shrink-0 shadow-xs flex items-center justify-center border border-outline-variant/10">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[24px] text-on-surface-variant">
                            inventory_2
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <button
                            type="button"
                            onClick={() => onViewProduct(product)}
                            className="font-body-md text-body-md font-semibold text-on-surface truncate hover:text-primary cursor-pointer text-left"
                          >
                            {product.name}
                          </button>
                          <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                            {product.variantLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-space-xs mt-0.5">
                          <span className="font-mono text-[11px] font-semibold text-on-surface-variant">
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
                  <td className="py-space-md px-space-md font-medium text-on-surface-variant">
                    {product.category}
                  </td>

                  {/* Inventory & Stock */}
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            product.stockState === 'critical_low' || product.stockState === 'low_stock'
                              ? 'text-error'
                              : 'text-on-surface'
                          }`}
                        >
                          {product.stockCount > 0 ? `${product.stockCount} units` : '0 units'}
                        </span>
                        {renderStockBadge(product.stockState)}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.stockState === 'critical_low' || product.stockState === 'low_stock'
                              ? 'bg-error'
                              : product.stockPercentage > 0
                              ? 'bg-primary-container'
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
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-price-md text-price-md text-on-surface font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-on-surface-variant line-through text-[12px]">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        Cost: ${product.costPrice.toFixed(2)}{' '}
                        {product.marginPercent > 0 && (
                          <span className="text-secondary font-semibold">
                            ({product.marginPercent}% margin)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-space-md px-space-md">{renderStatusBadge(product.status)}</td>

                  {/* 30d Velocity */}
                  <td className="py-space-md px-space-md">
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
                        <span className="text-on-surface-variant font-body-sm">—</span>
                      )}
                    </div>
                  </td>

                  {/* Last Updated */}
                  <td className="py-space-md px-space-md">
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
                  <td className="py-space-md px-space-md text-right pr-space-md">
                    <div className="flex items-center justify-end gap-1 text-on-surface-variant">
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="w-8 h-8 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewProduct(product)}
                        className="w-8 h-8 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-all cursor-pointer"
                        title="View Catalog Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>

                      {isArchived ? (
                        <button
                          type="button"
                          onClick={() => onUnarchiveProduct?.(product)}
                          className="w-8 h-8 rounded-lg hover:bg-surface-container hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                          title="Restore / Unarchive"
                        >
                          <span className="material-symbols-outlined text-[18px]">unarchive</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-all cursor-pointer"
                          title="More Options"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
      <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md select-none border-t border-outline-variant/15">
        <div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm flex-wrap">
          <span>
            Showing <strong className="text-on-surface font-semibold">1 to {products.length}</strong> of{' '}
            <strong className="text-on-surface font-semibold">428</strong> products
          </span>
          <div className="h-4 w-px bg-surface-container-highest hidden sm:block" />
          <div className="flex items-center gap-space-xs">
            <span>Rows per page:</span>
            <select className="h-8 pl-2 pr-6 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs focus:outline-none border border-outline-variant/20 cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed flex items-center justify-center shadow-xs border border-outline-variant/15"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-bold flex items-center justify-center shadow-sm cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-semibold flex items-center justify-center shadow-xs transition-all cursor-pointer border border-outline-variant/15"
          >
            2
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-semibold flex items-center justify-center shadow-xs transition-all cursor-pointer border border-outline-variant/15"
          >
            3
          </button>
          <span className="px-1 text-on-surface-variant text-[12px]">...</span>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-semibold flex items-center justify-center shadow-xs transition-all cursor-pointer border border-outline-variant/15"
          >
            43
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center shadow-xs transition-all cursor-pointer border border-outline-variant/15"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}

