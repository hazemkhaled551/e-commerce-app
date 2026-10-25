import { memo } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import type { CartItem } from '../types/cart'

export interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export const CartItemRow = memo(function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-divider last:border-b-0">
      {/* Product Image Stage (DESIGN.md line 242: 64px x 64px with neutral-slate frame) */}
      <div className="w-16 h-16 rounded-lg bg-neutral-slate border border-border-divider p-2 flex items-center justify-center shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-neutral-core truncate" title={product.title}>
          {product.title}
        </h4>
        <p className="text-xs text-neutral-subdued capitalize mt-0.5">{product.category}</p>
        <div className="text-xs font-bold text-neutral-core mt-1 tabular-nums">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Quantity Stepper & Line Total (DESIGN.md line 238-242: tabular numbers) */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center border border-border-divider rounded-lg overflow-hidden bg-surface-card">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            aria-label="Decrease quantity"
            className="p-1 text-neutral-subdued hover:bg-neutral-slate hover:text-neutral-core transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 text-xs font-bold text-neutral-core min-w-5 text-center tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            aria-label="Increase quantity"
            className="p-1 text-neutral-subdued hover:bg-neutral-slate hover:text-neutral-core transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label="Remove item"
          className="text-neutral-subdued hover:text-stock-out transition-colors cursor-pointer p-0.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
})
