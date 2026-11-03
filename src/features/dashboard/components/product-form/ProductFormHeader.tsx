import {
  X,
  Bookmark,
  Eye,
  Check,
  Send,
} from 'lucide-react'
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
    <div className="sticky top-16 z-30 -mx-6 px-6 py-3.5 bg-white/95 backdrop-blur-md shadow-xs mb-8 border-b border-outline-variant/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-on-surface truncate max-w-lg">
            {isEditMode ? (title || 'Edit Product') : 'Add New Product'}
          </h1>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 border ${
              productStatus === 'published'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                productStatus === 'published' ? 'bg-emerald-500' : 'bg-stone-400'
              }`}
            />
            {productStatus === 'published' ? 'Active • Published' : 'Draft • Not visible'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onDiscard}
            className="h-9 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/60 shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="h-9 px-3.5 rounded-lg bg-white hover:bg-surface-container text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer border border-outline-variant/60 disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Save Draft</span>
            <kbd className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
              ⌘S
            </kbd>
          </button>

          <button
            type="button"
            onClick={onPreviewPdp}
            className="h-9 px-3.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-primary/20 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview PDP</span>
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isSaving}
            className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isEditMode ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isEditMode ? 'Save Changes' : 'Publish to Store'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
