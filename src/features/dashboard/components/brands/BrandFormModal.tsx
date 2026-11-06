import { useState } from 'react'
import {
  X,
  Building2,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UploadCloud,
  Upload,
  Trash2,
} from 'lucide-react'
import { countries } from 'countries-list'
import type { BrandFormData, BrandItem, BrandStatus } from '../../types/brand'
import { defaultBrandFormData } from '../../data/mockBrandData'

// Pre-sorted list of all countries from countries-list library
const COUNTRY_OPTIONS = Object.entries(countries)
  .map(([code, c]) => ({
    code,
    name: c.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

interface BrandFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: BrandFormData) => void
  editItem?: BrandItem | null
}

function getInitialFormData(editItem?: BrandItem | null): BrandFormData {
  if (editItem) {
    return {
      id: editItem.id,
      name: editItem.name,
      slug: editItem.slug,
      logoUrl: editItem.logoUrl || '',
      websiteUrl: editItem.websiteUrl || '',
      description: editItem.description || '',
      status: editItem.status,
      isInternal: editItem.isInternal,
      country: editItem.country || 'United States',
      contactEmail: editItem.contactEmail || '',
    }
  }
  return { ...defaultBrandFormData }
}

export function BrandFormModal({
  isOpen,
  onClose,
  onSave,
  editItem,
}: BrandFormModalProps) {
  const [prevTarget, setPrevTarget] = useState<{
    editId?: string
    isOpen: boolean
  }>({
    editId: editItem?.id,
    isOpen,
  })
  const [formData, setFormData] = useState<BrandFormData>(() => getInitialFormData(editItem))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAutoSlug, setIsAutoSlug] = useState(!editItem)

  if (prevTarget.editId !== editItem?.id || prevTarget.isOpen !== isOpen) {
    setPrevTarget({ editId: editItem?.id, isOpen })
    setFormData(getInitialFormData(editItem))
    setIsAutoSlug(!editItem)
    setErrors({})
  }

  if (!isOpen) return null

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Read file as Base64 Data URL so it previews and persists in localStorage
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setFormData((prev) => ({
        ...prev,
        logoUrl: dataUrl,
      }))
    }
    reader.readAsDataURL(file)
    // reset input value so re-uploading the same file works
    e.target.value = ''
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: '',
    }))
  }

  const handleNameChange = (val: string) => {
    const updated: Partial<BrandFormData> = { name: val }
    if (isAutoSlug) {
      updated.slug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    setFormData((prev) => ({ ...prev, ...updated }))
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.name
        return next
      })
    }
  }

  const handleSlugChange = (val: string) => {
    setIsAutoSlug(false)
    const clean = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setFormData((prev) => ({ ...prev, slug: clean }))
    if (errors.slug) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.slug
        return next
      })
    }
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) {
      errs.name = 'Brand name is required'
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Brand name must be at least 2 characters'
    }

    if (!formData.slug.trim()) {
      errs.slug = 'Slug identifier is required'
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      errs.slug = 'Slug must be lowercase alphanumeric with hyphens (e.g. aero-sound)'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {editItem ? 'Edit Brand Profile' : 'Add New Brand'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Configure brand metadata, manufacturer origin, and storefront slug.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {/* Brand Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Sennheiser Pro, AeroSound"
              className={`w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary'
              } focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all`}
            />
            {errors.name && (
              <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </span>
            )}
          </div>

          {/* Storefront Slug */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Storefront Slug <span className="text-red-500">*</span>
              </label>
              {isAutoSlug && (
                <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-generating</span>
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-on-surface-variant font-mono">
                /brands/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="aerosound"
                className={`w-full h-10 pl-18 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-mono border ${
                  errors.slug ? 'border-red-500 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary'
                } focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all`}
              />
            </div>
            {errors.slug && (
              <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.slug}</span>
              </span>
            )}
          </div>

          {/* Brand Logo Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Brand Logo Image
            </label>

            {formData.logoUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="w-16 h-16 rounded-xl bg-white border border-outline-variant/60 overflow-hidden shadow-2xs flex items-center justify-center shrink-0">
                  <img
                    src={formData.logoUrl}
                    alt="Brand Logo Preview"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logo Uploaded</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    Ready for storefront showcase &amp; product badges.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoFileChange}
                      />
                    </label>
                    <span className="text-outline-variant">•</span>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs font-semibold text-red-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container/80 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed border-outline-variant/80 group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoFileChange}
                />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary mb-2 shadow-2xs border border-outline-variant/60 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-on-surface">
                  Click to upload brand logo, or <span className="text-primary underline">browse</span>
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  PNG, JPG, SVG, or WEBP (transparent background recommended)
                </span>
              </label>
            )}
          </div>

          {/* Website & Country Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Website URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Official Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-on-surface-variant absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://brand.com"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>
            </div>

            {/* Country of Origin - from countries-list library */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface flex items-center justify-between">
                <span>Country / Origin</span>
                <span className="text-[10px] text-on-surface-variant font-normal">
                  {COUNTRY_OPTIONS.length} countries
                </span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-on-surface-variant absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.country || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
                >
                  <option value="">Select country of origin...</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Brand Description &amp; Heritage
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief summary of brand history, product specialty, and hardware design philosophy..."
              className="w-full p-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs resize-none"
            />
          </div>

          {/* Status & In-House Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-outline-variant/60">
            {/* Status Select */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-on-surface">Lifecycle Status:</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value as BrandStatus }))
                }
                className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* In-House Brand Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isInternal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isInternal: e.target.checked }))
                }
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <span className="flex items-center gap-1 font-semibold text-primary">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proprietary In-House Brand</span>
              </span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editItem ? 'Save Brand Changes' : 'Create Brand'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
