import { useState } from 'react'
import type { ProductFormData } from '../../types/productForm'

interface PdpPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  formData: ProductFormData
}

export function PdpPreviewModal({ isOpen, onClose, formData }: PdpPreviewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(
    formData.colorOptions[0]?.label || 'Standard'
  )

  if (!isOpen) return null

  const images =
    formData.mediaItems.length > 0
      ? formData.mediaItems
      : [
          {
            id: 'placeholder',
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            alt: formData.title || 'Product Preview',
            isPrimary: true,
          },
        ]

  const currentImage = images[selectedImageIndex] || images[0]

  const discountAmount =
    formData.comparePrice > formData.basePrice
      ? Math.round(formData.comparePrice - formData.basePrice)
      : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-xs p-4 animate-fade-in">
      {/* Dialog Box */}
      <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-outline-variant/30">
        {/* Modal Header */}
        <div className="sticky top-0 bg-surface-container-lowest px-space-md py-space-sm flex items-center justify-between border-b border-surface-container z-10">
          <div className="flex items-center gap-space-xs">
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-semibold">
              Storefront Buyer Simulation
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Nexa Web Experience
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body: Two Column PDP */}
        <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Visuals Column */}
          <div className="flex flex-col gap-space-sm">
            <div className="rounded-xl overflow-hidden bg-surface-container aspect-square shadow-xs border border-outline-variant/20">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-space-xs flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden bg-surface-container p-0.5 transition-all cursor-pointer border ${
                      selectedImageIndex === idx
                        ? 'ring-2 ring-primary border-transparent'
                        : 'border-outline-variant/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Column */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-caps text-label-caps text-secondary font-bold tracking-wider uppercase">
              {formData.brand || 'NEXA STORE'}
            </span>

            <h3 className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
              {formData.title || 'Untitled Product SKU'}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-space-xs">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="material-symbols-outlined text-[16px]">star_half</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">4.9</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                (128 verified reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-space-xs my-1">
              <span className="font-price-lg text-price-lg text-on-surface font-bold">
                ${formData.basePrice.toFixed(2)}
              </span>
              {formData.comparePrice > formData.basePrice && (
                <span className="font-body-md text-body-md text-on-surface-variant line-through">
                  ${formData.comparePrice.toFixed(2)}
                </span>
              )}
              {discountAmount > 0 && (
                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold">
                  SAVE ${discountAmount}
                </span>
              )}
            </div>

            {/* PDP Highlights */}
            {formData.customerHighlights.length > 0 && (
              <div className="flex flex-col gap-1 p-space-xs bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/15">
                {formData.customerHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      check_circle
                    </span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Color variants selector */}
            {formData.colorOptions.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Color: {selectedColor}
                </span>
                <div className="flex items-center gap-2">
                  {formData.colorOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.label)}
                      className={`w-7 h-7 rounded-full border cursor-pointer transition-transform ${
                        selectedColor === c.label
                          ? 'ring-2 ring-primary ring-offset-2 scale-105'
                          : 'border-outline-variant/40 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.colorHex || '#1e293b' }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <div className="flex items-center gap-space-xs mt-space-sm">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-secondary text-on-primary font-body-md text-body-md font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add to Cart • ${formData.basePrice.toFixed(2)}</span>
              </button>
              <button
                type="button"
                className="h-12 w-12 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[20px]">favorite_border</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-space-md text-[11px] text-on-surface-variant mt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span> Free
                2-Day Delivery
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified_user</span> 30-Day
                Money Back
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

