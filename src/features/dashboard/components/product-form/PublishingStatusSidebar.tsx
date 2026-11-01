import type { ProductStatus } from '../../types/catalog'
import type { ProductFormData } from '../../types/productForm'

interface PublishingStatusSidebarProps {
  productStatus: ProductStatus
  cornerRibbon: ProductFormData['cornerRibbon']
  onStatusChange: (status: ProductStatus) => void
  onRibbonChange: (ribbon: ProductFormData['cornerRibbon']) => void
}

export function PublishingStatusSidebar({
  productStatus,
  cornerRibbon,
  onStatusChange,
  onRibbonChange,
}: PublishingStatusSidebarProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Publishing Status</h2>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            productStatus === 'published' ? 'bg-secondary' : 'bg-outline'
          }`}
        />
      </div>

      {/* Product State */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
          Product State
        </label>
        <select
          value={productStatus}
          onChange={(e) => onStatusChange(e.target.value as ProductStatus)}
          className="w-full h-10 px-space-sm rounded-lg bg-surface-container text-on-surface font-body-md text-body-md font-semibold focus:outline-none border border-outline-variant/20 cursor-pointer"
        >
          <option value="draft">Draft (Invisible to buyers)</option>
          <option value="published">Active / Published</option>
          <option value="unpublished">Unpublished</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Storefront Corner Ribbon */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
          Storefront Corner Ribbon
        </label>
        <div className="flex items-center gap-space-xs">
          <select
            value={cornerRibbon}
            onChange={(e) => onRibbonChange(e.target.value as ProductFormData['cornerRibbon'])}
            className="w-full h-9 px-space-xs rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none border border-outline-variant/20 cursor-pointer font-medium"
          >
            <option value="BESTSELLER">BESTSELLER</option>
            <option value="NEW ARRIVAL">NEW ARRIVAL</option>
            <option value="20% OFF">20% OFF</option>
            <option value="STAFF PICK">STAFF PICK</option>
            <option value="None">None</option>
          </select>

          {cornerRibbon !== 'None' && (
            <span className="px-2 py-1 rounded bg-secondary text-on-secondary font-label-caps text-label-caps font-bold shrink-0 shadow-xs">
              {cornerRibbon}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
