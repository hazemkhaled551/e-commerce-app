import { useState, useEffect } from 'react'
import {
  FolderTree,
  X,
  AlertCircle,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import type { CategoryFormData, CategoryItem } from '../../types/category'
import { defaultCategoryFormData } from '../../data/mockCategoryData'
import { checkCategorySlugAvailability } from '../../api/adminCategoryApi'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: CategoryFormData) => Promise<void> | void
  editItem?: CategoryItem | null
  parentItem?: CategoryItem | null
  existingRootCategories: CategoryItem[]
}

function getInitialFormData(
  editItem?: CategoryItem | null,
  parentItem?: CategoryItem | null
): CategoryFormData {
  if (editItem) {
    return {
      id: editItem.id,
      name: editItem.name,
      slug: editItem.slug,
      description: editItem.description,
      parentId: editItem.parentId || '',
      imageUrl: editItem.imageUrl,
      imageFileName: editItem.imageFileName || 'category-cover.webp',
      imageSizeText: editItem.imageSizeText || '1080 x 1080px (142 KB)',
      showInNav: editItem.showInNav,
      featureOnHome: editItem.featureOnHome,
      displayOrder: parseInt(editItem.displayOrder.replace(/[^0-9]/g, ''), 10) || 5,
      seoTitle: editItem.seoTitle,
      seoDescription: editItem.seoDescription,
      status: editItem.status,
    }
  }
  if (parentItem) {
    return {
      ...defaultCategoryFormData,
      parentId: parentItem.id,
      displayOrder: 1,
    }
  }
  return defaultCategoryFormData
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editItem,
  parentItem,
  existingRootCategories,
}: CategoryFormModalProps) {
  const [prevTarget, setPrevTarget] = useState<{
    editId?: string
    parentId?: string
    isOpen: boolean
  }>({
    editId: editItem?.id,
    parentId: parentItem?.id,
    isOpen,
  })
  const [formData, setFormData] = useState<CategoryFormData>(() =>
    getInitialFormData(editItem, parentItem)
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Remote Slug Check State
  const [remoteSlugCheck, setRemoteSlugCheck] = useState<{
    slug: string
    status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
    message: string | null
  }>({
    slug: '',
    status: 'idle',
    message: null,
  })

  if (
    isOpen !== prevTarget.isOpen ||
    editItem?.id !== prevTarget.editId ||
    parentItem?.id !== prevTarget.parentId
  ) {
    setPrevTarget({
      editId: editItem?.id,
      parentId: parentItem?.id,
      isOpen,
    })
    setFormData(getInitialFormData(editItem, parentItem))
    setError(null)
  }

  // Slug derivation & validation
  const trimmedSlug = formData.slug.trim().toLowerCase()
  const isInitialEditSlug = Boolean(
    editItem && editItem.slug.toLowerCase() === trimmedSlug
  )

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  let clientFormatError: string | null = null
  if (trimmedSlug) {
    if (trimmedSlug.length < 2) {
      clientFormatError = 'Slug must be at least 2 characters.'
    } else if (!slugRegex.test(trimmedSlug)) {
      clientFormatError = 'Slug must contain lowercase letters, numbers, and hyphens only.'
    }
  }

  // Compute effective status
  const slugStatus: 'idle' | 'checking' | 'available' | 'taken' | 'invalid' = !trimmedSlug
    ? 'idle'
    : isInitialEditSlug
      ? 'available'
      : clientFormatError
        ? 'invalid'
        : remoteSlugCheck.slug === trimmedSlug
          ? remoteSlugCheck.status
          : 'checking'

  const slugMessage: string | null = !trimmedSlug
    ? null
    : isInitialEditSlug
      ? 'Current category slug (Valid)'
      : clientFormatError
        ? clientFormatError
        : remoteSlugCheck.slug === trimmedSlug
          ? remoteSlugCheck.message
          : null

  // Debounced live API check for valid slugs
  useEffect(() => {
    if (!isOpen || !trimmedSlug || isInitialEditSlug || clientFormatError) return

    let ignore = false
    const timer = setTimeout(() => {
      checkCategorySlugAvailability(trimmedSlug)
        .then((result) => {
          if (!ignore) {
            if (result.available) {
              setRemoteSlugCheck({
                slug: trimmedSlug,
                status: 'available',
                message: 'Slug is available',
              })
            } else {
              setRemoteSlugCheck({
                slug: trimmedSlug,
                status: 'taken',
                message:
                  result.message || 'This slug is already taken. Please choose another.',
              })
            }
          }
        })
        .catch(() => {
          if (!ignore) {
            setRemoteSlugCheck({
              slug: trimmedSlug,
              status: 'invalid',
              message: 'Unable to check slug. Verify server connection.',
            })
          }
        })
    }, 350)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [trimmedSlug, isOpen, isInitialEditSlug, clientFormatError])

  if (!isOpen) return null

  const handleNameChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug,
      seoTitle: `${val} | Nexa Store`,
    }))
    if (error) setError(null)
  }

  const handleAutoSlug = () => {
    const autoSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({ ...prev, slug: autoSlug }))
    if (error) setError(null)
  }

  const handleSlugInputChange = (raw: string) => {
    const sanitized = raw.toLowerCase().replace(/\s+/g, '-')
    setFormData((prev) => ({ ...prev, slug: sanitized }))
    if (error) setError(null)
  }

  const handleSubmit = async (status: 'active' | 'draft') => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Category Name is required (minimum 2 characters).')
      return
    }
    if (!trimmedSlug || trimmedSlug.length < 2) {
      setError('Category Slug is required (minimum 2 characters).')
      return
    }
    if (slugStatus === 'taken') {
      setError('The chosen slug is already taken. Please pick another slug before saving.')
      return
    }
    if (slugStatus === 'invalid') {
      setError(slugMessage || 'Slug format is invalid. Lowercase letters, numbers & hyphens only.')
      return
    }
    if (slugStatus === 'checking') {
      setError('Please wait for the slug availability check to finish.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        ...formData,
        slug: trimmedSlug,
        status,
      })
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; errors?: string[] } }
      }
      const msg =
        axiosErr.response?.data?.errors?.[0] ||
        axiosErr.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to save category')
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/60">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between shrink-0 border-b border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <FolderTree className="text-primary w-5 h-5" />
              <h2 className="text-lg font-semibold text-on-surface">
                {editItem ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Create a root category or sub-category to organize store products and power taxonomy filters.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm flex items-center gap-2 border border-red-200 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* General Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Wearables"
                disabled={isSubmitting}
                className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Parent Category (Level)
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                disabled={isSubmitting}
                className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <option value="">None (Root Parent Level)</option>
                {existingRootCategories
                  .filter((root) => !editItem || root.id !== editItem.id)
                  .map((root) => (
                    <option key={root.id} value={root.id}>
                      Subcategory of: {root.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* URL Slug Generator & Real-time Check */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span>Storefront URL Slug</span>
                <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAutoSlug}
                disabled={isSubmitting}
                className="text-primary hover:underline cursor-pointer text-xs font-semibold disabled:opacity-50"
              >
                Auto-generate from Name
              </button>
            </div>

            <div
              className={`flex items-center rounded-lg bg-surface-container-low px-3 py-2 text-on-surface text-sm border transition-colors ${
                slugStatus === 'available'
                  ? 'border-emerald-400 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'
                  : slugStatus === 'taken' || slugStatus === 'invalid'
                    ? 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200'
                    : 'border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <span className="text-on-surface-variant select-none font-mono text-xs">
                /category/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugInputChange(e.target.value)}
                placeholder="e.g. smart-wearables"
                disabled={isSubmitting}
                className="bg-transparent text-primary font-semibold focus:outline-none flex-1 ml-1 font-mono text-sm disabled:opacity-50"
              />

              {/* Status Indicator Icon & Pill */}
              {slugStatus === 'checking' && (
                <span className="shrink-0 flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="hidden sm:inline">Checking...</span>
                </span>
              )}
              {slugStatus === 'available' && (
                <span className="shrink-0 flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Available</span>
                </span>
              )}
              {(slugStatus === 'taken' || slugStatus === 'invalid') && (
                <span className="shrink-0 flex items-center gap-1 text-xs text-red-700 font-semibold bg-red-100/70 px-2 py-0.5 rounded">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden sm:inline">
                    {slugStatus === 'taken' ? 'Already Taken' : 'Invalid'}
                  </span>
                </span>
              )}
            </div>

            {/* Detailed feedback text */}
            <div className="flex items-center justify-between text-xs mt-0.5">
              {slugStatus === 'available' && (
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{slugMessage || 'Slug is available for use'}</span>
                </span>
              )}
              {slugStatus === 'taken' && (
                <span className="text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {slugMessage || 'Slug is already in use. Please choose a different slug.'}
                  </span>
                </span>
              )}
              {slugStatus === 'invalid' && (
                <span className="text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {slugMessage ||
                      'Slug must contain lowercase letters, numbers, and hyphens only.'}
                  </span>
                </span>
              )}
              {slugStatus === 'checking' && (
                <span className="text-amber-600 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Verifying slug uniqueness with live database...</span>
                </span>
              )}
              {slugStatus === 'idle' && (
                <span className="text-on-surface-variant">
                  Used in storefront canonical URLs, breadcrumb navigation, and SEO tags.
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Category Description (Rich &amp; SEO)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a concise description of products in this category..."
              disabled={isSubmitting}
              className="p-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs resize-none disabled:opacity-50"
            />
          </div>

          {/* Media Uploader */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Category Icon &amp; Merchandising Banner
            </label>
            <div className="rounded-xl bg-surface-container-low p-4 flex flex-col sm:flex-row items-center gap-4 border border-outline-variant/60">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 flex items-center justify-center border border-outline-variant/60 shadow-xs">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary/40" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-on-surface">
                  {formData.imageFileName}
                </p>
                <p className="text-xs text-on-surface-variant mb-2">
                  {formData.imageSizeText}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-white text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container cursor-pointer border border-outline-variant/60 inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Asset</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: URL.createObjectURL(file),
                            imageFileName: file.name,
                            imageSizeText: `${Math.round(file.size / 1024)} KB • Uploaded`,
                          }))
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: '',
                        imageFileName: 'No image uploaded',
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer border border-transparent hover:border-red-200 inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isSubmitting || slugStatus === 'checking' || slugStatus === 'taken'}
              onClick={() => handleSubmit('draft')}
              className="h-10 px-4 rounded-lg bg-white text-on-surface text-sm font-semibold hover:bg-surface-container transition-all shadow-xs cursor-pointer border border-outline-variant/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting || slugStatus === 'checking' || slugStatus === 'taken'}
              onClick={() => handleSubmit('active')}
              className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>{editItem ? 'Save Changes' : 'Create & Publish Category'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
