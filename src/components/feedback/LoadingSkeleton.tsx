export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-lg border border-border-divider p-4 animate-pulse flex flex-col h-full">
      <div className="w-full h-48 bg-neutral-slate rounded-lg mb-4" />
      <div className="h-4 bg-neutral-slate rounded-sm w-3/4 mb-2" />
      <div className="h-4 bg-neutral-slate rounded-sm w-1/2 mb-4" />
      <div className="mt-auto pt-3 border-t border-border-divider flex items-center justify-between">
        <div className="h-6 bg-neutral-slate rounded-sm w-16" />
        <div className="h-8 bg-neutral-slate rounded-lg w-20" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}
