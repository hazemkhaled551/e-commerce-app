import { Check, Send } from 'lucide-react'

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
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/95 backdrop-blur-md px-6 py-3 shadow-lg z-30 flex items-center justify-between border-t border-outline-variant/60">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-on-surface text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="font-semibold text-sm">
            {hasUnsavedChanges ? 'Unsaved edits' : 'All changes saved'}
          </span>
        </span>
        <span className="hidden md:inline text-xs text-on-surface-variant font-mono">
          {lastSavedText}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="h-9 px-4 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/60 disabled:opacity-50 shadow-xs"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isEditMode ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
        </button>
      </div>
    </div>
  )
}
