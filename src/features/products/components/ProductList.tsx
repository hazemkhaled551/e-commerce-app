import type { Product } from '../types/product'
import type { AsyncStatus } from '@/types/common'
import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/feedback/LoadingSkeleton'
import { ErrorMessage } from '@/components/feedback/ErrorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/Button'

export interface ProductListProps {
  products: Product[]
  status: AsyncStatus
  error: string | null
  onQuickView: (product: Product) => void
  onAddToCart: (product: Product) => void
  onRetry: () => void
  onClearFilters: () => void
}

export function ProductList({
  products,
  status,
  error,
  onQuickView,
  onAddToCart,
  onRetry,
  onClearFilters,
}: ProductListProps) {
  if (status === 'loading') {
    return <ProductGridSkeleton count={8} />
  }

  if (status === 'failed' && error) {
    return (
      <ErrorMessage
        title="Failed to Load Products"
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="We couldn't find any items matching your selected criteria. Try adjusting your search query or category filter."
        action={
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Reset Filters
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
