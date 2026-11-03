import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types/product'

export interface ProductCardProps {
  product: Product
  actionType?: 'add-to-cart' | 'quick-view'
  viewMode?: 'grid' | 'detailed'
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export const ProductCard = memo(function ProductCard({
  product,
  actionType = 'add-to-cart',
  viewMode = 'grid',
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const navigate = useNavigate()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const {
    id,
    title,
    price,
    originalPrice,
    description,
    category,
    image,
    rating,
    badge,
    stockLabel,
    stockStatus,
    variantLabel,
    rankTag,
  } = product

  const handleAction = () => {
    if (actionType === 'quick-view') {
      if (onQuickView) {
        onQuickView(product)
      } else {
        navigate(`/products/${id}`)
      }
    } else {
      onAddToCart?.(product)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1500)
    }
  }

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  // Detailed Horizontal Card View
  if (viewMode === 'detailed') {
    return (
      <div
        onClick={() => navigate(`/products/${id}`)}
        className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-[0_4px_20px_rgba(36,51,49,0.03)] hover:shadow-[0_12px_32px_rgba(36,51,49,0.08)] hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 group cursor-pointer"
      >
        {/* Image Stage */}
        <div className="w-full sm:w-48 aspect-square bg-surface-container-low rounded-xl overflow-hidden relative shrink-0 p-4 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {badge && (
            <span className="absolute top-2.5 left-2.5 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              {badge}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
              isWishlisted ? 'text-stock-out' : 'text-outline hover:text-stock-out'
            }`}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Content Info */}
        <div className="flex-1 flex flex-col justify-between w-full h-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-on-surface">
                <span className="text-stock-low">★</span>
                <span>{rating.rate.toFixed(1)}</span>
                <span className="text-on-surface-variant font-normal">
                  ({rating.count.toLocaleString()})
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-1.5 leading-snug">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/40">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-on-surface">
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-outline line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              {discountPercent && (
                <span className="text-[11px] font-bold text-stock-in bg-stock-in-bg px-2 py-0.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction()
                }}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isAdded
                    ? 'bg-stock-in text-on-primary'
                    : 'bg-primary hover:bg-secondary text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isAdded ? 'check' : 'shopping_bag'}
                </span>
                <span>{isAdded ? 'Added ✓' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard Grid Card View
  return (
    <div
      onClick={() => navigate(`/products/${id}`)}
      className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-[0_4px_20px_rgba(36,51,49,0.03)] hover:shadow-[0_12px_32px_rgba(36,51,49,0.08)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer relative"
    >
      {/* Product Image Stage */}
      <Link
        to={`/products/${id}`}
        onClick={(e) => e.stopPropagation()}
        className="aspect-square bg-surface-container-low rounded-xl overflow-hidden relative mb-4 p-4 flex items-center justify-center block"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Left Rank or Collection Badge */}
        {rankTag && (
          <span className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs text-on-surface">
            {rankTag}
          </span>
        )}
        {!rankTag && badge && (
          <span
            className={`absolute top-3 left-3 font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${
              badge.toLowerCase().includes('limited')
                ? 'bg-stock-low text-on-primary'
                : 'bg-primary text-on-primary'
            }`}
          >
            {badge}
          </span>
        )}

        {/* Top Right Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur flex items-center justify-center shadow-xs transition-all hover:scale-110 cursor-pointer ${
            isWishlisted ? 'text-stock-out' : 'text-outline hover:text-stock-out'
          }`}
          title="Wishlist"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </Link>

      {/* Category Eyebrow & Star Rating */}
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-outline truncate max-w-[130px]">
          {category}
        </span>
        <div className="inline-flex items-center gap-1 font-bold text-on-surface text-xs">
          <span className="text-stock-low">★</span>
          <span>{rating.rate.toFixed(1)}</span>
          <span className="text-outline font-normal">({rating.count.toLocaleString()})</span>
        </div>
      </div>

      {/* Product Title */}
      <Link to={`/products/${id}`} onClick={(e) => e.stopPropagation()}>
        <h3
          className="font-body-md text-sm font-bold text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
          title={title}
        >
          {title}
        </h3>
      </Link>

      {/* Price & Stock Status Row */}
      <div className="flex items-center gap-2 mb-3 mt-auto">
        <span className="text-base font-bold text-on-surface">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <span className="text-xs text-outline line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {stockLabel && (
          <span
            className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              stockStatus === 'low-stock'
                ? 'text-stock-low bg-stock-low-bg border border-stock-low/30'
                : 'text-stock-in bg-stock-in-bg border border-stock-in/30'
            }`}
          >
            {stockLabel}
          </span>
        )}
        {variantLabel && !stockLabel && (
          <span className="ml-auto text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/50">
            {variantLabel}
          </span>
        )}
      </div>

      {/* Action CTA Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleAction()
        }}
        className={`w-full font-body-sm text-xs font-semibold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
          isAdded
            ? 'bg-stock-in text-on-primary'
            : actionType === 'quick-view'
            ? 'bg-surface-container-low hover:bg-surface-container-high text-on-surface hover:text-primary border border-outline-variant/60'
            : 'bg-primary hover:bg-secondary text-on-primary'
        }`}
      >
        <span className="material-symbols-outlined text-sm">
          {isAdded ? 'check' : actionType === 'quick-view' ? 'visibility' : 'shopping_bag'}
        </span>
        <span>
          {isAdded ? 'Added ✓' : actionType === 'quick-view' ? 'View Details' : 'Add to Cart'}
        </span>
      </button>
    </div>
  )
})
