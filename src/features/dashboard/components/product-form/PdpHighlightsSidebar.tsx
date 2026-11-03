import { Sparkles, CheckCircle2, X, Plus } from 'lucide-react'

interface PdpHighlightsSidebarProps {
  highlights: string[]
  allowPhotoReviews: boolean
  featureInSpotlight: boolean
  onAddHighlight: () => void
  onUpdateHighlight: (index: number, val: string) => void
  onRemoveHighlight: (index: number) => void
  onTogglePhotoReviews: (val: boolean) => void
  onToggleSpotlight: (val: boolean) => void
}

export function PdpHighlightsSidebar({
  highlights,
  allowPhotoReviews,
  featureInSpotlight,
  onAddHighlight,
  onUpdateHighlight,
  onRemoveHighlight,
  onTogglePhotoReviews,
  onToggleSpotlight,
}: PdpHighlightsSidebarProps) {
  return (
    <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/60">
      <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">PDP Customer Highlights</h2>
      </div>
      <p className="text-xs text-on-surface-variant">
        Displayed as high-impact bullet badges under the Add to Cart trigger.
      </p>

      <div className="flex flex-col gap-2">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-surface-container-low p-2 rounded-lg border border-outline-variant/60 shadow-xs"
          >
            <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdateHighlight(idx, e.target.value)}
              className="flex-1 bg-transparent text-on-surface text-xs focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={() => onRemoveHighlight(idx)}
              className="text-on-surface-variant hover:text-red-600 cursor-pointer p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddHighlight}
          className="mt-1 h-9 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-outline-variant/60 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add PDP Highlight</span>
        </button>
      </div>

      {/* Review Settings */}
      <div className="pt-2 border-t border-outline-variant/60 flex flex-col gap-2.5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={allowPhotoReviews}
            onChange={(e) => onTogglePhotoReviews(e.target.checked)}
            className="rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4"
          />
          <span className="text-xs text-on-surface group-hover:text-primary transition-colors">
            Allow verified buyer photo reviews
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={featureInSpotlight}
            onChange={(e) => onToggleSpotlight(e.target.checked)}
            className="rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4"
          />
          <span className="text-xs text-on-surface group-hover:text-primary transition-colors">
            Feature in Homepage customer spotlight
          </span>
        </label>
      </div>
    </section>
  )
}
