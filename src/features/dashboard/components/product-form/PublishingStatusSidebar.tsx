import { ShieldCheck } from 'lucide-react'
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
    <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Publishing Status</h2>
        </div>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            productStatus === 'published' ? 'bg-emerald-500' : 'bg-stone-300'
          }`}
        />
      </div>

      {/* Product State */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Product State
        </label>
        <select
          value={productStatus}
          onChange={(e) => onStatusChange(e.target.value as ProductStatus)}
          className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
        >
          <option value="draft">Draft (Invisible to buyers)</option>
          <option value="published">Active / Published</option>
          <option value="unpublished">Unpublished</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Storefront Corner Ribbon */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Storefront Corner Ribbon
        </label>
        <div className="flex items-center gap-2">
          <select
            value={cornerRibbon}
            onChange={(e) => onRibbonChange(e.target.value as ProductFormData['cornerRibbon'])}
            className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium shadow-xs"
          >
            <option value="BESTSELLER">BESTSELLER</option>
            <option value="NEW ARRIVAL">NEW ARRIVAL</option>
            <option value="20% OFF">20% OFF</option>
            <option value="STAFF PICK">STAFF PICK</option>
            <option value="None">None</option>
          </select>

          {cornerRibbon !== 'None' && (
            <span className="px-2.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shrink-0 shadow-xs">
              {cornerRibbon}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
