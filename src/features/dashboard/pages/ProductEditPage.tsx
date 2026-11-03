import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { ConfirmationModal, type ConfirmationModalProps } from '@/components/ui'
import type { ProductFormData, VariantOptionItem, VariantCombination } from '../types/productForm'
import type { ProductStatus } from '../types/catalog'
import { mockCatalogProducts } from '../data/mockCatalogData'
import {
  defaultNewProductFormData,
  sampleAeroSoundFormData,
  buildFormDataFromCatalog,
} from '../data/defaultProductFormData'

type ConfirmModalState = Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null

import { ProductFormHeader } from '../components/product-form/ProductFormHeader'
import { GeneralInfoSection } from '../components/product-form/GeneralInfoSection'
import { MediaAssetsSection } from '../components/product-form/MediaAssetsSection'
import { PricingSection } from '../components/product-form/PricingSection'
import { InventorySection } from '../components/product-form/InventorySection'
import { VariantsSection } from '../components/product-form/VariantsSection'
import { ShippingSection } from '../components/product-form/ShippingSection'
import { PublishingStatusSidebar } from '../components/product-form/PublishingStatusSidebar'
import { TaxonomySidebar } from '../components/product-form/TaxonomySidebar'
import { PdpHighlightsSidebar } from '../components/product-form/PdpHighlightsSidebar'
import { ReadinessAuditSidebar } from '../components/product-form/ReadinessAuditSidebar'
import { StickySaveBar } from '../components/product-form/StickySaveBar'
import { PdpPreviewModal } from '../components/product-form/PdpPreviewModal'

function generateCombinations(
  colors: VariantOptionItem[],
  cares: VariantOptionItem[],
  basePrice: number,
  baseSku: string,
  existingVariants: VariantCombination[]
): VariantCombination[] {
  const existingMap = new Map(existingVariants.map((v) => [v.title, v]))
  const skuPrefix = baseSku || 'SKU'

  if (colors.length > 0 && cares.length > 0) {
    const list: VariantCombination[] = []
    for (const c of colors) {
      for (const w of cares) {
        const title = `${c.label} / ${w.label}`
        const existing = existingMap.get(title)
        if (existing) {
          list.push(existing)
        } else {
          const cCode = c.label.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')
          const wCode = w.label.substring(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, '')
          list.push({
            id: `v-${c.id}-${w.id}`,
            title,
            colorHex: c.colorHex,
            sku: `${skuPrefix}-${cCode}-${wCode}`,
            price: Math.round(((basePrice || 199) + (w.extraPrice || 0)) * 100) / 100,
            stock: 50,
            isActive: true,
          })
        }
      }
    }
    return list
  }

  if (colors.length > 0) {
    return colors.map((c) => {
      const existing = existingMap.get(c.label)
      if (existing) return existing
      const cCode = c.label.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')
      return {
        id: `v-${c.id}`,
        title: c.label,
        colorHex: c.colorHex,
        sku: `${skuPrefix}-${cCode}`,
        price: basePrice || 199,
        stock: 50,
        isActive: true,
      }
    })
  }

  if (cares.length > 0) {
    return cares.map((w) => {
      const existing = existingMap.get(w.label)
      if (existing) return existing
      const wCode = w.label.substring(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, '')
      return {
        id: `v-${w.id}`,
        title: w.label,
        sku: `${skuPrefix}-${wCode}`,
        price: Math.round(((basePrice || 199) + (w.extraPrice || 0)) * 100) / 100,
        stock: 50,
        isActive: true,
      }
    })
  }

  return []
}

