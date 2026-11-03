import {
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react'
import type { OrderDetailFull } from '../../types/orderDetails'

interface RiskAssessmentCardProps {
  riskAssessment: OrderDetailFull['riskAssessment']
}

export function RiskAssessmentCard({
  riskAssessment,
}: RiskAssessmentCardProps) {
  const isLowRisk = riskAssessment.riskLevel === 'Low Risk'

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Risk &amp; Fraud Assessment</span>
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            isLowRisk
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {riskAssessment.riskLevel}
        </span>
      </div>

      {/* Checklist items */}
      <div className="flex flex-col gap-2 pt-1 text-xs">
        {riskAssessment.checks.map((chk) => (
          <div
            key={chk.id}
            className="flex items-center justify-between py-1 border-b border-outline-variant/30 last:border-b-0"
          >
            <span className="text-on-surface-variant">{chk.label}</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{chk.statusText}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Security Banner Alert */}
      <div className="mt-1 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
        {isLowRisk ? (
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
        )}
        <span className="leading-relaxed font-medium">
          {riskAssessment.securityPassMessage}
        </span>
      </div>
    </section>
  )
}

