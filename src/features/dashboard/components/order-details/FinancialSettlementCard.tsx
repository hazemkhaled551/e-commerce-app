import {
  CreditCard,
  Wallet,
  CheckCircle2,
  Tag,
  ExternalLink,
} from 'lucide-react'
import type { OrderDetailFull } from '../../types/orderDetails'

interface FinancialSettlementCardProps {
  financials: OrderDetailFull['financials']
  paymentAudit: OrderDetailFull['paymentAudit']
  onRefundClick: () => void
  onViewLogs: () => void
}

export function FinancialSettlementCard({
  financials,
  paymentAudit,
  onRefundClick,
  onViewLogs,
}: FinancialSettlementCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 sm:p-6 flex flex-col gap-5 mb-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <Wallet className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Financial Settlement &amp; Breakdown
            </h2>
            <p className="text-xs text-on-surface-variant">
              Validated server settlement with verified clearing gateway
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Fully Captured
        </span>
      </div>

      {/* Grid: Summary Lines (Left) vs Transaction Audit (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Left: Summary Lines */}
        <div className="flex flex-col gap-2.5 bg-surface-container-low/70 p-4 rounded-xl border border-outline-variant/50 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Items Subtotal</span>
              <span className="font-mono font-semibold text-on-surface">
                ${financials.itemsSubtotal.toFixed(2)}
              </span>
            </div>

            {financials.couponCode && (
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon {financials.couponCode}</span>
                </span>
                <span className="font-mono font-semibold">
                  -${(financials.couponDiscount || 0).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>{financials.shippingName}</span>
              <span className="font-mono font-semibold text-emerald-700">
                {financials.shippingCost === 0 ? 'Free ($0.00)' : `$${financials.shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Estimated Sales Tax ({financials.taxPercentText})</span>
              <span className="font-mono font-semibold text-on-surface">
                ${financials.estimatedTax.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-1 border-t border-outline-variant/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface">Grand Total Paid</span>
              <span className="text-[11px] text-on-surface-variant font-mono">
                Currency: {financials.currency}
              </span>
            </div>
            <span className="text-2xl font-bold font-mono text-primary">
              ${financials.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right: Transaction Audit Box */}
        <div className="flex flex-col justify-between bg-white rounded-xl p-4 border border-outline-variant/60 shadow-xs">
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold">
                Gateway Processor
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-on-surface">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                <span>{paymentAudit.processor}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Card Details</span>
              <span className="font-semibold text-on-surface font-mono">
                {paymentAudit.cardBrand} ending in •••• {paymentAudit.cardLast4}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Provider Transaction ID</span>
              <span className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/50 text-on-surface">
                {paymentAudit.transactionId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Capture Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{paymentAudit.captureStatusText}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Settled Timestamp</span>
              <span className="text-on-surface font-medium font-mono text-[11px]">
                {paymentAudit.settledTimestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 mt-2 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={onRefundClick}
              className="flex-1 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95 text-center"
            >
              Refund Order
            </button>
            <button
              type="button"
              onClick={onViewLogs}
              className="flex-1 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-outline-variant/60 cursor-pointer shadow-xs active:scale-95"
            >
              <span>View Gateway Logs</span>
              <ExternalLink className="w-3 h-3 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

