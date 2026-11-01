import type { ProductFormData } from '../types/productForm'
import type { CatalogProduct } from '../types/catalog'

export const defaultNewProductFormData: ProductFormData = {
  title: '',
  slug: '',
  subtitle: '',
  descriptionHtml: '<p>Provide detailed specifications and features for this product.</p>',
  mediaItems: [],
  videoUrl: '',
  has3dAsset: false,
  basePrice: 0,
  comparePrice: 0,
  costPrice: 0,
  chargeTax: true,
  taxProfile: 'Standard Consumer Goods (8.25%)',
  sku: `NX-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
  barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
  stockCount: 0,
  warehouses: [
    { id: 'wh-1', facilityName: 'Central Hub (Austin, TX)', committed: 0, available: 0 },
    { id: 'wh-2', facilityName: 'West Coast Depot (Reno, NV)', committed: 0, available: 0 },
  ],
  lowStockThreshold: 10,
  outOfStockPolicy: 'stop_selling',
  hasVariants: false,
  colorOptions: [],
  careOptions: [],
  variants: [],
  weight: 300,
  weightUnit: 'g',
  length: 20,
  width: 15,
  height: 8,
  dimensionUnit: 'cm',
  hsCode: '8518.30.2000',
  shippingProfile: 'Standard Fragile Electronics (Insured 2-Day)',
  productStatus: 'draft',
  salesChannels: {
    web: true,
    mobile: true,
    googleShopping: true,
    b2b: false,
  },
  cornerRibbon: 'None',
  category: 'Electronics & Audio',
  brand: 'Nexa Audio Labs (Internal)',
  collections: ['Featured Highlights (Home Grid)'],
  tags: ['gadget', 'new'],
  customerHighlights: [
    'Premium build quality with warranty support',
    'Fast fulfillment & tracked nationwide dispatch',
  ],
  allowPhotoReviews: true,
  featureInSpotlight: false,
}

export const sampleAeroSoundFormData: ProductFormData = {
  id: 'prod-nx-aud-9420',
  title: 'AeroSound Studio Wireless Headphones Pro',
  slug: 'aerosound-studio-wireless-headphones-pro',
  subtitle: 'Flagship over-ear hybrid active noise cancelling headphones with 60h battery life',
  descriptionHtml: `<p>Immerse yourself in precision-tuned acoustics with the <strong>AeroSound Studio Wireless Pro</strong>. Engineered with dual custom-milled 40mm titanium diaphragm drivers, our proprietary hybrid noise-cancellation engine suppresses up to 42dB of environmental distractions.</p>
<p class="font-semibold text-on-surface mt-1">Key Package Highlights:</p>
<ul class="list-disc pl-5 text-on-surface-variant flex flex-col gap-0.5">
<li>Up to 60 hours playback (ANC active) or 80 hours in standard wireless mode</li>
<li>High-Resolution Wireless Audio certified via LDAC, AAC & aptX HD codecs</li>
<li>Triple-beamforming ENC microphones for crystal-clear voice transmission</li>
</ul>`,
  mediaItems: [
    {
      id: 'img-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJa6rvT6o3_P5udoIk7h-4Nz2pTPxaUSrwDAJZZ7qncbiqvh2gpZZmHWPzkP7OWitBNd9G3fuaiJyG6TS2uUWTh1Ku_fc7Y8kg1JVP8ecx-Zj0ze01Qh8yOYxLq8AErr19-dggdFip0zviPlk5kDwoAsC4Im40bs55hwSbe3P5pKDBqrFTYvOrKGrUYeiwjjcn3oC_MxS_vk1tvfr62ZYeNiBGbzauQ1WvvykDhGbIR5Hq5Pt7LChomg',
      alt: 'Studio shot of matte black luxury over-ear wireless headphones',
      isPrimary: true,
    },
    {
      id: 'img-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl3cTds-Ef2cmsolH6RO7XmqXq_70Pfqn4Bq_AyIXERQJuWtCvPn2R9Tn04Ael38rFW3vyJgtUFt4nP6-vRhgjdEoAkgBX3DuQeCsbYwsfyyx2RTe3TG-WrwbfZ6UiXwZ15hKdcrq-tRoVWfmCJNW0GIbPQ4sIInLj3KytkH8HgPwzjiz9uQVjD0TlQolk4xTo3RChYQCLErC7APX2Kfx70mpqlxNvvZZ260srFdTN0OUYMx9vSp0P4Q',
      alt: 'Side profile view of premium black wireless headphones',
      isPrimary: false,
    },
    {
      id: 'img-3',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYv0cfU7joMTvh_myjhl-h8g_mjONXyC8TDMuQyhxFJmqasobQkt07EtCO76bjKLrhvrSSMMlTxzSgexotaIVguu03KfebUwpgckoRhPoEF7Q8Kcdpg-iR2nmfeiwmJBDjTE29-FDrVgSWKTyurh8m1L35OJtWEF6ACKGRcWjP2QMqplcJ0JjS6rXK4N_8OdIsh8JkKu_-72ecUZCOuJ_LtUcQRXnr8NuQoRSt79vmqfhn-pTHf5RTyg',
      alt: 'Modern creative professional wearing wireless headphones',
      isPrimary: false,
    },
    {
      id: 'img-4',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO4X8bZMLl_omePThdFtigNLc6zjtEt-lqwZRUMKeQN9TatzyVJyqnHicRc6CbcS14cRTTMbLLA5byv8kOsfp2bJCxIZ5IZzy_O5n6w2Fw_CdqAyrOfnQUmdTaPV9FY3DImWdbjwW7kFXPnbvVS82LJzLP81V49clksB4_eNlKgAk7-Z_sYUUe0_w48gtgUWRh7LmmTCiNFhsxxW1SguvMmb9iprM4VcWvlk1ixSC0gzx7imIE7Di-cw',
      alt: 'Flat lay unboxing accessories',
      isPrimary: false,
    },
  ],
  videoUrl: '',
  has3dAsset: true,
  basePrice: 199.0,
  comparePrice: 249.0,
  costPrice: 82.5,
  chargeTax: true,
  taxProfile: 'Standard Consumer Goods (8.25%)',
  sku: 'NX-AUD-PRO-BLK',
  barcode: '840192837491',
  stockCount: 225,
  warehouses: [
    { id: 'wh-1', facilityName: 'Central Hub (Austin, TX)', committed: 12, available: 150 },
    { id: 'wh-2', facilityName: 'West Coast Depot (Reno, NV)', committed: 4, available: 75 },
  ],
  lowStockThreshold: 15,
  outOfStockPolicy: 'stop_selling',
  hasVariants: true,
  colorOptions: [
    { id: 'c-1', label: 'Midnight Black', colorHex: '#0f172a' },
    { id: 'c-2', label: 'Matte Silver', colorHex: '#cbd5e1' },
    { id: 'c-3', label: 'Navy Blue', colorHex: '#1e3a8a' },
  ],
  careOptions: [
    { id: 'w-1', label: 'Standard 1-Year', extraPrice: 0 },
    { id: 'w-2', label: 'NexaCare+ 2-Year (+$29.00)', extraPrice: 29 },
  ],
  variants: [
    {
      id: 'v-1',
      title: 'Midnight Black / Std 1Y',
      colorHex: '#0f172a',
      sku: 'NX-AUD-BLK-1Y',
      price: 199.0,
      stock: 90,
      isActive: true,
    },
    {
      id: 'v-2',
      title: 'Midnight Black / NexaCare+',
      colorHex: '#0f172a',
      sku: 'NX-AUD-BLK-2Y',
      price: 228.0,
      stock: 60,
      isActive: true,
    },
    {
      id: 'v-3',
      title: 'Matte Silver / Std 1Y',
      colorHex: '#cbd5e1',
      sku: 'NX-AUD-SLV-1Y',
      price: 199.0,
      stock: 50,
      isActive: true,
    },
    {
      id: 'v-4',
      title: 'Navy Blue / Std 1Y',
      colorHex: '#1e3a8a',
      sku: 'NX-AUD-NVY-1Y',
      price: 199.0,
      stock: 25,
      isActive: true,
    },
  ],
  weight: 320,
  weightUnit: 'g',
  length: 22,
  width: 18,
  height: 8,
  dimensionUnit: 'cm',
  hsCode: '8518.30.2000',
  shippingProfile: 'Standard Fragile Electronics (Insured 2-Day)',
  productStatus: 'published',
  salesChannels: {
    web: true,
    mobile: true,
    googleShopping: true,
    b2b: false,
  },
  cornerRibbon: 'BESTSELLER',
  category: 'Electronics > Audio > Over-Ear Headphones',
  brand: 'Nexa Audio Labs (Internal)',
  collections: ['Featured Highlights (Home Grid)', 'Best Sellers 2025', 'Audio Architecture Showcase'],
  tags: ['anc', 'wireless', 'bluetooth 5.3', 'audiophile', 'type-c'],
  customerHighlights: [
    '42dB Hybrid Active Noise Cancellation',
    '60-Hour Total Battery Life with Fast Charge',
    'Hi-Res Audio Certified with 40mm Titanium Drivers',
  ],
  allowPhotoReviews: true,
  featureInSpotlight: true,
}

export function buildFormDataFromCatalog(item: CatalogProduct): ProductFormData {
  if (item.id === 'prod-nx-aud-9420') {
    return sampleAeroSoundFormData
  }

  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return {
    ...defaultNewProductFormData,
    id: item.id,
    title: item.name,
    slug,
    subtitle: `${item.name} - Official master SKU release with full warranty support`,
    sku: item.sku,
    barcode: item.upc,
    stockCount: item.stockCount,
    basePrice: item.price,
    comparePrice: item.originalPrice || Math.round(item.price * 1.25),
    costPrice: item.costPrice,
    category: item.category,
    brand: item.brand,
    productStatus: item.status,
    mediaItems: item.imageUrl
      ? [
          {
            id: `media-${item.id}`,
            url: item.imageUrl,
            alt: item.name,
            isPrimary: true,
          },
        ]
      : [],
    warehouses: [
      {
        id: 'wh-1',
        facilityName: 'Central Hub (Austin, TX)',
        committed: Math.floor(item.stockCount * 0.1),
        available: Math.floor(item.stockCount * 0.7),
      },
      {
        id: 'wh-2',
        facilityName: 'West Coast Depot (Reno, NV)',
        committed: Math.floor(item.stockCount * 0.05),
        available: Math.ceil(item.stockCount * 0.3),
      },
    ],
  }
}

