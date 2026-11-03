import { useState } from 'react'
import type { Product } from '../types/product'

export interface FlagshipSpotlightProps {
  product?: Product
  onAddToCart?: (product: Product, quantity?: number) => void
  onQuickView?: (product: Product) => void
}

export function FlagshipSpotlight({
  product,
  onAddToCart,
  onQuickView,
}: FlagshipSpotlightProps) {
  const [isAdded, setIsAdded] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    onAddToCart?.(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-[0_8px_30px_rgba(36,51,49,0.04)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Visual Column / Studio Stage (Span 6) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-low p-8 sm:p-12 lg:p-16 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-outline-variant/50">
            {/* Subtle radial ambient highlight */}
            <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Spec Floating Pill */}
            <div className="absolute top-6 left-6 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-outline-variant/50 text-xs font-semibold text-primary shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
              <span>Industrial Spotlight</span>
            </div>

            {/* Product Image */}
            <div className="relative z-10 w-full max-w-md aspect-square flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
                onClick={() => onQuickView?.(product)}
              />
            </div>

            {/* Micro Tag Bottom Right */}
            <div className="absolute bottom-6 right-6 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-lg border border-outline-variant/50 text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-stock-in">verified</span>
              <span>In Stock • Ready to Dispatch</span>
            </div>
          </div>

          {/* Editorial & Technical Column (Span 6) */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col items-start gap-5">
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-surface-container-high px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-on-surface">
                <span className="text-stock-low">★</span>
                <span>{product.rating.rate.toFixed(1)}</span>
                <span className="text-on-surface-variant font-normal">
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            {/* Headline & Narrative */}
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
                {product.title}
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant mt-2.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Three Material / Engineering Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <span className="text-xs font-bold text-on-surface block">Acoustic Core</span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                  42dB Hybrid active noise isolation
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <span className="text-xs font-bold text-on-surface block">Endurance</span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                  60-Hour playback reserve
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <span className="text-xs font-bold text-on-surface block">Chassis</span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                  Anodized aerospace aluminum
                </span>
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="flex flex-wrap items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-on-surface">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-outline line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-stock-in bg-stock-in-bg px-2 py-0.5 rounded-full">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 sm:flex-initial bg-primary hover:bg-secondary text-on-primary font-semibold text-sm px-7 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {isAdded ? 'check' : 'shopping_bag'}
                </span>
                <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickView?.(product)}
                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-sm px-5 py-3.5 rounded-xl border border-outline-variant/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Specifications</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

