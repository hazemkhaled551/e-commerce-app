import { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Percent,
  DollarSign,
  Truck,
  Calendar,
  Ticket,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  Edit2,
} from 'lucide-react'
import type { PromotionItem, PromotionStatus, PromotionDiscountType } from '../../types/promotion'

interface PromotionViewModalProps {
  isOpen: boolean
  onClose: () => void
  promotion: PromotionItem | null
  onEdit: (promo: PromotionItem) => void
}

export function PromotionViewModal({
  isOpen,
  onClose,
  promotion,
  onEdit,
}: PromotionViewModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !promotion) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(promotion.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStatusBadge = (status: PromotionStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active &amp; Live
          </span>
        )
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            Scheduled
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
            Expired
          </span>
        )
      case 'disabled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Deactivated
          </span>
        )
    }
  }

  const renderDiscountText = (type: PromotionDiscountType, value: number) => {
    if (type === 'percentage') return `${value}% Off Subtotal`
    if (type === 'fixed_amount') return `$${value.toFixed(2)} Off Subtotal`
    return 'Free Standard Shipping'
  }

  const hasLimit = promotion.usageLimit != null && promotion.usageLimit > 0
  const usagePercent = hasLimit
    ? Math.min(100, Math.round((promotion.usageCount / promotion.usageLimit!) * 100))
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60 bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">Promotion Details</h2>
              <p className="text-xs text-on-surface-variant">
                Voucher terms, limits, and customer redemption KPIs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Coupon Ticket Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-surface-container-lowest p-5 border border-primary/20 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  PROMO VOUCHER
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xl font-black text-on-surface tracking-wider">
                    {promotion.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded-md bg-white hover:bg-surface-container border border-outline-variant/60 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                    title="Copy coupon code"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <h3 className="font-semibold text-sm text-on-surface mt-1">
                  {promotion.title}
                </h3>
              </div>

              <div>{renderStatusBadge(promotion.status)}</div>
            </div>

            {/* Discount Ribbon */}
            <div className="mt-4 pt-3 border-t border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  {promotion.discountType === 'percentage' && <Percent className="w-3.5 h-3.5" />}
                  {promotion.discountType === 'fixed_amount' && (
                    <DollarSign className="w-3.5 h-3.5" />
                  )}
                  {promotion.discountType === 'free_shipping' && <Truck className="w-3.5 h-3.5" />}
                </div>
                <span className="font-bold text-sm text-on-surface">
                  {renderDiscountText(promotion.discountType, promotion.discountValue)}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <div className="flex items-center justify-between text-outline text-[11px] font-semibold uppercase">
                <span>Total Redemptions</span>
                <Ticket className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-on-surface">
                  {promotion.usageCount.toLocaleString()}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {hasLimit ? `of ${promotion.usageLimit!.toLocaleString()}` : 'unlimited'}
                </span>
              </div>
              {hasLimit && (
                <div className="mt-2 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <div className="flex items-center justify-between text-outline text-[11px] font-semibold uppercase">
                <span>Customer Savings</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-on-surface">
                  ${Math.round(promotion.totalSavings || 0).toLocaleString()}
                </span>
                <span className="text-xs text-on-surface-variant">discounted</span>
              </div>
              <p className="mt-2 text-[10px] text-outline">Gross value saved at checkout</p>
            </div>
          </div>

          {/* Terms & Restrictions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
              Rules &amp; Restrictions
            </h4>

            <div className="rounded-xl border border-outline-variant/60 divide-y divide-outline-variant/40 bg-surface-container-lowest text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-outline" />
                  Minimum Order Value
                </span>
                <span className="font-semibold text-on-surface">
                  {promotion.minOrderValue ? `$${promotion.minOrderValue.toFixed(2)}` : 'None'}
                </span>
              </div>

              {promotion.maxDiscountValue && (
                <div className="flex items-center justify-between p-3">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-outline" />
                    Maximum Discount Cap
                  </span>
                  <span className="font-semibold text-on-surface">
                    ${promotion.maxDiscountValue.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-outline" />
                  Limit per Customer
                </span>
                <span className="font-semibold text-on-surface">
                  {promotion.perCustomerLimit
                    ? `${promotion.perCustomerLimit} redemption per user`
                    : 'Unlimited'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-outline" />
                  Validity Window
                </span>
                <span className="font-semibold text-on-surface">
                  {new Date(promotion.startDate).toLocaleDateString()} —{' '}
                  {promotion.endDate
                    ? new Date(promotion.endDate).toLocaleDateString()
                    : 'No Expiration'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/60 bg-surface-container-lowest">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/60 transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(promotion)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Promotion</span>
          </button>
        </div>
      </div>
    </div>
  )
}
