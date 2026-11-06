import type { CollectionItem, CollectionFormData, CollectionMetrics } from '../types/collection'

export const INITIAL_MOCK_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-home-grid-01',
    title: 'Featured Highlights (Home Grid)',
    slug: 'featured-highlights-home-grid',
    description: 'Hero tier flagship hardware showcased directly on the homepage hero matrix and spotlight carousel.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    productCount: 8,
    productIds: ['101', '102', '103', '104', '105', '106', '107', '108'],
    displayLocation: 'Home Grid',
    isFeatured: true,
    rulesType: 'manual',
    badgeText: 'FEATURED 2026',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'col-bestsellers-02',
    title: 'Best Sellers 2025',
    slug: 'best-sellers-2025',
    description: 'Top velocity SKUs with highest conversion rates, customer ratings above 4.8 stars, and verified reviews.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    productCount: 6,
    productIds: ['201', '202', '203', '204', '101', '102'],
    displayLocation: 'Storefront Catalog',
    isFeatured: true,
    rulesType: 'smart_automated',
    badgeText: 'TOP VELOCITY',
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2026-04-14T15:20:00Z',
  },
  {
    id: 'col-audio-arch-03',
    title: 'Audio Architecture Showcase',
    slug: 'audio-architecture-showcase',
    description: 'Audiophile reference gear featuring balanced planar drivers, high impedance open-back enclosures, and DACs.',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    productCount: 4,
    productIds: ['101', '105', '201', '202'],
    displayLocation: 'Banner',
    isFeatured: false,
    rulesType: 'manual',
    badgeText: 'AUDIOPHILE',
    createdAt: '2025-02-10T09:30:00Z',
    updatedAt: '2026-04-11T11:45:00Z',
  },
  {
    id: 'col-clearance-04',
    title: 'Clearance Vault',
    slug: 'clearance-vault',
    description: 'Previous-generation hardware, end-of-batch refurbished units, and exclusive promotional outlet discounts.',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    productCount: 3,
    productIds: ['107', '108', '204'],
    displayLocation: 'Sidebar',
    isFeatured: false,
    rulesType: 'manual',
    badgeText: 'LIMITED RUN',
    createdAt: '2025-03-01T14:15:00Z',
    updatedAt: '2026-04-09T18:00:00Z',
  },
  {
    id: 'col-studio-essentials-05',
    title: 'New Studio Essentials',
    slug: 'new-studio-essentials',
    description: 'Curated workflow packages combining acoustic isolation pads, desk power rails, and balanced cables.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    status: 'scheduled',
    productCount: 3,
    productIds: ['106', '105', '102'],
    displayLocation: 'Storefront Catalog',
    isFeatured: false,
    rulesType: 'smart_automated',
    badgeText: 'COMING SOON',
    createdAt: '2025-03-20T16:00:00Z',
    updatedAt: '2026-04-05T09:10:00Z',
  },
  {
    id: 'col-wireless-pro-06',
    title: 'Wireless Pro Series',
    slug: 'wireless-pro-series',
    description: 'Low-latency aptX Lossless and multipoint Bluetooth hardware for seamless mobile-to-workstation handoff.',
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
    status: 'draft',
    productCount: 2,
    productIds: ['101', '201'],
    displayLocation: 'Home Grid',
    isFeatured: false,
    rulesType: 'manual',
    badgeText: 'DRAFT',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2026-04-08T12:00:00Z',
  },
]

export const defaultCollectionFormData: CollectionFormData = {
  title: '',
  slug: '',
  description: '',
  imageUrl: '',
  status: 'active',
  displayLocation: 'Storefront Catalog',
  isFeatured: false,
  rulesType: 'manual',
  badgeText: '',
}

const COLLECTIONS_STORAGE_KEY = 'nexa_admin_collections_data'

export function loadCollectionsFromStorage(): CollectionItem[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_COLLECTIONS
  try {
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_COLLECTIONS))
      return INITIAL_MOCK_COLLECTIONS
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_MOCK_COLLECTIONS
    }
    // Ensure all collections have productIds array synced with productCount
    return parsed.map((col: CollectionItem) => {
      const match = INITIAL_MOCK_COLLECTIONS.find((m) => m.id === col.id)
      const productIds = Array.isArray(col.productIds)
        ? col.productIds
        : match?.productIds || []
      return {
        ...col,
        productIds,
        productCount: productIds.length > 0 ? productIds.length : (col.productCount || 0),
      }
    })
  } catch (err) {
    console.warn('Failed to parse collections from localStorage, fallback to initial', err)
    return INITIAL_MOCK_COLLECTIONS
  }
}

export function saveCollectionsToStorage(collections: CollectionItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
  } catch (err) {
    console.error('Failed to save collections to localStorage', err)
  }
}

export function calculateCollectionMetrics(collections: CollectionItem[]): CollectionMetrics {
  const totalCollections = collections.length
  const activeCollections = collections.filter((c) => c.status === 'active').length
  const featuredCount = collections.filter((c) => c.isFeatured).length
  const curatedProductsCount = collections.reduce((acc, c) => acc + (c.productCount || 0), 0)

  return {
    totalCollections,
    activeCollections,
    featuredCount,
    curatedProductsCount,
  }
}

