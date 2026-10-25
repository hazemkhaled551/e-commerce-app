import { useState } from 'react'
import { Star, ShoppingBag, Plus, Minus } from 'lucide-react'
import type { Product } from '../types/product'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onClose()
    setQuantity(1)
  }

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} maxWidth="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Product Image Frame (DESIGN.md line 224: subtle neutral-slate background #F1F5F9) */}
        <div className="w-full h-64 sm:h-80 bg-neutral-slate rounded-lg p-6 flex items-center justify-center border border-border-divider">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <Badge variant="primary" className="capitalize">
                {product.category}
              </Badge>
              <div className="flex items-center text-stock-low text-xs font-semibold gap-1">
                <Star className="w-4 h-4 fill-stock-low text-stock-low" />
                <span className="tabular-nums">{product.rating.rate.toFixed(1)}</span>
                <span className="text-neutral-subdued font-normal">
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-neutral-core mb-2 leading-snug">
              {product.title}
            </h2>

            {/* Price with tabular numerals */}
            <div className="text-2xl font-black text-action-primary mb-4 tabular-nums">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-xs sm:text-sm text-neutral-subdued leading-relaxed mb-6 max-h-36 overflow-y-auto">
              {product.description}
            </p>
          </div>

          {/* Quantity Stepper (DESIGN.md line 238-240) + Add to Cart Button */}
          <div className="pt-4 border-t border-border-divider space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-core">Quantity</span>
              <div className="flex items-center border border-border-divider rounded-lg overflow-hidden bg-surface-card">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1.5 text-neutral-subdued hover:bg-neutral-slate hover:text-neutral-core transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-neutral-core min-w-8 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1.5 text-neutral-subdued hover:bg-neutral-slate hover:text-neutral-core transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              Add {quantity > 1 ? `${quantity} items` : ''} to Cart •{' '}
              <span className="tabular-nums">${(product.price * quantity).toFixed(2)}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
