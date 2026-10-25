export interface CategoryCardProps {
  title: string
  subtitle: string
  productCount: number
  imageUrl: string
  onClick?: () => void
}

export function CategoryCard({
  title,
  subtitle,
  productCount,
  imageUrl,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
    >
      {/* Category Image Stage */}
      <div className="aspect-[4/3] bg-surface-container-low overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Product Count Pill */}
        <span className="absolute top-3 right-3 bg-surface-container-lowest/90 px-2 py-0.5 rounded-full font-label-caps text-[10px] text-on-surface-variant font-semibold shadow-xs">
          {productCount} Products
        </span>
      </div>

      {/* Card Info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
          arrow_forward
        </span>
      </div>
    </div>
  )
}
