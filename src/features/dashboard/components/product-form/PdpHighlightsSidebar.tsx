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
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">PDP Customer Highlights</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Displayed as high-impact bullet badges under the Add to Cart trigger.
      </p>

      <div className="flex flex-col gap-1.5">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-lg border border-outline-variant/15"
          >
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
              verified
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdateHighlight(idx, e.target.value)}
              className="flex-1 bg-transparent text-on-surface font-body-sm text-body-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onRemoveHighlight(idx)}
              className="text-on-surface-variant hover:text-error cursor-pointer p-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddHighlight}
          className="mt-1 h-8 px-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border border-outline-variant/20"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add PDP Highlight</span>
        </button>
      </div>

      {/* Review Settings */}
      <div className="pt-space-xs flex flex-col gap-2">
        <label className="flex items-center gap-space-xs cursor-pointer">
          <input
            type="checkbox"
            checked={allowPhotoReviews}
            onChange={(e) => onTogglePhotoReviews(e.target.checked)}
            className="rounded text-primary cursor-pointer"
          />
          <span className="font-body-sm text-body-sm text-on-surface">
            Allow verified buyer photo reviews
          </span>
        </label>

        <label className="flex items-center gap-space-xs cursor-pointer">
          <input
            type="checkbox"
            checked={featureInSpotlight}
            onChange={(e) => onToggleSpotlight(e.target.checked)}
            className="rounded text-primary cursor-pointer"
          />
          <span className="font-body-sm text-body-sm text-on-surface">
            Feature in Homepage customer spotlight
          </span>
        </label>
      </div>
    </section>
  )
}

