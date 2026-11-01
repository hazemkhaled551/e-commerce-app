import type { ProductFormData } from '../../types/productForm'

interface ReadinessAuditSidebarProps {
  formData: ProductFormData
}

export function ReadinessAuditSidebar({ formData }: ReadinessAuditSidebarProps) {
  // Compute readiness score dynamically
  let score = 0
  const hasCover = formData.mediaItems.length > 0
  const hasSkuAndStock = Boolean(formData.sku) && (formData.stockCount > 0 || (formData.warehouses?.reduce((acc, curr) => acc + (curr.available || 0), 0) ?? 0) > 0)
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
    <section className="bg-surface-container-low rounded-xl p-space-md shadow-xs flex flex-col gap-space-xs border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
          <span className="font-body-sm text-body-sm font-bold text-on-surface">
            Publishing Readiness
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-primary">{score}% Ready</span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden my-1">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="flex flex-col gap-1 text-[12px] text-on-surface-variant mt-1">
        <li
          className={`flex items-center gap-1.5 ${
            hasCover ? 'text-secondary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {hasCover ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>Primary cover asset attached</span>
        </li>

        <li
          className={`flex items-center gap-1.5 ${
            hasSkuAndStock ? 'text-secondary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {hasSkuAndStock ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>SKU &amp; inventory allocated</span>
        </li>

        <li
          className={`flex items-center gap-1.5 ${
            hasPricing ? 'text-secondary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {hasPricing ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>Pricing margins &amp; taxes configured</span>
        </li>

        {!hasMultiplePhotos && (
          <li className="flex items-center gap-1.5 text-error mt-0.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>Recommendation: Add 2+ lifestyle photos for optimal conversion</span>
          </li>
        )}
      </ul>
    </section>
  )
}

