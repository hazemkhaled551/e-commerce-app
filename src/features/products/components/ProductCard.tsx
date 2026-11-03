import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types/product'

export interface ProductCardProps {
  product: Product
  actionType?: 'add-to-cart' | 'quick-view'
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export const ProductCard = memo(function ProductCard({
  product,
  actionType = 'add-to-cart',
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const navigate = useNavigate()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const {
    title,
    price,
    originalPrice,
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
        navigate(`/products/${product.id}`)
      }
    } else {
      onAddToCart?.(product)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1500)
    }
  }

  // Best seller style if rankTag is present or actionType is quick-view
  if (actionType === 'quick-view' || rankTag) {
    return (
      <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-[0_2px_12px_rgba(36,51,49,0.03)] hover:shadow-[0_8px_24px_rgba(36,51,49,0.08)] hover:-translate-y-1 hover:border-border-active/50 transition-all duration-300 flex flex-col group cursor-pointer"
      >
        <Link
          to={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="aspect-square bg-surface-container-low rounded-xl overflow-hidden relative mb-4 block"
        >
          <img
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            alt={title}
            src={image}
            loading="lazy"
          />
          {rankTag && (
            <span className="absolute top-3 left-3 bg-surface-container-lowest font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-on-surface">
              {rankTag}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
              isWishlisted ? 'text-error' : 'text-outline hover:text-error'
            }`}
            title="Wishlist"
          >
            <span className="material-symbols-outlined text-base">favorite</span>
          </button>
        </Link>
        <div className="flex items-center gap-1 text-xs mb-1">
          <span className="text-stock-low font-bold">★</span>
          <span className="font-bold text-on-surface">{rating.rate.toFixed(1)}</span>
          <span className="text-outline">({rating.count} reviews)</span>
        </div>
        <Link to={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
          <h3
            className="font-body-md text-body-md font-bold text-on-surface mb-1 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
            title={title}
          >
            {title}
          </h3>
        </Link>
        <span className="font-price-md text-price-md font-bold text-on-surface mb-3">
          ${price.toFixed(2)}
        </span>
        <Link
          to={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-auto w-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold py-2 rounded-xl transition-colors cursor-pointer text-center block"
        >
          View Details
        </Link>
      </div>
    )
  }

  // Featured highlight style
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-[0_2px_12px_rgba(36,51,49,0.03)] hover:shadow-[0_8px_24px_rgba(36,51,49,0.08)] hover:-translate-y-1 hover:border-border-active/50 transition-all duration-300 flex flex-col relative group cursor-pointer"
    >
      <Link
        to={`/products/${product.id}`}
        onClick={(e) => e.stopPropagation()}
        className="aspect-square bg-surface-container-low rounded-xl overflow-hidden relative mb-4 block"
      >
        <img
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          alt={title}
          src={image}
          loading="lazy"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
            isWishlisted ? 'text-error' : 'text-outline hover:text-error'
          }`}
          title="Wishlist"
        >
          <span className="material-symbols-outlined text-base">favorite</span>
        </button>
        {badge && (
          <span
            className={`absolute bottom-3 left-3 text-on-primary font-label-caps text-[10px] font-bold px-2 py-0.5 rounded-full ${
              badge === 'Limited' ? 'bg-stock-low' : 'bg-primary'
            }`}
          >
            {badge}
          </span>
        )}
      </Link>

      <div className="flex items-center justify-between text-body-sm mb-1">
        <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
          {category}
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-on-surface text-xs">
          <span className="text-stock-low">★</span> {rating.rate.toFixed(1)}{' '}
          <span className="text-outline font-normal">({rating.count.toLocaleString()})</span>
        </span>
      </div>

      <Link to={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
        <h3
          className="font-body-md text-body-md font-bold text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
          title={title}
        >
          {title}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-price-md text-price-md font-bold text-on-surface">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <span className="font-body-sm text-body-sm text-outline line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {stockLabel && (
          <span
            className={`ml-auto font-label-caps text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              stockStatus === 'low-stock'
                ? 'text-stock-low bg-stock-low-bg'
                : 'text-stock-in bg-stock-in-bg'
            }`}
          >
            {stockLabel}
          </span>
        )}
        {variantLabel && !stockLabel && (
          <span className="ml-auto font-label-caps text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            {variantLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleAction()
        }}
        className={`mt-auto w-full font-body-sm text-body-sm font-semibold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
          isAdded
            ? 'bg-stock-in text-on-primary'
            : 'bg-surface-container-high hover:bg-primary text-on-surface hover:text-on-primary'
        }`}
      >
        {isAdded ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  )
})
