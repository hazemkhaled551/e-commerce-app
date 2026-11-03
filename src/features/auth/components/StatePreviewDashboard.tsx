import { FlaskConical } from 'lucide-react'
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
    <div className="w-full max-w-3xl mt-8 bg-surface-container-lowest rounded-2xl shadow-xs p-5 flex flex-col gap-3 border border-outline-variant/60 text-left">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <FlaskConical className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-on-surface">
            State Preview Inspector
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wider uppercase">
          Interactive Harness
        </span>
      </div>
      <p className="text-xs text-on-surface-variant">
        Toggle production authentication edge states to audit visual feedback, error handling, session warnings, and security locks:
      </p>

      {/* State Toggle Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {states.map((st) => {
          const isActive = currentState === st.id
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectState(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
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
