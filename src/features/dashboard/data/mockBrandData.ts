import type { BrandItem, BrandFormData, BrandMetrics } from '../types/brand'

export const INITIAL_MOCK_BRANDS: BrandItem[] = [
  {
    id: 'brand-nexa-01',
    name: 'Nexa Audio Labs (Internal)',
    slug: 'nexa-audio-labs',
    logoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://nexastore.com',
    description: 'In-house precision audio hardware engineered with ultra-low latency acoustic architecture.',
    status: 'active',
    productCount: 14,
    isInternal: true,
    country: 'United States',
    contactEmail: 'hardware@nexastore.com',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2026-03-12T14:30:00Z',
  },
  {
    id: 'brand-aerosound-02',
    name: 'AeroSound',
    slug: 'aerosound',
    logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://aerosound.audio',
    description: 'Studio-grade wireless monitors, noise-canceling headsets, and precision desktop amplifiers.',
    status: 'active',
    productCount: 9,
    isInternal: false,
    country: 'Germany',
    contactEmail: 'contact@aerosound.audio',
    createdAt: '2025-02-15T11:20:00Z',
    updatedAt: '2026-03-20T09:15:00Z',
  },
  {
    id: 'brand-sony-03',
    name: 'Sony Master Audio',
    slug: 'sony-master-audio',
    logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://pro.sony',
    description: 'Industry-standard LDAC codecs, premium noise-cancelling headphones, and reference DAC units.',
    status: 'active',
    productCount: 22,
    isInternal: false,
    country: 'Japan',
    contactEmail: 'pro-audio@sony.jp',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2026-04-01T16:45:00Z',
  },
  {
    id: 'brand-sennheiser-04',
    name: 'Sennheiser Pro',
    slug: 'sennheiser-pro',
    logoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://sennheiser.com',
    description: 'Precision German transducers, open-back studio reference cans, and broadcast microphones.',
    status: 'active',
    productCount: 18,
    isInternal: false,
    country: 'Germany',
    contactEmail: 'b2b@sennheiser.de',
    createdAt: '2025-02-01T09:30:00Z',
    updatedAt: '2026-04-10T11:00:00Z',
  },
  {
    id: 'brand-bose-05',
    name: 'Bose Commercial',
    slug: 'bose-commercial',
    logoUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://bose.com',
    description: 'Enterprise sound management, acoustic noise cancelling, and conference room arrays.',
    status: 'active',
    productCount: 11,
    isInternal: false,
    country: 'United States',
    contactEmail: 'commercial@bose.com',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
  },
  {
    id: 'brand-deskpower-06',
    name: 'DeskPower',
    slug: 'deskpower',
    logoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://deskpower.workspace',
    description: 'High-wattage GaN charging stations, magnetic desk pads, and cable routing architecture.',
    status: 'active',
    productCount: 6,
    isInternal: false,
    country: 'Taiwan',
    contactEmail: 'sales@deskpower.io',
    createdAt: '2025-03-15T08:45:00Z',
    updatedAt: '2026-04-05T13:20:00Z',
  },
  {
    id: 'brand-castclay-07',
    name: 'Cast & Clay',
    slug: 'cast-and-clay',
    logoUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=120&auto=format&fit=crop&q=80',
    websiteUrl: 'https://castandclay.design',
    description: 'Artisan ceramic desk organizers, acoustic acoustic baffles, and handcrafted studio accessories.',
    status: 'inactive',
    productCount: 4,
    isInternal: false,
    country: 'United Kingdom',
    contactEmail: 'studio@castandclay.co.uk',
    createdAt: '2025-04-01T14:10:00Z',
    updatedAt: '2026-04-08T17:30:00Z',
  },
]

export const defaultBrandFormData: BrandFormData = {
  name: '',
  slug: '',
  logoUrl: '',
  websiteUrl: '',
  description: '',
  status: 'active',
  isInternal: false,
  country: 'United States',
  contactEmail: '',
}

const BRANDS_STORAGE_KEY = 'nexa_admin_brands_data'

export function loadBrandsFromStorage(): BrandItem[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_BRANDS
  try {
    const raw = localStorage.getItem(BRANDS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BRANDS))
      return INITIAL_MOCK_BRANDS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_BRANDS
  } catch (err) {
    console.warn('Failed to parse brands from localStorage, fallback to initial', err)
    return INITIAL_MOCK_BRANDS
  }
}

export function saveBrandsToStorage(brands: BrandItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands))
  } catch (err) {
    console.error('Failed to save brands to localStorage', err)
  }
}

export function calculateBrandMetrics(brands: BrandItem[]): BrandMetrics {
  const totalBrands = brands.length
  const activeBrands = brands.filter((b) => b.status === 'active').length
  const internalBrands = brands.filter((b) => b.isInternal).length
  const totalProductsAssigned = brands.reduce((acc, b) => acc + (b.productCount || 0), 0)

  return {
    totalBrands,
    activeBrands,
    internalBrands,
    totalProductsAssigned,
  }
}

