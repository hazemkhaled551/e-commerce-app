import type { AuthPreviewState } from '../types/auth'

export interface StatePreviewDashboardProps {
  currentState: AuthPreviewState
  onSelectState: (state: AuthPreviewState) => void
}

export function StatePreviewDashboard({
  currentState,
  onSelectState,
}: StatePreviewDashboardProps) {
  const states: { id: AuthPreviewState; label: string }[] = [
    { id: 'default', label: 'Default Clean' },
    { id: 'validation_error', label: 'Form Validation Error' },
    { id: 'unverified', label: 'Account Not Verified' },
    { id: 'rate_limited', label: 'Rate Limited (15m lock)' },
    { id: 'expired', label: 'Expired Session' },
  ]

  return (
    <div className="w-full max-w-3xl mt-space-2xl bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex flex-col gap-space-sm border border-outline-variant/30 text-left">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            science
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface">
            State Preview Inspector
          </span>
        </div>
        <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
          INTERACTIVE DEMO HARNESS
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Toggle production authentication edge states to audit visual feedback, error handling, session warnings, and security locks:
      </p>

      {/* State Toggle Buttons */}
      <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
        {states.map((st) => {
          const isActive = currentState === st.id
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectState(st.id)}
              className={`px-space-sm py-1.5 rounded-lg font-body-sm text-body-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-surface-container-high text-on-surface font-semibold shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
