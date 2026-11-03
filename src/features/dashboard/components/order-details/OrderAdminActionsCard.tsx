import {
  RotateCcw,
  DollarSign,
  PauseCircle,
  ChevronRight,
  PlayCircle,
} from 'lucide-react'

interface OrderAdminActionsCardProps {
  isOnHold: boolean
  onInitiateReturn: () => void
  onIssuePartialRefund: () => void
  onToggleHold: () => void
}

export function OrderAdminActionsCard({
  isOnHold,
  onInitiateReturn,
  onIssuePartialRefund,
  onToggleHold,
}: OrderAdminActionsCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/50 pb-3">
        Administrative Overrides
      </span>

      <div className="flex flex-col gap-2 pt-1">
        {/* Action 1: Return / Exchange */}
        <button
          type="button"
          onClick={onInitiateReturn}
          className="w-full h-10 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-xs text-on-surface flex items-center justify-between px-3.5 transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            <span>Initiate Return / Exchange</span>
          </span>
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>

        {/* Action 2: Partial Refund */}
        <button
          type="button"
          onClick={onIssuePartialRefund}
          className="w-full h-10 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-xs text-on-surface flex items-center justify-between px-3.5 transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
        >
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span>Issue Partial Refund</span>
          </span>
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>

        {/* Action 3: Hold / Resume Processing */}
        <button
          type="button"
          onClick={onToggleHold}
          className={`w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-between px-3.5 transition-all border cursor-pointer shadow-xs active:scale-95 ${
            isOnHold
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              : 'bg-surface-container hover:bg-amber-50 text-on-surface hover:text-amber-900 border-outline-variant/60 hover:border-amber-300'
          }`}
        >
          <span className="flex items-center gap-2">
            {isOnHold ? (
              <PlayCircle className="w-4 h-4 text-amber-700" />
            ) : (
              <PauseCircle className="w-4 h-4 text-amber-700" />
            )}
            <span>{isOnHold ? 'Resume Fulfillment Processing' : 'Hold Fulfillment Processing'}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </button>
      </div>
    </section>
  )
}

