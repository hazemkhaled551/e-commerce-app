export interface CollectionItem {
  id: string
  title: string
  subtitle: string
  productCount: number
  imageUrl: string
  tag?: string
}

export interface CuratedCollectionsGridProps {
  collections: CollectionItem[]
  onSelectCategory: (categoryId: string) => void
}

export function CuratedCollectionsGrid({
  collections,
  onSelectCategory,
}: CuratedCollectionsGridProps) {
  if (!collections || collections.length === 0) return null

  // We feature the first item prominently as an editorial feature card
  const primaryItem = collections[0]
  const secondaryItem = collections[1]
  const otherItems = collections.slice(2)

  const handleSelect = (id: string) => {
    onSelectCategory(id)
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full" id="collections">
      {/* Section Header with Editorial Clarity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-outline-variant/60">
        <div className="max-w-xl">
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            Curated Spaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
            Collections Engineered for Living
          </h2>
          <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Thoughtfully grouped hardware, acoustics, and objects designed to complement modern environments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSelect('all')}
          className="text-primary hover:text-secondary text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-end"
        >
          <span>View Complete Catalog</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Feature Stage (Span 7) */}
        {primaryItem && (
          <div
            onClick={() => handleSelect(primaryItem.id)}
            className="lg:col-span-7 group relative bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/60 shadow-[0_4px_20px_rgba(36,51,49,0.03)] hover:shadow-[0_12px_32px_rgba(36,51,49,0.08)] hover:border-primary/40 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[380px] sm:min-h-[440px]"
          >
            {/* Background Image with Cinematic Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={primaryItem.imageUrl}
                alt={primaryItem.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
            </div>

            {/* Top Tag & Count */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
              <span className="bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-outline-variant/40 shadow-sm">
                Featured Pillar
              </span>
              <span className="bg-neutral-900/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/90 border border-white/10">
                {primaryItem.productCount} Items
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-col items-start gap-3 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-primary-fixed transition-colors">
                {primaryItem.title}
              </h3>
              <p className="text-sm text-white/80 max-w-lg leading-relaxed">
                {primaryItem.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-primary-fixed group-hover:underline">
                <span>Explore Collection</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right Column Stack (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {secondaryItem && (
            <div
              onClick={() => handleSelect(secondaryItem.id)}
              className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/60 shadow-[0_4px_20px_rgba(36,51,49,0.03)] hover:shadow-[0_12px_32px_rgba(36,51,49,0.08)] hover:border-primary/40 transition-all duration-500 cursor-pointer flex-1 min-h-[200px] sm:min-h-[220px] flex flex-col justify-end"
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={secondaryItem.imageUrl}
                  alt={secondaryItem.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-transparent" />
              </div>
              <div className="relative z-10 p-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-xs font-semibold text-primary-fixed uppercase tracking-wider block mb-1">
                    {secondaryItem.productCount} Products
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-fixed transition-colors">
                    {secondaryItem.title}
                  </h3>
                  <p className="text-xs text-white/75 mt-0.5 max-w-xs truncate">
                    {secondaryItem.subtitle}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-primary backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          )}

          {otherItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/60 shadow-[0_2px_12px_rgba(36,51,49,0.03)] hover:shadow-[0_8px_24px_rgba(36,51,49,0.08)] hover:border-primary/40 transition-all duration-300 cursor-pointer min-h-[160px] flex flex-col justify-end"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />
                  </div>
                  <div className="relative z-10 p-4 text-white">
                    <span className="text-[11px] font-medium text-white/75 block">
                      {item.productCount} Items
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-primary-fixed transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

