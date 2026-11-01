import { Link } from 'react-router-dom'
import type { ProductStatus } from '../../types/catalog'

interface ProductFormHeaderProps {
  isEditMode: boolean
  title: string
  productStatus: ProductStatus
  onDiscard: () => void
  onSaveDraft: () => void
  onPreviewPdp: () => void
  onPublish: () => void
  isSaving?: boolean
}

export function ProductFormHeader({
  isEditMode,
  title,
  productStatus,
  onDiscard,
  onSaveDraft,
  onPreviewPdp,
  onPublish,
  isSaving = false,
}: ProductFormHeaderProps) {
  return (
    <div className="sticky top-16 z-30 -mx-space-lg px-space-lg py-space-sm bg-surface-container-lowest/95 backdrop-blur-md shadow-sm mb-space-lg border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Catalog
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/admin/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">
              {isEditMode ? 'Edit Product' : 'New Product'}
            </span>
          </div>

          <div className="flex items-center gap-space-sm mt-0.5">
            <h1 className="font-headline-md text-headline-md text-on-surface truncate max-w-lg">
              {isEditMode ? (title || 'Edit Product') : 'Add New Product'}
            </h1>
            <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps flex items-center gap-1 shrink-0">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  productStatus === 'published' ? 'bg-secondary' : 'bg-outline'
                }`}
              />
              {productStatus === 'published' ? 'Active • Published' : 'Draft • Not visible'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            type="button"
            onClick={onDiscard}
            className="h-9 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="h-9 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1 shadow-sm cursor-pointer border border-outline-variant/20 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
            <span>Save Draft</span>
            <kbd className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
              ⌘S
            </kbd>
          </button>

          <button
            type="button"
            onClick={onPreviewPdp}
            className="h-9 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span className="hidden sm:inline">Preview PDP</span>
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isSaving}
            className="h-9 px-space-md rounded-lg bg-primary hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold transition-all flex items-center gap-space-xs shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditMode ? 'cloud_done' : 'send'}
            </span>
            <span>{isEditMode ? 'Save Changes' : 'Publish to Store'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

