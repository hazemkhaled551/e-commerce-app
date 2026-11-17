import { useState, useRef, useEffect } from 'react'
import {
  X,
  Sparkles,
  Percent,
  DollarSign,
  Truck,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react'
import type {
  PromotionFormData,
  PromotionItem,
  PromotionStatus,
} from '../../types/promotion'
import { checkPromotionCodeAvailability } from '../../api/adminPromotionApi'
import { DEFAULT_DEBOUNCE_MS } from '@/hooks/useDebounce'

interface PromotionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PromotionFormData) => Promise<void> | void
  editItem?: PromotionItem | null
}

const DEFAULT_FORM_DATA: PromotionFormData = {
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: 15,
  minOrderValue: undefined,
  maxDiscountValue: undefined,
  usageLimit: 500,
  perCustomerLimit: 1,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  status: 'active',
  appliesTo: 'all_products',
}

function getInitialFormData(editItem?: PromotionItem | null): PromotionFormData {
  if (editItem) {
    return {
      code: editItem.code,
      title: editItem.title,
      description: editItem.description || '',
      discountType: editItem.discountType,
      discountValue: editItem.discountValue,
      minOrderValue: editItem.minOrderValue,
      maxDiscountValue: editItem.maxDiscountValue,
      usageLimit: editItem.usageLimit,
      perCustomerLimit: editItem.perCustomerLimit ?? 1,
      startDate: editItem.startDate ? editItem.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      endDate: editItem.endDate ? editItem.endDate.slice(0, 10) : undefined,
      status: editItem.status,
      appliesTo: editItem.appliesTo,
      targetIds: editItem.targetIds,
    }
  }
  return { ...DEFAULT_FORM_DATA }
}

