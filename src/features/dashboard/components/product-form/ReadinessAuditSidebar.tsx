import { CheckSquare, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import type { ProductFormData } from '../../types/productForm'

interface ReadinessAuditSidebarProps {
  formData: ProductFormData
}

export function ReadinessAuditSidebar({ formData }: ReadinessAuditSidebarProps) {
  // Compute readiness score dynamically
  let score = 0
  const hasCover = formData.mediaItems.length > 0
  const hasSkuAndStock =
    Boolean(formData.sku) &&
    (formData.stockCount > 0 ||
      (formData.warehouses?.reduce((acc, curr) => acc + (curr.available || 0), 0) ?? 0) > 0)
  const hasTitleAndSubtitle = Boolean(formData.title.trim()) && Boolean(formData.subtitle.trim())
  const hasPricing = formData.basePrice > 0 && formData.costPrice > 0
  const hasTags = formData.tags.length > 0

  if (hasCover) score += 25
  if (hasSkuAndStock) score += 25
  if (hasTitleAndSubtitle) score += 20
  if (hasPricing) score += 20
  if (hasTags) score += 10

  const hasMultiplePhotos = formData.mediaItems.length >= 3

  return (
    <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-on-surface">
            Publishing Readiness
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          {score}% Ready
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-outline-variant/40">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="flex flex-col gap-2 text-xs text-on-surface-variant mt-1">
        <li
          className={`flex items-center gap-2 ${
            hasCover ? 'text-emerald-700 font-medium' : 'text-on-surface-variant'
          }`}
        >
          {hasCover ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
          )}
          <span>Primary cover asset attached</span>
        </li>

        <li
          className={`flex items-center gap-2 ${
            hasSkuAndStock ? 'text-emerald-700 font-medium' : 'text-on-surface-variant'
          }`}
        >
          {hasSkuAndStock ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
          )}
          <span>SKU &amp; inventory allocated</span>
        </li>

        <li
          className={`flex items-center gap-2 ${
            hasPricing ? 'text-emerald-700 font-medium' : 'text-on-surface-variant'
          }`}
        >
          {hasPricing ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
          )}
          <span>Pricing margins &amp; taxes configured</span>
        </li>

        {!hasMultiplePhotos && (
          <li className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-1">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Recommendation: Add 2+ lifestyle photos for optimal conversion</span>
          </li>
        )}
      </ul>
    </section>
  )
}
