import {
  CheckCircle2,
  FileEdit,
  Check,
  ShieldCheck,
  MapPin,
} from 'lucide-react'
import type { ShippingDetails } from '../../types/orderDetails'

interface OrderAddressesCardProps {
  shippingAddress: ShippingDetails
  billingMatchesShipping: boolean
  onEditAddress: () => void
  onValidateUSPS: () => void
}

export function OrderAddressesCard({
  shippingAddress,
  billingMatchesShipping,
  onEditAddress,
  onValidateUSPS,
}: OrderAddressesCardProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Shipping Destination Card */}
      <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Shipping Destination</span>
          </span>
          {shippingAddress.dpvConfirmed && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>USPS DPV Confirmed</span>
            </span>
          )}
        </div>

        {/* Address Lines */}
        <div className="flex flex-col gap-0.5 text-xs text-on-surface leading-relaxed">
          <strong className="font-bold text-sm text-on-surface">
            {shippingAddress.recipientName}
          </strong>
          <span>{shippingAddress.street}</span>
          <span>{shippingAddress.cityStateZip}</span>
          <span className="text-on-surface-variant font-medium">
            {shippingAddress.country}
          </span>
        </div>

        {/* Driver Delivery Note Callout */}
        {shippingAddress.driverNote && (
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col gap-1 mt-1">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase flex items-center gap-1">
              <FileEdit className="w-3 h-3 text-amber-600" />
              <span>Driver Delivery Note</span>
            </span>
            <p className="text-xs text-on-surface italic">
              &ldquo;{shippingAddress.driverNote}&rdquo;
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/40">
          <button
            type="button"
            onClick={onEditAddress}
            className="flex-1 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
          >
            Edit Address
          </button>
          <button
            type="button"
            onClick={onValidateUSPS}
            className="flex-1 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validate with USPS</span>
          </button>
        </div>
      </section>

      {/* 2. Billing Address Card */}
      <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Billing Address
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            Matches Shipping
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs text-on-surface">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            {billingMatchesShipping
              ? 'Same as shipping address (verified with issuing card bank).'
              : 'Separate billing address provided.'}
          </span>
        </div>
      </section>
    </div>
  )
}

