import type { ProductStatus } from './catalog'

export interface ProductMediaItem {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  file?: File   // actual File object for upload; absent for existing/remote media
}

export interface WarehouseAllocation {
  id: string
  facilityName: string
  committed: number
  available: number
}

export interface VariantOptionItem {
  id: string
  label: string
  colorHex?: string
  extraPrice?: number
}

export interface VariantCombination {
  id: string
  title: string
  colorHex?: string
  sku: string
  price: number
  stock: number
  isActive: boolean
}

export interface ProductFormData {
  id?: string
  title: string
  slug: string
  subtitle: string
  descriptionHtml: string
  mediaItems: ProductMediaItem[]
  videoUrl: string
  has3dAsset: boolean
  basePrice: number
  comparePrice: number
  costPrice: number
  chargeTax: boolean
  taxProfile: string
  sku: string
  barcode: string
  stockCount: number
  warehouses?: WarehouseAllocation[]
  lowStockThreshold: number
  outOfStockPolicy: 'stop_selling' | 'accept_backorders'
  hasVariants: boolean
  colorOptions: VariantOptionItem[]
  careOptions: VariantOptionItem[]
  variants: VariantCombination[]
  weight: number
  weightUnit: 'g' | 'oz' | 'lb'
  length: number
  width: number
  height: number
  dimensionUnit: 'cm' | 'in'
  hsCode: string
  shippingProfile: string
  productStatus: ProductStatus
  salesChannels: {
    web: boolean
    mobile: boolean
    googleShopping: boolean
    b2b: boolean
  }
  cornerRibbon: 'BESTSELLER' | 'NEW ARRIVAL' | '20% OFF' | 'STAFF PICK' | 'None'
  categoryId?: string
  category: string
  brand: string
  collections: string[]
  tags: string[]
  customerHighlights: string[]
  allowPhotoReviews: boolean
  featureInSpotlight: boolean
}

