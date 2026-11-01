import { useState, useEffect } from 'react'
import type { CategoryFormData, CategoryItem } from '../../types/category'
import { defaultCategoryFormData } from '../../data/mockCategoryData'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: CategoryFormData) => void
  editItem?: CategoryItem | null
  parentItem?: CategoryItem | null
  existingRootCategories: CategoryItem[]
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editItem,
  parentItem,
  existingRootCategories,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(defaultCategoryFormData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editItem) {
      setFormData({
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
      })
    } else if (parentItem) {
      setFormData({
        ...defaultCategoryFormData,
        parentId: parentItem.id,
        displayOrder: 1,
      })
    } else {
      setFormData(defaultCategoryFormData)
    }
    setError(null)
  }, [editItem, parentItem, isOpen])

  if (!isOpen) return null

  const handleNameChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug,
      seoTitle: `${val} | Nexa Store`,
    }))
    if (error) setError(null)
  }

  const handleAutoSlug = () => {
    const autoSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setFormData((prev) => ({ ...prev, slug: autoSlug }))
  }

  const handleSubmit = (status: 'active' | 'draft') => {
    if (!formData.name.trim()) {
      setError('Category Name is required.')
      return
    }
    onSave({
      ...formData,
      status,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md md:p-space-lg bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        {/* Modal Header */}
        <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between flex-shrink-0 border-b border-outline-variant/15">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">category</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {editItem ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Create a root category or sub-category to organize store products and power taxonomy filters.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg overflow-y-auto flex flex-col gap-space-lg">
          {error && (
            <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* General Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
                Category Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Wearables"
                className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
                Parent Category (Level)
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-outline-variant/20 cursor-pointer"
              >
                <option value="">None (Root Parent Level)</option>
                {existingRootCategories.map((root) => (
                  <option key={root.id} value={root.id}>
                    Subcategory of: {root.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL Slug Generator */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
                Storefront URL Slug
              </label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-secondary hover:underline cursor-pointer lowercase font-body-sm text-xs font-semibold"
              >
                Auto-generate
              </button>
            </div>
            <div className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 text-on-surface font-body-sm text-body-sm border border-outline-variant/20">
              <span className="text-on-surface-variant select-none">nexa-store.com/category/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="bg-transparent text-primary font-semibold focus:outline-none flex-1 ml-0.5 font-mono"
              />
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Used in breadcrumb routing, canonical links, and storefront SEO indexation.
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
              Category Description (Rich &amp; SEO)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a concise description..."
              className="p-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
            />
          </div>

          {/* Media Uploader */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
              Category Icon &amp; Merchandising Banner
            </label>
            <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col sm:flex-row items-center gap-space-md border border-outline-variant/20">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high flex-shrink-0 flex items-center justify-center border border-outline-variant/20 shadow-xs">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[32px] text-primary">image</span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                  {formData.imageFileName}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs text-xs">
                  {formData.imageSizeText}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-space-xs">
                  <label className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-xs hover:bg-surface-container cursor-pointer border border-outline-variant/20">
                    Replace Asset
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
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
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: '',
                        imageFileName: 'No image uploaded',
                      }))
                    }
                    className="px-space-sm py-1 rounded text-error hover:bg-error-container/20 font-body-sm text-body-sm cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm flex-shrink-0 border-t border-outline-variant/15">
          <button
            type="button"
            onClick={onClose}
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface px-space-md py-2 rounded-lg cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="h-10 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-container transition-all shadow-xs cursor-pointer border border-outline-variant/20"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('active')}
              className="h-10 px-space-md rounded-lg bg-primary-container text-on-primary font-body-md text-body-md font-semibold hover:bg-secondary transition-all shadow-sm cursor-pointer active:scale-95"
            >
              {editItem ? 'Save Changes' : 'Create & Publish Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

