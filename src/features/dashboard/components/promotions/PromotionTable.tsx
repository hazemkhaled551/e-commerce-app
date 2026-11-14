import { useState } from 'react'
import {
  Copy,
  Check,
  Percent,
  DollarSign,
  Truck,
  Eye,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  Tag,
  Plus,
} from 'lucide-react'
import type { PromotionItem, PromotionStatus, PromotionDiscountType } from '../../types/promotion'

interface PromotionTableProps {
  promotions: PromotionItem[]
  selectedIds: string[]
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
  onView: (promo: PromotionItem) => void
  onEdit: (promo: PromotionItem) => void
  onDelete: (promo: PromotionItem) => void
  onToggleStatus: (promo: PromotionItem) => void
  onAddNew: () => void
  isLoading?: boolean
}

export function PromotionTable({
  promotions,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddNew,
  isLoading = false,
}: PromotionTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  const allSelected =
    promotions.length > 0 && selectedIds.length === promotions.length
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < promotions.length

  const renderStatusBadge = (status: PromotionStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        )
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-500" />
            Scheduled
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <AlertCircle className="w-3 h-3 text-stone-400" />
            Expired
          </span>
        )
      case 'disabled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Disabled
          </span>
        )
    }
  }

  const renderDiscountTypePill = (type: PromotionDiscountType, value: number) => {
    if (type === 'percentage') {
      return (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-purple-50 text-purple-700 text-xs font-bold">
            <Percent className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-on-surface text-sm">{value}% Off</span>
        </div>
      )
    }
    if (type === 'fixed_amount') {
      return (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
            <DollarSign className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-on-surface text-sm">${value} Off</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-sky-50 text-sky-700 text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
        </span>
        <span className="font-bold text-on-surface text-sm">Free Shipping</span>
      </div>
    )
  }

  const renderValidity = (promo: PromotionItem) => {
    const now = new Date()
    const start = new Date(promo.startDate)

    if (promo.status === 'scheduled' || start > now) {
      const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-sky-700">Starts in {diffDays} days</span>
          <span className="text-[11px] text-on-surface-variant">
            {start.toLocaleDateString()}
          </span>
        </div>
      )
    }

    if (!promo.endDate) {
      return (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-emerald-700">No Expiration</span>
          <span className="text-[11px] text-on-surface-variant">Ongoing campaign</span>
        </div>
      )
    }

    const end = new Date(promo.endDate)
    if (end < now) {
      return (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-stone-500">Expired</span>
          <span className="text-[11px] text-stone-400">{end.toLocaleDateString()}</span>
        </div>
      )
    }

    const diffHours = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffHours / 24)

    return (
      <div className="flex flex-col">
        {diffDays <= 3 ? (
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {diffHours < 24 ? `${diffHours}h left` : `${diffDays} days left`}
          </span>
        ) : (
          <span className="text-xs font-medium text-on-surface">
            Expires in {diffDays} days
          </span>
        )}
        <span className="text-[11px] text-on-surface-variant">
          Ends {end.toLocaleDateString()}
        </span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
        <div className="p-4 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-surface-container-high/60 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">
          <Tag className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-base font-bold text-on-surface">No promotion campaigns found</h3>
          <p className="text-xs text-on-surface-variant">
            Try adjusting your search criteria or create a new discount code for your store.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-outline-variant/60 bg-surface-container-lowest text-outline font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">Coupon Code &amp; Title</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Usage &amp; Limits</th>
              <th className="py-3 px-4">Min. Spend / Cap</th>
              <th className="py-3 px-4">Validity Period</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {promotions.map((promo) => {
              const isSelected = selectedIds.includes(promo.id)
              const hasLimit = promo.usageLimit != null && promo.usageLimit > 0
              const usagePercent = hasLimit
                ? Math.min(100, Math.round((promo.usageCount / promo.usageLimit!) * 100))
                : null

              return (
                <tr
                  key={promo.id}
                  className={`hover:bg-surface-container-lowest/60 transition-colors ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectOne(promo.id, e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Code & Title */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 max-w-[260px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container font-mono font-bold text-xs text-on-surface tracking-wider border border-outline-variant/60">
                          {promo.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(promo.code)}
                          title="Copy code"
                          className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        >
                          {copiedCode === promo.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="font-semibold text-on-surface text-xs truncate">
                        {promo.title}
                      </span>
                      {promo.description && (
                        <span className="text-[11px] text-on-surface-variant line-clamp-1">
                          {promo.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="py-3 px-4">
                    {renderDiscountTypePill(promo.discountType, promo.discountValue)}
                  </td>

                  {/* Usage & Limits */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-on-surface">
                          {promo.usageCount.toLocaleString()}
                        </span>
                        <span className="text-on-surface-variant">
                          {hasLimit ? `/ ${promo.usageLimit!.toLocaleString()}` : 'Unlimited'}
                        </span>
                      </div>
                      {hasLimit && (
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePercent! >= 90
                                ? 'bg-amber-500'
                                : usagePercent! >= 100
                                  ? 'bg-rose-500'
                                  : 'bg-primary'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      )}
                      {promo.perCustomerLimit && (
                        <span className="text-[10px] text-outline">
                          Limit {promo.perCustomerLimit} per customer
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Min Spend / Cap */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-0.5">
                      {promo.minOrderValue ? (
                        <span className="font-medium text-on-surface">
                          Min. ${promo.minOrderValue.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-[11px]">No minimum</span>
                      )}
                      {promo.maxDiscountValue && (
                        <span className="text-[10px] text-outline">
                          Cap: ${promo.maxDiscountValue.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Validity Period */}
                  <td className="py-3 px-4">{renderValidity(promo)}</td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(promo)}
                      title={`Click to toggle status: currently ${promo.status}`}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      {renderStatusBadge(promo.status)}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onView(promo)}
                        title="View details & metrics"
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(promo)}
                        title="Edit promotion"
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(promo)}
                        title="Delete promotion"
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-on-surface-variant hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
