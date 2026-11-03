import { useState } from 'react'
import {
  X,
  Star,
  CheckCircle2,
  Heart,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      {/* Dialog Box */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-outline-variant/60">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b border-outline-variant/60 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Storefront Buyer Simulation
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Nexa Web Experience
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column PDP */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visuals Column */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden bg-surface-container aspect-square shadow-sm border border-outline-variant/60">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-surface-container p-0.5 transition-all cursor-pointer border ${
                      selectedImageIndex === idx
                        ? 'ring-2 ring-primary border-transparent'
                        : 'border-outline-variant/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Column */}
          <div className="flex flex-col gap-4">
            <span className="text-xs text-primary font-bold tracking-wider uppercase">
              {formData.brand || 'NEXA STORE'}
            </span>

            <h3 className="text-2xl font-bold text-on-surface leading-tight">
              {formData.title || 'Untitled Product SKU'}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <span className="text-xs text-on-surface font-semibold">4.9</span>
              <span className="text-xs text-on-surface-variant">
                (128 verified reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 my-1">
              <span className="text-2xl font-bold text-on-surface">
                ${formData.basePrice.toFixed(2)}
              </span>
              {formData.comparePrice > formData.basePrice && (
                <span className="text-sm text-on-surface-variant line-through font-mono">
                  ${formData.comparePrice.toFixed(2)}
                </span>
              )}
              {discountAmount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  SAVE ${discountAmount}
                </span>
              )}
            </div>

            {/* PDP Highlights */}
            {formData.customerHighlights.length > 0 && (
              <div className="flex flex-col gap-1.5 p-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/60">
                {formData.customerHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Color variants selector */}
            {formData.colorOptions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-on-surface">
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
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.colorHex || '#1e293b' }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <div className="flex items-center gap-2.5 mt-2">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ${formData.basePrice.toFixed(2)}</span>
              </button>
              <button
                type="button"
                className="h-12 w-12 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-all cursor-pointer border border-outline-variant/60 shadow-xs"
              >
                <Heart className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-xs text-on-surface-variant mt-2 pt-3 border-t border-outline-variant/60">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" /> Free 2-Day Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> 30-Day Money Back
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
