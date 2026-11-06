import {
  X,
  Layers,
  Sparkles,
  Edit2,
  PackagePlus,
} from 'lucide-react'
import type { CollectionItem } from '../../types/collection'

interface CollectionViewModalProps {
  isOpen: boolean
  onClose: () => void
  collection: CollectionItem | null
  onEdit: (collection: CollectionItem) => void
  onManageProducts: (collection: CollectionItem) => void
}

export function CollectionViewModal({
  isOpen,
  onClose,
  collection,
  onEdit,
  onManageProducts,
}: CollectionViewModalProps) {
  if (!isOpen || !collection) return null

  const createdDate = new Date(collection.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const updatedDate = new Date(collection.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Cover */}
        <div className="relative h-32 bg-surface-container overflow-hidden">
          {collection.imageUrl ? (
            <img
              src={collection.imageUrl}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              <Layers className="w-10 h-10 opacity-40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on cover */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-mono text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
              /collections/{collection.slug}
            </span>
            {collection.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-stone-900 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>SPOTLIGHT</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface">{collection.title}</h2>
              {collection.badgeText && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  {collection.badgeText}
                </span>
              )}
            </div>
            {collection.description && (
              <p className="text-on-surface-variant leading-relaxed text-xs mt-1.5">
                {collection.description}
              </p>
            )}
          </div>

          {/* Status & Placement Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">
                Status
              </span>
              <span className="text-xs font-bold capitalize text-on-surface mt-0.5 block">
                {collection.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">
                Placement
              </span>
              <span className="text-xs font-bold text-on-surface mt-0.5 block truncate">
                {collection.displayLocation}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">
                Curated SKUs
              </span>
              <span className="text-xs font-bold text-primary mt-0.5 block">
                {collection.productCount} Items
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Created On</span>
              <span className="text-on-surface">{createdDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Last Modified</span>
              <span className="text-on-surface">{updatedDate}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-outline-variant/60 text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                onManageProducts(collection)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/60 transition-all cursor-pointer"
            >
              <PackagePlus className="w-3.5 h-3.5 text-primary" />
              <span>Manage Products</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose()
                onEdit(collection)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
