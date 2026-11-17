import { useState, useRef, useEffect } from 'react'
import {
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Upload,
  Trash2,
  Loader2,
} from 'lucide-react'
import type {
  CollectionFormData,
  CollectionItem,
  CollectionStatus,
  CollectionLocation,
} from '../../types/collection'
import { defaultCollectionFormData } from '../../data/mockCollectionData'
import { checkCollectionSlugAvailability } from '../../api/adminCollectionApi'
import { normalizeImageUrl } from '@/lib/api/axiosInstance'
import { DEFAULT_DEBOUNCE_MS } from '@/hooks/useDebounce'

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken'

interface CollectionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CollectionFormData, imageFile: File | null) => Promise<void> | void
  editItem?: CollectionItem | null
}

function getInitialFormData(editItem?: CollectionItem | null): CollectionFormData {
  if (editItem) {
    return {
      id: editItem.id,
      title: editItem.title,
      slug: editItem.slug,
      description: editItem.description || '',
      imageUrl: normalizeImageUrl(editItem.imageUrl) || '',
      status: editItem.status,
      displayLocation: editItem.displayLocation,
      isFeatured: editItem.isFeatured,
      rulesType: editItem.rulesType,
      badgeText: editItem.badgeText || '',
    }
  }
  return { ...defaultCollectionFormData }
}

export function CollectionFormModal({
  isOpen,
  onClose,
  onSave,
  editItem,
}: CollectionFormModalProps) {
  const [prevTarget, setPrevTarget] = useState<{
    editId?: string
    isOpen: boolean
  }>({
    editId: editItem?.id,
    isOpen,
  })
  const [formData, setFormData] = useState<CollectionFormData>(() =>
    getInitialFormData(editItem)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAutoSlug, setIsAutoSlug] = useState(!editItem)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSlugRef = useRef<string>('')

  useEffect(() => {
    if (!isOpen && slugDebounceRef.current) {
      clearTimeout(slugDebounceRef.current)
      slugDebounceRef.current = null
      latestSlugRef.current = ''
    }
    return () => {
      if (slugDebounceRef.current) {
        clearTimeout(slugDebounceRef.current)
        slugDebounceRef.current = null
      }
    }
  }, [isOpen])

  if (prevTarget.editId !== editItem?.id || prevTarget.isOpen !== isOpen) {
    setPrevTarget({ editId: editItem?.id, isOpen })
    setFormData(getInitialFormData(editItem))
    setIsAutoSlug(!editItem)
    setErrors({})
    setImageFile(null)
    setSubmitError(null)
    setSlugStatus('idle')
  }

  if (!isOpen) return null

  const triggerSlugCheck = (cleanSlug: string) => {
    if (slugDebounceRef.current) {
      clearTimeout(slugDebounceRef.current)
    }
    latestSlugRef.current = cleanSlug

    if (!cleanSlug || (editItem && cleanSlug === editItem.slug)) {
      setSlugStatus('idle')
      return
    }

    setSlugStatus('checking')
    slugDebounceRef.current = setTimeout(async () => {
      try {
        const result = await checkCollectionSlugAvailability(cleanSlug)
        if (latestSlugRef.current === cleanSlug) {
          setSlugStatus(result.available ? 'available' : 'taken')
        }
      } catch {
        if (latestSlugRef.current === cleanSlug) {
          setSlugStatus('idle')
        }
      }
    }, DEFAULT_DEBOUNCE_MS)
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setFormData((prev) => ({
        ...prev,
        imageUrl: dataUrl,
      }))
    }
    reader.readAsDataURL(file)
    setImageFile(file)
    e.target.value = ''
  }

  const handleRemoveCover = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }))
    setImageFile(null)
  }

  const handleTitleChange = (val: string) => {
    const updated: Partial<CollectionFormData> = { title: val }
    if (isAutoSlug) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      updated.slug = autoSlug
      triggerSlugCheck(autoSlug)
    }
    setFormData((prev) => ({ ...prev, ...updated }))
    if (errors.title) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.title
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
    triggerSlugCheck(clean)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.title.trim()) {
      errs.title = 'Collection title is required'
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters'
    }

    if (!formData.slug.trim()) {
      errs.slug = 'Slug identifier is required'
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      errs.slug = 'Slug must be lowercase alphanumeric with hyphens (e.g. best-sellers-2025)'
    } else if (slugStatus === 'taken') {
      errs.slug = 'This slug is already taken'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitError(null)
    setIsSaving(true)
    try {
      await onSave(formData, imageFile)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save collection')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {editItem ? 'Edit Collection' : 'Create New Collection'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Configure curated catalog groupings, promotional banners, and placement rules.
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Collection Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Featured Highlights (Home Grid), Best Sellers 2025"
              className={`w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary'
              } focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all`}
            />
            {errors.title && (
              <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </span>
            )}
          </div>

          {/* Slug */}
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
                /collections/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="featured-highlights-home-grid"
                className={`w-full h-10 pl-26 pr-9 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-mono border ${
                  errors.slug ? 'border-red-500 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary'
                } focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all`}
              />
              {slugStatus !== 'idle' && (
                <span className="absolute right-3 top-2.5">
                  {slugStatus === 'checking' && (
                    <Loader2 className="w-4 h-4 text-on-surface-variant animate-spin" />
                  )}
                  {slugStatus === 'available' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {slugStatus === 'taken' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </span>
              )}
            </div>
            {slugStatus === 'taken' && !errors.slug && (
              <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>This slug is already taken</span>
              </span>
            )}
            {slugStatus === 'available' && !errors.slug && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Slug is available</span>
              </span>
            )}
            {errors.slug && (
              <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.slug}</span>
              </span>
            )}
          </div>

          {/* Banner / Cover Image Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Banner / Cover Image
            </label>

            {formData.imageUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="w-20 h-14 rounded-lg bg-surface-container border border-outline-variant/60 overflow-hidden shadow-2xs flex items-center justify-center shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Collection cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cover Image Uploaded</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    Displayed on collection banners &amp; home spotlight tiles.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Change Cover</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleCoverFileChange}
                      />
                    </label>
                    <span className="text-outline-variant">•</span>
                    <button
                      type="button"
                      onClick={handleRemoveCover}
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
                  onChange={handleCoverFileChange}
                />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary mb-2 shadow-2xs border border-outline-variant/60 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-on-surface">
                  Click to upload cover image, or <span className="text-primary underline">browse</span>
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  Recommended wide landscape format (e.g. 1200 x 600px, PNG, JPG, or WEBP)
                </span>
              </label>
            )}
          </div>

          {/* Placement Location & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Display Placement */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Storefront Placement
              </label>
              <select
                value={formData.displayLocation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayLocation: e.target.value as CollectionLocation,
                  }))
                }
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="Home Grid">Home Grid</option>
                <option value="Storefront Catalog">Storefront Catalog</option>
                <option value="Banner">Banner Showcase</option>
                <option value="Sidebar">Sidebar Quick Filter</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as CollectionStatus,
                  }))
                }
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="active">Active (Live in Store)</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft (Unpublished)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Promotional Ribbon / Badge Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Badge / Ribbon Text (Optional)
            </label>
            <input
              type="text"
              value={formData.badgeText || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
              placeholder="e.g. FEATURED 2026, TOP VELOCITY, LIMITED RUN"
              className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary shadow-2xs"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Curated Set Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a marketing description that appears at the top of the collection page..."
              className="w-full p-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs resize-none"
            />
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-outline-variant/60">
            <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature prominently on homepage hero grid</span>
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || slugStatus === 'checking'}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editItem ? 'Save Collection Changes' : 'Create Collection'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
