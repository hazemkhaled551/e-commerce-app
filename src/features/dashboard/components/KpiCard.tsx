import type { DashboardKpi } from '../types/dashboard'

interface KpiCardProps {
  kpi: DashboardKpi
  onActionClick?: (kpiId: string) => void
}

export function KpiCard({ kpi, onActionClick }: KpiCardProps) {
  return (
    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          {kpi.title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            kpi.type === 'action_dispatch'
              ? 'bg-error-container text-on-error-container'
              : 'bg-surface-container-low ' + kpi.iconColorClass
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
        </div>
      </div>

      {/* Primary Metric Value & Subtext */}
      <div className="mt-space-md">
        <div className="flex items-baseline gap-space-sm">
          <span className="font-price-lg text-price-lg text-on-surface">{kpi.value}</span>
        </div>

        <div className="flex items-center justify-between mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span className={kpi.type === 'action_dispatch' ? 'font-medium text-error' : ''}>
            {kpi.subtextPrimary}
          </span>
          {kpi.subtextSecondary && (
            <span
              className={
                kpi.type === 'progress_aov'
                  ? 'text-secondary font-medium'
                  : 'text-outline-variant'
              }
            >
              {kpi.subtextSecondary}
            </span>
          )}
        </div>
      </div>

      {/* Visual Graphical Additions (Sparkline, Progress, Action Button) */}
      <div className="mt-space-sm pt-space-xs">
        {kpi.type === 'sparkline_revenue' && (
          <svg className="w-full h-7 text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 200 32">
            <path
              d="M0 24 L20 22 L40 26 L60 18 L80 20 L100 12 L120 15 L140 8 L160 11 L180 4 L200 2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0 24 L20 22 L40 26 L60 18 L80 20 L100 12 L120 15 L140 8 L160 11 L180 4 L200 2 L200 32 L0 32 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        )}

        {kpi.type === 'sparkline_orders' && (
          <svg className="w-full h-7 text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 200 32">
            <path
              d="M0 26 L25 24 L50 20 L75 22 L100 16 L125 18 L150 10 L175 14 L200 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0 26 L25 24 L50 20 L75 22 L100 16 L125 18 L150 10 L175 14 L200 6 L200 32 L0 32 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        )}

        {kpi.type === 'progress_aov' && (
          <div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
              <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] text-on-surface-variant font-label-caps">
              <span>Tier 1 ($50)</span>
              <span className="text-on-surface font-semibold">Tier 2: $70+ Max</span>
            </div>
          </div>
        )}

        {kpi.type === 'action_dispatch' && (
          <button
            type="button"
            onClick={() => onActionClick?.(kpi.id)}
            className="w-full py-1.5 px-space-sm bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg font-label-caps text-label-caps font-semibold text-center transition-colors cursor-pointer"
          >
            {kpi.actionLabel || 'Open Queue'}
          </button>
        )}
      </div>
    </div>
  )
}

