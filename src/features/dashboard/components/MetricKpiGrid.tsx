import type { DashboardKpi } from '../types/dashboard'
import { KpiCard } from './KpiCard'

interface MetricKpiGridProps {
  kpis: DashboardKpi[]
  onActionClick?: (kpiId: string) => void
}

export function MetricKpiGrid({ kpis, onActionClick }: MetricKpiGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} onActionClick={onActionClick} />
      ))}
    </section>
  )
}