export function ProductEditPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const isEditMode = Boolean(id && id !== 'new')

  // Initialize state based on mode
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (isEditMode) {
      const found = mockCatalogProducts.find((p) => p.id === id)
      if (found) {
        return buildFormDataFromCatalog(found)
      }
      return sampleAeroSoundFormData
    }
    return defaultNewProductFormData
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPdpModalOpen, setIsPdpModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModalState>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [lastSavedText, setLastSavedText] = useState('Last autosaved 1 minute ago')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Update field helper
  const updateForm = useCallback((updater: (prev: ProductFormData) => ProductFormData) => {
    setFormData((prev) => {
      const updated = updater(prev)
      return updated
    })
    setHasUnsavedChanges(true)
  }, [])

  // Auto-generate SKU
  const handleAutoGenerateSku = () => {
    const prefix = formData.brand.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'NX')
    const newSku = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`
    updateForm((prev) => ({ ...prev, sku: newSku }))
    showToast(`Generated SKU: ${newSku}`)
  }

  // Save as Draft
  const handleSaveDraft = useCallback(() => {
    setIsSaving(true)
    setTimeout(() => {
      updateForm((prev) => ({ ...prev, productStatus: 'draft' }))
      setHasUnsavedChanges(false)
      setIsSaving(false)
      setLastSavedText('Autosaved just now')
      showToast('Product draft saved successfully.')
    }, 400)
  }, [updateForm])

  // Publish / Save Changes with Mandatory Confirmation
  const handleSaveAndPublish = () => {
    if (!formData.title.trim()) {
      showToast('Please provide a Product Title before publishing.')
      return
    }

    setConfirmDialog({
      title: isEditMode ? 'Confirm Product Update' : 'Publish Product to Live Store',
      description: isEditMode
        ? `Are you sure you want to commit these updates to "${formData.title}"? Changes will be immediately reflected in storefront listings.`
        : `Publish "${formData.title}" to the live catalog? It will become active and purchasable across all assigned sales channels.`,
      confirmText: isEditMode ? 'Save & Update Product' : 'Publish to Storefront',
      variant: 'primary',
      icon: 'check',
      badgeText: 'Publishing Gate',
      itemDetails: [
        { label: 'Product Title', value: formData.title },
        { label: 'SKU Identifier', value: formData.sku || 'Auto-generated' },
        { label: 'Category', value: formData.category },
        { label: 'Base MSRP', value: `$${formData.basePrice.toFixed(2)}` },
        { label: 'Target State', value: 'Active / Published' },
      ],
      onConfirm: () => {
        setConfirmDialog(null)
        setIsSaving(true)
        setTimeout(() => {
          updateForm((prev) => ({ ...prev, productStatus: 'published' }))
          setHasUnsavedChanges(false)
          setIsSaving(false)
          showToast(isEditMode ? 'Product changes saved successfully!' : 'Product published to store!')
          setTimeout(() => {
            navigate('/admin/products')
          }, 1000)
        }, 400)
      },
    })
  }

  // Discard action with Confirmation
  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      setConfirmDialog({
        title: 'Discard Unsaved Changes?',
        description: 'You have unsaved edits in this product. Leaving now will discard all your recent modifications.',
        confirmText: 'Discard Changes',
        cancelText: 'Continue Editing',
        variant: 'warning',
        icon: 'alert',
        badgeText: 'Unsaved Edits',
        onConfirm: () => {
          setConfirmDialog(null)
          navigate('/admin/products')
        },
      })
      return
    }
    navigate('/admin/products')
  }

  // Lifecycle status change confirmation
  const handleStatusChange = (newStatus: ProductStatus) => {
    if (newStatus === 'archived') {
      setConfirmDialog({
        title: 'Archive This Product?',
        description: `Moving "${formData.title}" to Archived will delist it from all active storefronts and search results. You can restore it anytime.`,
        confirmText: 'Archive Product',
        variant: 'warning',
        icon: 'archive',
        badgeText: 'Lifecycle Change',
        itemDetails: [
          { label: 'Product Title', value: formData.title },
          { label: 'Current State', value: formData.productStatus },
          { label: 'Target State', value: 'Archived' },
        ],
        onConfirm: () => {
          updateForm((prev) => ({ ...prev, productStatus: 'archived' }))
          setConfirmDialog(null)
          showToast('Product status updated to Archived.')
        },
      })
      return
    }

    if (newStatus === 'unpublished') {
      setConfirmDialog({
        title: 'Unpublish Product?',
        description: `Delist "${formData.title}" from storefronts? Customers will no longer be able to view or purchase this item.`,
        confirmText: 'Unpublish Product',
        variant: 'warning',
        icon: 'pause',
        badgeText: 'Visibility Change',
        itemDetails: [
          { label: 'Product Title', value: formData.title },
          { label: 'Target State', value: 'Unpublished' },
        ],
        onConfirm: () => {
          updateForm((prev) => ({ ...prev, productStatus: 'unpublished' }))
          setConfirmDialog(null)
          showToast('Product status updated to Unpublished.')
        },
      })
      return
    }

    updateForm((prev) => ({ ...prev, productStatus: newStatus }))
  }

  // Keyboard shortcut listener (Cmd+S / Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSaveDraft()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSaveDraft])

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white shadow-2xl flex items-center gap-2 text-sm animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Command Sticky Bar */}
      <ProductFormHeader
        isEditMode={isEditMode}
        title={formData.title}
        productStatus={formData.productStatus}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onPreviewPdp={() => setIsPdpModalOpen(true)}
        onPublish={handleSaveAndPublish}
        isSaving={isSaving}
      />

      {/* Main Grid (8-col content + 4-col sidebar) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-16">
        {/* LEFT COLUMN: Specifications Engine (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* 1. General Information */}
          <GeneralInfoSection
            title={formData.title}
            slug={formData.slug}
            subtitle={formData.subtitle}
            descriptionHtml={formData.descriptionHtml}
            onTitleChange={(val) => updateForm((prev) => ({ ...prev, title: val }))}
            onSlugChange={(val) => updateForm((prev) => ({ ...prev, slug: val }))}
            onSubtitleChange={(val) => updateForm((prev) => ({ ...prev, subtitle: val }))}
            onDescriptionChange={(val) => updateForm((prev) => ({ ...prev, descriptionHtml: val }))}
          />

          {/* 2. Media & Visual Assets */}
          <MediaAssetsSection
            mediaItems={formData.mediaItems}
            videoUrl={formData.videoUrl}
            has3dAsset={formData.has3dAsset}
            onAddMedia={(item) =>
              updateForm((prev) => ({ ...prev, mediaItems: [...prev.mediaItems, item] }))
            }
            onRemoveMedia={(id) =>
              updateForm((prev) => ({
                ...prev,
                mediaItems: prev.mediaItems.filter((m) => m.id !== id),
              }))
            }
            onSetPrimary={(id) =>
              updateForm((prev) => ({
                ...prev,
                mediaItems: prev.mediaItems.map((m) => ({ ...m, isPrimary: m.id === id })),
              }))
            }
            onVideoUrlChange={(url) => updateForm((prev) => ({ ...prev, videoUrl: url }))}
          />

          {/* 3. Pricing & Margins */}
          <PricingSection
            basePrice={formData.basePrice}
            comparePrice={formData.comparePrice}
            costPrice={formData.costPrice}
            chargeTax={formData.chargeTax}
            taxProfile={formData.taxProfile}
            onBasePriceChange={(val) => updateForm((prev) => ({ ...prev, basePrice: val }))}
            onComparePriceChange={(val) => updateForm((prev) => ({ ...prev, comparePrice: val }))}
            onCostPriceChange={(val) => updateForm((prev) => ({ ...prev, costPrice: val }))}
            onChargeTaxChange={(val) => updateForm((prev) => ({ ...prev, chargeTax: val }))}
            onTaxProfileChange={(val) => updateForm((prev) => ({ ...prev, taxProfile: val }))}
          />

          {/* 4. Inventory & Stock */}
          <InventorySection
            sku={formData.sku}
            barcode={formData.barcode}
            stockCount={formData.stockCount}
            lowStockThreshold={formData.lowStockThreshold}
            outOfStockPolicy={formData.outOfStockPolicy}
            onSkuChange={(val) => updateForm((prev) => ({ ...prev, sku: val }))}
            onBarcodeChange={(val) => updateForm((prev) => ({ ...prev, barcode: val }))}
            onStockCountChange={(stockCount) =>
              updateForm((prev) => ({ ...prev, stockCount }))
            }
            onThresholdChange={(val) => updateForm((prev) => ({ ...prev, lowStockThreshold: val }))}
            onPolicyChange={(policy) => updateForm((prev) => ({ ...prev, outOfStockPolicy: policy }))}
            onAutoGenerateSku={handleAutoGenerateSku}
          />

          {/* 5. Variants & Options */}
          <VariantsSection
            hasVariants={formData.hasVariants}
            colorOptions={formData.colorOptions}
            careOptions={formData.careOptions}
            variants={formData.variants}
            basePrice={formData.basePrice}
            baseSku={formData.sku}
            onToggleHasVariants={(val) => {
              updateForm((prev) => {
                if (val && prev.variants.length === 0 && prev.colorOptions.length === 0) {
                  const initialColors: VariantOptionItem[] = [
                    { id: 'c-1', label: 'Midnight Black', colorHex: '#0f172a' },
                    { id: 'c-2', label: 'Matte Silver', colorHex: '#cbd5e1' },
                    { id: 'c-3', label: 'Navy Blue', colorHex: '#1e3a8a' },
                  ]
                  const initialCares: VariantOptionItem[] = [
                    { id: 'w-1', label: 'Standard 1-Year', extraPrice: 0 },
                    { id: 'w-2', label: 'NexaCare+ 2-Year', extraPrice: 29 },
                  ]
                  const newVariants = generateCombinations(
                    initialColors,
                    initialCares,
                    prev.basePrice || 199,
                    prev.sku || 'SKU',
                    []
                  )
                  return {
                    ...prev,
                    hasVariants: true,
                    colorOptions: initialColors,
                    careOptions: initialCares,
                    variants: newVariants,
                  }
                }
                return { ...prev, hasVariants: val }
              })
            }}
            onRemoveColor={(id) =>
              updateForm((prev) => {
                const updatedColors = prev.colorOptions.filter((c) => c.id !== id)
                const newVariants = generateCombinations(
                  updatedColors,
                  prev.careOptions,
                  prev.basePrice,
                  prev.sku,
                  prev.variants
                )
                return {
                  ...prev,
                  colorOptions: updatedColors,
                  variants: newVariants,
                }
              })
            }
            onAddColor={(label, colorHex) =>
              updateForm((prev) => {
                const newOpt: VariantOptionItem = { id: `c-${Date.now()}`, label, colorHex }
                const updatedColors = [...prev.colorOptions, newOpt]
                const newVariants = generateCombinations(
                  updatedColors,
                  prev.careOptions,
                  prev.basePrice,
                  prev.sku,
                  prev.variants
                )
                return {
                  ...prev,
                  colorOptions: updatedColors,
                  variants: newVariants,
                }
              })
            }
            onRemoveCare={(id) =>
              updateForm((prev) => {
                const updatedCares = prev.careOptions.filter((c) => c.id !== id)
                const newVariants = generateCombinations(
                  prev.colorOptions,
                  updatedCares,
                  prev.basePrice,
                  prev.sku,
                  prev.variants
                )
                return {
                  ...prev,
                  careOptions: updatedCares,
                  variants: newVariants,
                }
              })
            }
            onAddCare={(label, extraPrice) =>
              updateForm((prev) => {
                const newCare: VariantOptionItem = { id: `w-${Date.now()}`, label, extraPrice }
                const updatedCares = [...prev.careOptions, newCare]
                const newVariants = generateCombinations(
                  prev.colorOptions,
                  updatedCares,
                  prev.basePrice,
                  prev.sku,
                  prev.variants
                )
                return {
                  ...prev,
                  careOptions: updatedCares,
                  variants: newVariants,
                }
              })
            }
            onVariantStockChange={(vId, stock) =>
              updateForm((prev) => ({
                ...prev,
                variants: prev.variants.map((v) => (v.id === vId ? { ...v, stock } : v)),
              }))
            }
            onVariantPriceChange={(vId, price) =>
              updateForm((prev) => ({
                ...prev,
                variants: prev.variants.map((v) => (v.id === vId ? { ...v, price } : v)),
              }))
            }
            onToggleVariantActive={(vId) =>
              updateForm((prev) => ({
                ...prev,
                variants: prev.variants.map((v) =>
                  v.id === vId ? { ...v, isActive: !v.isActive } : v
                ),
              }))
            }
            onRemoveVariant={(vId) =>
              updateForm((prev) => ({
                ...prev,
                variants: prev.variants.filter((v) => v.id !== vId),
              }))
            }
            onAddCustomVariant={(variant) =>
              updateForm((prev) => ({
                ...prev,
                variants: [...prev.variants, variant],
              }))
            }
            onLoadPresetVariants={() => {
              const initialColors: VariantOptionItem[] = [
                { id: 'c-1', label: 'Midnight Black', colorHex: '#0f172a' },
                { id: 'c-2', label: 'Matte Silver', colorHex: '#cbd5e1' },
                { id: 'c-3', label: 'Navy Blue', colorHex: '#1e3a8a' },
              ]
              const initialCares: VariantOptionItem[] = [
                { id: 'w-1', label: 'Standard 1-Year', extraPrice: 0 },
                { id: 'w-2', label: 'NexaCare+ 2-Year', extraPrice: 29 },
              ]
              updateForm((prev) => ({
                ...prev,
                hasVariants: true,
                colorOptions: initialColors,
                careOptions: initialCares,
                variants: generateCombinations(
                  initialColors,
                  initialCares,
                  prev.basePrice || 199,
                  prev.sku || 'SKU',
                  []
                ),
              }))
              showToast('Loaded recommended variant combinations!')
            }}
          />

          {/* 6. Shipping & Fulfillment */}
          <ShippingSection
            weight={formData.weight}
            weightUnit={formData.weightUnit}
            length={formData.length}
            width={formData.width}
            height={formData.height}
            dimensionUnit={formData.dimensionUnit}
            hsCode={formData.hsCode}
            shippingProfile={formData.shippingProfile}
            onWeightChange={(val) => updateForm((prev) => ({ ...prev, weight: val }))}
            onWeightUnitChange={(unit) => updateForm((prev) => ({ ...prev, weightUnit: unit }))}
            onLengthChange={(val) => updateForm((prev) => ({ ...prev, length: val }))}
            onWidthChange={(val) => updateForm((prev) => ({ ...prev, width: val }))}
            onHeightChange={(val) => updateForm((prev) => ({ ...prev, height: val }))}
            onHsCodeChange={(code) => updateForm((prev) => ({ ...prev, hsCode: code }))}
            onShippingProfileChange={(prof) =>
              updateForm((prev) => ({ ...prev, shippingProfile: prof }))
            }
          />
        </div>

        {/* RIGHT COLUMN: Settings & Audit (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* 1. Publishing Status */}
          <PublishingStatusSidebar
            productStatus={formData.productStatus}
            cornerRibbon={formData.cornerRibbon}
            onStatusChange={handleStatusChange}
            onRibbonChange={(ribbon) => updateForm((prev) => ({ ...prev, cornerRibbon: ribbon }))}
          />

          {/* 2. Taxonomy & Classification */}
          <TaxonomySidebar
            category={formData.category}
            brand={formData.brand}
            collections={formData.collections}
            tags={formData.tags}
            onCategoryChange={(cat) => updateForm((prev) => ({ ...prev, category: cat }))}
            onBrandChange={(brand) => updateForm((prev) => ({ ...prev, brand }))}
            onToggleCollection={(col) =>
              updateForm((prev) => ({
                ...prev,
                collections: prev.collections.includes(col)
                  ? prev.collections.filter((c) => c !== col)
                  : [...prev.collections, col],
              }))
            }
            onAddTag={(tag) =>
              updateForm((prev) =>
                prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] }
              )
            }
            onRemoveTag={(tag) =>
              updateForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
            }
          />

          {/* 3. PDP Customer Highlights */}
          <PdpHighlightsSidebar
            highlights={formData.customerHighlights}
            allowPhotoReviews={formData.allowPhotoReviews}
            featureInSpotlight={formData.featureInSpotlight}
            onAddHighlight={() =>
              updateForm((prev) => ({
                ...prev,
                customerHighlights: [...prev.customerHighlights, 'New high-impact feature bullet'],
              }))
            }
            onUpdateHighlight={(idx, val) =>
              updateForm((prev) => ({
                ...prev,
                customerHighlights: prev.customerHighlights.map((h, i) => (i === idx ? val : h)),
              }))
            }
            onRemoveHighlight={(idx) =>
              updateForm((prev) => ({
                ...prev,
                customerHighlights: prev.customerHighlights.filter((_, i) => i !== idx),
              }))
            }
            onTogglePhotoReviews={(val) =>
              updateForm((prev) => ({ ...prev, allowPhotoReviews: val }))
            }
            onToggleSpotlight={(val) =>
              updateForm((prev) => ({ ...prev, featureInSpotlight: val }))
            }
          />

          {/* 4. Real-Time Audit & Readiness Widget */}
          <ReadinessAuditSidebar formData={formData} />
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <StickySaveBar
        isEditMode={isEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedText={lastSavedText}
        onSaveDraft={handleSaveDraft}
        onSave={handleSaveAndPublish}
        isSaving={isSaving}
      />

      {/* Interactive PDP Modal Preview */}
      <PdpPreviewModal
        isOpen={isPdpModalOpen}
        onClose={() => setIsPdpModalOpen(false)}
        formData={formData}
      />

      {/* Confirmation Modal for Destructive / State Changes */}
      {confirmDialog && (
        <ConfirmationModal
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          {...confirmDialog}
        />
      )}
    </div>
  )
}

