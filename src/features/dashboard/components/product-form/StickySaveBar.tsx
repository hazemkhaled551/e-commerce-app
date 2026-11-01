interface StickySaveBarProps {
  isEditMode: boolean
  hasUnsavedChanges: boolean
  lastSavedText: string
  onSaveDraft: () => void
  onSave: () => void
  isSaving?: boolean
}

export function StickySaveBar({
  isEditMode,
  hasUnsavedChanges,
  lastSavedText,
  onSaveDraft,
  onSave,
  isSaving = false,
}: StickySaveBarProps) {
  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-surface-container-lowest/95 backdrop-blur-md px-space-lg py-space-xs shadow-lg z-30 flex items-center justify-between border-t border-outline-variant/20">
      <div className="flex items-center gap-space-sm">
        <span className="flex items-center gap-1.5 text-on-surface font-body-sm text-body-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              hasUnsavedChanges ? 'bg-secondary animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="font-semibold">
            {hasUnsavedChanges ? 'Unsaved edits' : 'All changes saved'}
          </span>
        </span>
        <span className="hidden md:inline font-body-sm text-body-sm text-on-surface-variant">
          {lastSavedText}
        </span>
      </div>

      <div className="flex items-center gap-space-xs">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="h-8 px-space-sm rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/20 disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-8 px-space-md rounded-lg bg-primary hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isEditMode ? 'cloud_done' : 'send'}
          </span>
          <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
        </button>
      </div>
    </div>
  )
}

