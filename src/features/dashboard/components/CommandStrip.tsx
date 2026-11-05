import type { DateRangeFilter } from '../types/dashboard'
import { DATE_RANGE_OPTIONS } from '../data/mockDashboardData'
import { DateRangePicker } from './DateRangePicker'

interface CommandStripProps {
  currentRange?: DateRangeFilter
  onDateRangeChange?: (filter: DateRangeFilter) => void
}

export function CommandStrip({
  currentRange = DATE_RANGE_OPTIONS[2], // default: 30d
  onDateRangeChange,
}: CommandStripProps) {
  return (
    <section className="py-4 flex flex-col gap-4">
      {/* Top Title Strip & Action Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Real-time store performance, order fulfillment velocity, and critical inventory alerts across all channels.
          </p>
        </div>

        {/* Dynamic & Interactive Date Range Picker */}
        <DateRangePicker value={currentRange} onChange={onDateRangeChange} />
      </div>
    </section>
  )
}
