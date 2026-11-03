import {
  Star,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import type { CustomerProfile } from '../../types/orderDetails'

interface CustomerProfileCardProps {
  customer: CustomerProfile
  onViewHistory: () => void
}

export function CustomerProfileCard({
  customer,
  onViewHistory,
}: CustomerProfileCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Customer Profile
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
          <span>{customer.tier}</span>
        </span>
      </div>

      {/* Customer Avatar & Lifetime Metrics */}
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
            customer.avatarBg || 'bg-primary text-on-primary'
          }`}
        >
          {customer.initials}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-base font-bold text-on-surface truncate">
            {customer.name}
          </h3>
          <span className="text-xs text-on-surface-variant">
            {customer.lifetimeOrders} Lifetime Orders • ${customer.lifetimeValue.toFixed(2)} LTV
          </span>
        </div>
      </div>

      {/* Contact Details List */}
      <div className="flex flex-col gap-2 pt-1 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-outline-variant/40">
          <span className="text-on-surface-variant flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Email:</span>
          </span>
          <a
            href={`mailto:${customer.email}`}
            className="font-semibold text-primary hover:underline truncate max-w-[170px]"
          >
            {customer.email}
          </a>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-outline-variant/40">
          <span className="text-on-surface-variant flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Phone:</span>
          </span>
          <a
            href={`tel:${customer.phone}`}
            className="font-semibold text-on-surface hover:text-primary transition-colors font-mono"
          >
            {customer.phone}
          </a>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-on-surface-variant flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Identity:</span>
          </span>
          <span className="font-semibold text-emerald-700">
            {customer.isVerified ? 'Verified Buyer' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* View Full Customer History Button */}
      <button
        type="button"
        onClick={onViewHistory}
        className="w-full h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary hover:text-primary-hover font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
      >
        <span>View Full Customer History</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </section>
  )
}

