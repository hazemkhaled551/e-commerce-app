import {
  X,
  Building2,
  Globe,
  ExternalLink,
  Edit2,
  Mail,
} from 'lucide-react'
import type { BrandItem } from '../../types/brand'

interface BrandViewModalProps {
  isOpen: boolean
  onClose: () => void
  brand: BrandItem | null
  onEdit: (brand: BrandItem) => void
}

export function BrandViewModal({
  isOpen,
  onClose,
  brand,
  onEdit,
}: BrandViewModalProps) {
  if (!isOpen || !brand) return null

  const createdDate = new Date(brand.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const updatedDate = new Date(brand.updatedAt).toLocaleDateString('en-US', {
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
        {/* Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/60 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-white border border-outline-variant/60 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-7 h-7 text-on-surface-variant/40" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-on-surface">{brand.name}</h2>
                {brand.isInternal && (
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                    IN-HOUSE
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-on-surface-variant">
                /brands/{brand.slug}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          {/* Status & Catalog Stats */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">
                Status
              </span>
              <span className="text-xs font-bold capitalize text-on-surface mt-0.5 block">
                {brand.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">
                Catalog Coverage
              </span>
              <span className="text-xs font-bold text-primary mt-0.5 block">
                {brand.productCount} Active SKUs
              </span>
            </div>
          </div>

          {/* Description */}
          {brand.description && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline block mb-1">
                About Manufacturer
              </span>
              <p className="text-on-surface leading-relaxed text-xs">
                {brand.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
            {brand.websiteUrl && (
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </span>
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>{brand.websiteUrl.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {brand.country && (
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Origin</span>
                <span className="font-semibold text-on-surface">{brand.country}</span>
              </div>
            )}

            {brand.contactEmail && (
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Support Email</span>
                </span>
                <span className="font-mono text-on-surface">{brand.contactEmail}</span>
              </div>
            )}

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
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-outline-variant/60 text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(brand)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