export function PromotionFormModal({
  isOpen,
  onClose,
  onSave,
  editItem,
}: PromotionFormModalProps) {
  const [prevTarget, setPrevTarget] = useState<{
    editId?: string
    isOpen: boolean
  }>({
    editId: editItem?.id,
    isOpen,
  })

  const [formData, setFormData] = useState<PromotionFormData>(() =>
    getInitialFormData(editItem)
  )
  const [hasNoEndDate, setHasNoEndDate] = useState<boolean>(!editItem?.endDate)
  const [isUnlimitedUsage, setIsUnlimitedUsage] = useState<boolean>(
    editItem ? editItem.usageLimit == null : false
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const codeCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCodeRef = useRef<string>('')

  if (prevTarget.editId !== editItem?.id || prevTarget.isOpen !== isOpen) {
    setPrevTarget({ editId: editItem?.id, isOpen })
    const initial = getInitialFormData(editItem)
    setFormData(initial)
    setHasNoEndDate(!editItem?.endDate)
    setIsUnlimitedUsage(editItem ? editItem.usageLimit == null : false)
    setErrors({})
    setCodeStatus('idle')
    setIsSaving(false)
  }

  // Cleanup code check debounce timer on close / unmount
  useEffect(() => {
    if (!isOpen && codeCheckTimerRef.current) {
      clearTimeout(codeCheckTimerRef.current)
      codeCheckTimerRef.current = null
      latestCodeRef.current = ''
    }
    return () => {
      if (codeCheckTimerRef.current) {
        clearTimeout(codeCheckTimerRef.current)
        codeCheckTimerRef.current = null
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleGenerateRandomCode = () => {
    const prefixes = ['SAVE', 'DEAL', 'FLASH', 'VIP', 'OFFER', 'NEXA']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const newCode = `${prefix}${randomDigits}`
    setFormData((prev) => ({ ...prev, code: newCode }))
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: '' }))
    }
    triggerCodeAvailabilityCheck(newCode)
  }

  const triggerCodeAvailabilityCheck = (codeVal: string) => {
    if (codeCheckTimerRef.current) clearTimeout(codeCheckTimerRef.current)
    const normalized = codeVal.trim().toUpperCase()
    latestCodeRef.current = normalized

    if (!normalized || (editItem && normalized === editItem.code.toUpperCase())) {
      setCodeStatus('idle')
      return
    }

    setCodeStatus('checking')
    codeCheckTimerRef.current = setTimeout(async () => {
      const res = await checkPromotionCodeAvailability(normalized, editItem?.id)
      if (latestCodeRef.current !== normalized) return
      setCodeStatus(res.available ? 'available' : 'taken')
      if (!res.available) {
        setErrors((prev) => ({ ...prev, code: res.message || 'Code is already taken' }))
      } else {
        setErrors((prev) => {
          const next = { ...prev }
          delete next.code
          return next
        })
      }
    }, DEFAULT_DEBOUNCE_MS)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!formData.code.trim()) {
      errs.code = 'Promotion code is required'
    } else if (formData.code.trim().length < 3) {
      errs.code = 'Code must be at least 3 characters'
    } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
      errs.code = 'Code can only contain letters, numbers, dashes, and underscores'
    }

    if (!formData.title.trim()) {
      errs.title = 'Title / Campaign name is required'
    }

    if (formData.discountType === 'percentage') {
      if (formData.discountValue <= 0 || formData.discountValue > 100) {
        errs.discountValue = 'Percentage discount must be between 1% and 100%'
      }
    } else if (formData.discountType === 'fixed_amount') {
      if (formData.discountValue <= 0) {
        errs.discountValue = 'Fixed discount amount must be greater than $0'
      }
    }

    if (formData.minOrderValue !== undefined && formData.minOrderValue < 0) {
      errs.minOrderValue = 'Minimum order value cannot be negative'
    }

    if (formData.maxDiscountValue !== undefined && formData.maxDiscountValue <= 0) {
      errs.maxDiscountValue = 'Max discount value must be greater than 0'
    }

    if (!isUnlimitedUsage) {
      if (formData.usageLimit !== null && formData.usageLimit !== undefined && formData.usageLimit <= 0) {
        errs.usageLimit = 'Usage limit must be at least 1'
      }
    }

    if (formData.perCustomerLimit !== undefined && formData.perCustomerLimit <= 0) {
      errs.perCustomerLimit = 'Per customer limit must be at least 1'
    }

    if (!formData.startDate) {
      errs.startDate = 'Start date is required'
    }

    if (!hasNoEndDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        errs.endDate = 'End date cannot be earlier than start date'
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      const payload: PromotionFormData = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        usageLimit: isUnlimitedUsage ? null : formData.usageLimit,
        endDate: hasNoEndDate ? null : formData.endDate,
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxDiscountValue: formData.maxDiscountValue ? Number(formData.maxDiscountValue) : undefined,
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Failed to save promotion',
      }))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60 bg-surface-container-lowest">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {editItem ? `Edit Promotion: ${editItem.code}` : 'Create New Promotion'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Configure discount rules, limitations, and redemption validity.
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errors.submit && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* 1. Code & Title */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              1. General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Promotion Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/\s+/g, '')
                      setFormData((prev) => ({ ...prev, code: val }))
                      triggerCodeAvailabilityCheck(val)
                    }}
                    placeholder="e.g. SUMMER25"
                    className={`w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest font-mono font-bold text-xs uppercase border ${
                      errors.code
                        ? 'border-rose-400 focus:ring-rose-200'
                        : codeStatus === 'available'
                          ? 'border-emerald-400 focus:ring-emerald-200'
                          : 'border-outline-variant/60 focus:border-primary focus:ring-primary/20'
                    } focus:outline-none focus:ring-2 shadow-2xs transition-all`}
                  />
                  {codeStatus === 'available' && !errors.code && (
                    <Check className="w-4 h-4 text-emerald-500 absolute right-2.5 top-3 pointer-events-none" />
                  )}
                </div>
                {errors.code && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.code}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-outline">
                  Customers enter this code at checkout to claim the discount.
                </p>
              </div>

              {/* Title / Name */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Campaign Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                  }}
                  placeholder="e.g. Summer Flash Sale 2026"
                  className={`w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-outline-variant/60 focus:border-primary focus:ring-primary/20'
                  } focus:outline-none focus:ring-2 shadow-2xs transition-all`}
                />
                {errors.title && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-outline">
                  Internal and promotional name displayed on badges.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Description &amp; Terms
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Optional customer terms (e.g. Valid on selected summer items only)..."
                className="w-full p-2.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* 2. Discount Type & Value */}
          <div className="space-y-4 pt-2 border-t border-outline-variant/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              2. Discount Type &amp; Value
            </h3>

            {/* Type Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Percentage */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    discountType: 'percentage',
                    discountValue: prev.discountValue || 15,
                  }))
                }
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  formData.discountType === 'percentage'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant/60 hover:bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      formData.discountType === 'percentage'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-on-surface">Percentage (%)</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Discount cart by a percentage.
                </p>
              </button>

              {/* Fixed Amount */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    discountType: 'fixed_amount',
                    discountValue: prev.discountValue || 20,
                  }))
                }
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  formData.discountType === 'fixed_amount'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant/60 hover:bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      formData.discountType === 'fixed_amount'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-on-surface">Fixed Amount ($)</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Deduct fixed dollar value from subtotal.
                </p>
              </button>

              {/* Free Shipping */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    discountType: 'free_shipping',
                    discountValue: 0,
                  }))
                }
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  formData.discountType === 'free_shipping'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant/60 hover:bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      formData.discountType === 'free_shipping'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-on-surface">Free Shipping</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Waive standard delivery fees.
                </p>
              </button>
            </div>

            {/* Discount Value Inputs */}
            {formData.discountType !== 'free_shipping' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    {formData.discountType === 'percentage'
                      ? 'Discount Percentage (%)'
                      : 'Discount Value ($)'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={formData.discountType === 'percentage' ? 100 : undefined}
                      step={formData.discountType === 'percentage' ? 1 : 0.5}
                      value={formData.discountValue || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          discountValue: Number(e.target.value),
                        }))
                        if (errors.discountValue) {
                          setErrors((prev) => ({ ...prev, discountValue: '' }))
                        }
                      }}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-outline">
                      {formData.discountType === 'percentage' ? '%' : '$'}
                    </span>
                  </div>
                  {errors.discountValue && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.discountValue}</p>
                  )}
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Max Discount Cap ($)
                    </label>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 50 (optional)"
                      value={formData.maxDiscountValue || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          maxDiscountValue: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
                    />
                    <p className="mt-1 text-[10px] text-outline">Leave empty for no upper limit</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Minimum Order Value ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 50 (optional)"
                    value={formData.minOrderValue || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minOrderValue: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
                  />
                  <p className="mt-1 text-[10px] text-outline">Cart minimum required to redeem</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Usage Limits & Rules */}
          <div className="space-y-4 pt-2 border-t border-outline-variant/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              3. Usage Limits &amp; Constraints
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Usage Limit */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">
                    Global Redemption Limit
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUnlimitedUsage}
                      onChange={(e) => {
                        setIsUnlimitedUsage(e.target.checked)
                        if (e.target.checked) {
                          setFormData((prev) => ({ ...prev, usageLimit: null }))
                        } else {
                          setFormData((prev) => ({ ...prev, usageLimit: 500 }))
                        }
                      }}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>
                <input
                  type="number"
                  min={1}
                  disabled={isUnlimitedUsage}
                  value={isUnlimitedUsage ? '' : formData.usageLimit || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      usageLimit: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  placeholder={isUnlimitedUsage ? 'Unlimited redemptions' : 'e.g. 500'}
                  className={`w-full h-10 px-3 rounded-lg text-xs border border-outline-variant/60 shadow-2xs transition-all ${
                    isUnlimitedUsage
                      ? 'bg-surface-container/60 text-on-surface-variant cursor-not-allowed'
                      : 'bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
              </div>

              {/* Per Customer Limit */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Redemptions Per Customer
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.perCustomerLimit || 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      perCustomerLimit: Number(e.target.value) || 1,
                    }))
                  }
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
                />
                <p className="mt-1 text-[10px] text-outline">
                  Maximum times one customer account can apply this code.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Validity & Schedule */}
          <div className="space-y-4 pt-2 border-t border-outline-variant/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              4. Validity &amp; Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">End Date</label>
                  <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasNoEndDate}
                      onChange={(e) => {
                        setHasNoEndDate(e.target.checked)
                        if (e.target.checked) {
                          setFormData((prev) => ({ ...prev, endDate: undefined }))
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .slice(0, 10),
                          }))
                        }
                      }}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>Never expires</span>
                  </label>
                </div>
                <input
                  type="date"
                  disabled={hasNoEndDate}
                  value={hasNoEndDate ? '' : formData.endDate || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className={`w-full h-10 px-3 rounded-lg text-xs border border-outline-variant/60 shadow-2xs transition-all ${
                    hasNoEndDate
                      ? 'bg-surface-container/60 text-on-surface-variant cursor-not-allowed'
                      : 'bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as PromotionStatus,
                  }))
                }
                className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="active">Active (Usable immediately)</option>
                <option value="scheduled">Scheduled (Activates on start date)</option>
                <option value="disabled">Disabled (Temporarily deactivated)</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/60 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <span>{editItem ? 'Save Changes' : 'Create Promotion'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
