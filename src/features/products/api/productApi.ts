import { axiosInstance } from '@/lib/api/axiosInstance'
import type { Product } from '../types/product'

export const FALLBACK_PRODUCTS: Product[] = [
  // --- Featured Highlights (from Reference Template) ---
  {
    id: 101,
    title: 'AeroSound Pro Wireless ANC Headphones',
    price: 199.0,
    originalPrice: 249.0,
    badge: '20% OFF',
    badgeVariant: 'accent',
    stockLabel: 'In Stock',
    stockStatus: 'in-stock',
    description: 'Audiophile-grade studio acoustic drivers with 42dB Hybrid active noise cancellation and marathon 60-hour playback.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCCWIpAMq_qm3ZUB1FBg5aZqvfQXlepnWw9yI8lpn17ySLk1NRPx-w_ilWWf86yXkOV6pleWIxj6IOymhLoGl7UI7W6Cie5222GV8r4QxqJPOvh5NFnBXx9WrESr9u_JTx44wwu9Z3-_AI0yRnh-8aXCrEhb9Cw7ufXB_5CtWMGOk-7BTOvwM9pyxlUQgLrcFi7AoEhlQsr2SUOQ19QWG-tVpVLud9uhDEuZ7_xzgqwQkN4VP9MzMlYA',
    rating: { rate: 4.9, count: 3420 },
  },
  {
    id: 102,
    title: 'DeskPower 65W GaN Fast Charger',
    price: 45.0,
    badge: 'Limited',
    badgeVariant: 'limited',
    stockLabel: 'Low Stock: 2 left',
    stockStatus: 'low-stock',
    description: 'Next-generation gallium nitride architecture delivering simultaneous rapid charging for laptop, tablet, and mobile gear.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANF1hL4F0Th1lHieNdcwOA5VC3pbKsdfEja72eNxc7ayTNa2kNQOvvEmfmr2DJVVJi65CqW9BRfv0ye27JjM5Z_t6GMhATmF8ygQYbv0hkJHuXEzUp68E4ggSQKLRCbB7EpnSvlJ5fjXhMpEa4-jr_V188huQSsoskGpSvmkxH43KohwfDhEeuGrVAkiBXvMhdYZbRlqIIYe2VWoTPJUEVpS9jqevResQ4dnrTmj62H1Sb9N7bnUWdkA',
    rating: { rate: 4.8, count: 840 },
  },
  {
    id: 103,
    title: 'Cast & Clay Dutch Oven 5.5 Quart',
    price: 145.0,
    originalPrice: 165.0,
    variantLabel: 'Earthy Terracotta',
    description: 'Heavyweight enameled cast iron heat retention engineered for slow-simmered stews, artisan sourdough, and braises.',
    category: 'KITCHEN & CULINARY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATZWor51TNjqSPlEqXvHotMVy0Sd17k9tCVUJt3CnpSwF1r05051nLAmxlvUy2G1D26svTpHhaT5Ns6jnwYmx9DuVMKtaH3vEURb1JikyBKDOhm3GBufQtrHHdFVRG02XYUyTMMVaJRH5r8YKYlWu95ouSA42XPkzKFe6TdhZAvmeiD63uvuiVG9FurqMyg9i2sSUVH2YngCVcymFl8j0Iq0YL5IWIaC4j7ySrys6yHzYw7575e7oFAA',
    rating: { rate: 4.9, count: 420 },
  },
  {
    id: 104,
    title: 'Thermal Peak Insulated Flask 32oz',
    price: 34.0,
    variantLabel: 'Olive Green',
    description: 'Double-wall vacuum insulation keeps liquids ice-cold for 36 hours or steaming hot for 18 hours with spill-proof lid.',
    category: 'LIFESTYLE & EDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOq_0HR3eqS0XdCNKHxTXglDyaG7POAlOeqYl_8KChLZ9vufe-2otuWZR4c_az0niFdG0gX2xhXrfPuwcoJeiR00bx76WKn69ME-h-QxYdoJlvWq_PnNM71Z4cbKa73n0n-sPXzQbkfadfDXd8R9HwObbK1kD1_bX-y62zstFvwUVmE1fzl94UgYBKWL3wBl8-fVxHsLFI7HhvNGBzeZQ6izBoRZ26Z9O5WGoirORccfL2SxTFlObQFQ',
    rating: { rate: 4.7, count: 310 },
  },
  {
    id: 105,
    title: 'AeroSound Studio USB-C DAC & Amp Interface',
    price: 129.0,
    originalPrice: 159.0,
    badge: '18% OFF',
    stockLabel: 'In Stock',
    stockStatus: 'in-stock',
    description: '32-bit/384kHz high-resolution audio converter with balanced 4.4mm output and precision analog volume control.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyp-SMvxJD6rbwCWVtXzNfLqdGLxqATItUfNQ5_pcrADcpMKznht-ZVXWR_BnDC8TnvfArgZWEzv3Tf8dPiA_R6w9rIrO23jEUUdP9COCxjKcOoNSq_1a6EVjahkdsgkgWego9ndgzTV2RoZJRkwWo7mn8y2aXs_4l236090QJNPvBAYnvedoWb798tKwe5yEZs1en2GAwKttzvvF7UyknniAJ7I_lo8wZOqiEhNWGDfrbdckRc6OIrw',
    rating: { rate: 4.9, count: 1120 },
  },
  {
    id: 106,
    title: 'Solid American Walnut Dual-Tier Desk Shelf',
    price: 115.0,
    badge: 'Handcrafted',
    stockLabel: 'In Stock',
    stockStatus: 'in-stock',
    description: 'Carved from solid American walnut with integrated cork padding and heavy brushed aluminum risers.',
    category: 'DESK & WORKSPACE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDchRGwwZYoaJLvCafsmdsQhkIj7Uxy0dYcnnhkT9O1i6-r3pQ-PKuHfcVLel0eoMzpT5g64xMTxG5G3Rj0KT19yZREVX1M6c9wyAsFz6g0SGXy3Zk7vW2or6uGs7E0DseufhUddvFsyqi5lRRvD_os8GcWOcW9lPGBjYU5IrIUhe_L1E5xR2d_7AJ2MUj9OCN5_Skm5Z4YzRiiiLpmdeDyWH-rrYads2V1zENMtY_5aK_oy-AO9Rzojg',
    rating: { rate: 4.8, count: 670 },
  },
  {
    id: 107,
    title: 'Artisanal Matte Ceramic Pour-Over Dripper Set',
    price: 38.0,
    originalPrice: 48.0,
    variantLabel: 'Obsidian Grey',
    stockLabel: 'Low Stock: 4 left',
    stockStatus: 'low-stock',
    description: 'Precision ribbed interior spiral for optimal water extraction with heat-resistant borosilicate carafe.',
    category: 'KITCHEN & CULINARY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMUL2K2Cd6SU_3DtVU1LD-JnfUDMO7FmrOcLEgfaGhORYqDfRHTR-kTYnQUJUsnqpWQbDmzNnzZ_3K1Tzt0d122iEx2z7X0YqXLRAXPimU9H13WabhhB5EODmywKugh3ALRFn56GmFoDVnkEQUqinbDnIjU3ve4vSd7pX-BRbxyC_FTBRQBb76KX_vK8jAaMxN6P-Zd-2vknoPgDTRXuA163WJWLs2ejnPnCk22-kJv_iNQaqb7gfHQ',
    rating: { rate: 4.9, count: 580 },
  },
  {
    id: 108,
    title: 'Tactical Grade 5 Titanium Pocket Tool & EDC Clip',
    price: 42.0,
    badge: 'Limited Drop',
    stockLabel: 'In Stock',
    stockStatus: 'in-stock',
    description: 'Ultra-lightweight aerospace grade 5 titanium with pry tip, metric hex wrenches, bottle lever, and deep carry pocket clip.',
    category: 'LIFESTYLE & EDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZxgu0kIWHyCB0Ezw14JNb6gOIGFGFDkIAo7S6Jspr9Kjk641DnexgYej7NzU193eA7U2gVczCuESHgY_kOYV7it3xyUo3_dg85jBI-3ZIs_pTnNVZEJKrFw3Fde8mpw-qNdqcUWvWoB03lMy3uvvBi7QOGeOj3GVhJglVQcH-lRlhoQ8APryAea3CDpXUsPv9qaa6svH3lNmGJ4Ai-EQniSJQMdbLTAEZ3fuNITsN9QI-x01nwvRkA',
    rating: { rate: 4.7, count: 430 },
  },

  // --- Customer Favorites & Best Sellers (from Reference Template) ---
  {
    id: 201,
    title: 'StudioMonitor ANC Pro Edition',
    rankTag: '#1 IN AUDIO',
    price: 260.0,
    description: 'Precision-tuned acoustic reference headphones equipped with memory foam ear cushions and natural walnut staging dock.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxzEG1nwWlJ9aayMq5NWQokNs3YCzMjI5hcKFVMQUOBEdXLapoNyeQJ0qm2oEuhiAxWnG1Pj4zd5nj1UJC6vaZZQ2gCo0A1FX7-twoCrFKJiDrOupc5kBiNXTday-bzVlT4VwP8fEHPpUBIKFOv_R-WN69UW1JKcqnFbhqriVtwuJRhwZtbY5mkCNDK_-IlhdNrabIGKlwdt_LRo-mFcdUac6lrC2uO9OYsyZXVAeihMGFnOZR4FXbdg',
    rating: { rate: 5.0, count: 612 },
  },
  {
    id: 202,
    title: 'ErgoMesh Pro Task Chair',
    rankTag: '#1 ERGONOMIC',
    price: 289.0,
    description: 'Breathable dual-zone elastomeric mesh with synchronous recline lock and 4D armrests designed for 10+ hour creative sessions.',
    category: 'DESK & WORKSPACE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1Mtin942yCATt5kyXSw6WB2Vpud547Dmm63icvTOH60YQuZM4RCKqK5WLIYRJWHsTlLUUo6yuj9H-uno7RWCzB-5wirS7NRaBv9-qW7P36oA3IiZCFNyDiXVUwJXBIKMNKDvvRkRlcxKlKbqaDujK80d_bnn_ast_4VlNWlHPy5xfbnkx4adq_GfqTY-dGPvXxVQMPmSrhjkOVCNuccO0RBjP74zxobDAiz5Of35iLgpAdcFfATA0g',
    rating: { rate: 4.8, count: 940 },
  },
  {
    id: 203,
    title: 'ProBarista Gooseneck Electric Kettle',
    rankTag: 'CULINARY CHOICE',
    price: 119.0,
    description: 'Targeted pour spout with digital LCD real-time temperature tracking accurate to 1 degree for the perfect extraction.',
    category: 'KITCHEN & CULINARY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH5nBBfmbfdm1E5uBRxxFQ2seyHM_RP_f5qNByPCZH8bsxvHqeajHiHknehl-R9S_r2TZehfhNCYJ3q8wFNNfPQfEDeRCiqNsnNTba4hnpXY-Y4pBXJtAwpoaSCyFDJ6ZDilcw-iHXf_OGsOM7d9e6Oobc7-6LQ0FenMdCEIi5YrkrOD-bbfHl9polqF091CwycupR_4q7nggC5Sf-EltrDeiOFj8XwPwdXQuig_xsLzU0LxWQlVeIEw',
    rating: { rate: 4.9, count: 510 },
  },
  {
    id: 204,
    title: 'Legacy Braided Audio Cable 1.5m',
    rankTag: 'ESSENTIAL',
    price: 18.0,
    description: 'High-purity OFC copper core wrapped in ballistic nylon braid with 24k gold-plated 3.5mm connectors for zero interference.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_QPSHwEP0Wj3g6ner8VDISGdj2g5HUQ25lMEadeW72edyVNrDQIKfihW4NM0A5FQsI3aB5clG2Hz5lZdXy5febUZJxCIaZ4-uKtQAQcCG9xWFkt5R87yyYkx0JedAVK4Ru1Z_fhvrLY8OXRT_x0B2yoFjP8w3mrLRye5dCfPkaUAmpOT8dU1mL1XfNSu67tNZtydZAFf5nRya7eDpgJ5YNXYxGeF8beNwWfl4Zh1cPMs4PbfU6D4IDA',
    rating: { rate: 4.6, count: 180 },
  },
  {
    id: 205,
    title: 'Precision Heavyweight Cast Iron Skillet 10"',
    rankTag: 'CHEF FAVORITE',
    price: 85.0,
    originalPrice: 99.0,
    description: 'Triple-seasoned organic flaxseed oil finish with smooth milled cook surface and ergonomic assist handle.',
    category: 'KITCHEN & CULINARY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATZWor51TNjqSPlEqXvHotMVy0Sd17k9tCVUJt3CnpSwF1r05051nLAmxlvUy2G1D26svTpHhaT5Ns6jnwYmx9DuVMKtaH3vEURb1JikyBKDOhm3GBufQtrHHdFVRG02XYUyTMMVaJRH5r8YKYlWu95ouSA42XPkzKFe6TdhZAvmeiD63uvuiVG9FurqMyg9i2sSUVH2YngCVcymFl8j0Iq0YL5IWIaC4j7ySrys6yHzYw7575e7oFAA',
    rating: { rate: 4.9, count: 820 },
  },
  {
    id: 206,
    title: 'AeroBeam Ultra-Slim LED Monitor ScreenBar',
    rankTag: '#1 WORKSPACE',
    price: 68.0,
    description: 'Asymmetric optical design prevents screen glare while illuminating desk surface with auto-dimming ambient light sensor.',
    category: 'DESK & WORKSPACE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDchRGwwZYoaJLvCafsmdsQhkIj7Uxy0dYcnnhkT9O1i6-r3pQ-PKuHfcVLel0eoMzpT5g64xMTxG5G3Rj0KT19yZREVX1M6c9wyAsFz6g0SGXy3Zk7vW2or6uGs7E0DseufhUddvFsyqi5lRRvD_os8GcWOcW9lPGBjYU5IrIUhe_L1E5xR2d_7AJ2MUj9OCN5_Skm5Z4YzRiiiLpmdeDyWH-rrYads2V1zENMtY_5aK_oy-AO9Rzojg',
    rating: { rate: 4.8, count: 740 },
  },
  {
    id: 207,
    title: 'SoundCore HiFi True Wireless ANC Earbuds',
    rankTag: 'TOP AUDIOPHILE',
    price: 149.0,
    originalPrice: 179.0,
    description: 'Dual balanced armature drivers with transparency pass-through mode, wireless charging Qi case, and IPX7 rating.',
    category: 'ELECTRONICS & AUDIO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNeEwW87IcBj1hbWUzIRNBgtGbk0FZew_6B-h9FCC9u8idw52_BCdlpN9h9FqKbtG5tJt_x1s3ijDrBBKj8qtPipgvNWj797DFlmAGAMzSRcXQMeitdY5QPyJxyRCuhUgt-eal8y_vg0g0STRzqcAK-_pbH24G7hVNqK02aREWPArVMi7Z7ommAIcN7wwjpbJ5FFofgSqWefIP54Rab9VVM2aifHoPCTyJyS66Op-jgbxvf1ZgfBuBvw',
    rating: { rate: 4.9, count: 1290 },
  },
  {
    id: 208,
    title: 'Merino Wool Felt Ergonomic Desk Mat XL (90x40cm)',
    rankTag: 'BESTSELLER',
    price: 48.0,
    description: 'Non-slip natural rubber base with premium high-density German Merino wool felt for silent mouse tracking and warmth.',
    category: 'DESK & WORKSPACE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1Mtin942yCATt5kyXSw6WB2Vpud547Dmm63icvTOH60YQuZM4RCKqK5WLIYRJWHsTlLUUo6yuj9H-uno7RWCzB-5wirS7NRaBv9-qW7P36oA3IiZCFNyDiXVUwJXBIKMNKDvvRkRlcxKlKbqaDujK80d_bnn_ast_4VlNWlHPy5xfbnkx4adq_GfqTY-dGPvXxVQMPmSrhjkOVCNuccO0RBjP74zxobDAiz5Of35iLgpAdcFfATA0g',
    rating: { rate: 4.9, count: 910 },
  },
]

export async function getProducts(): Promise<Product[]> {
  // If a dedicated backend API URL is configured, fetch from it
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await axiosInstance.get<Product[]>('/products')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch (err) {
      console.warn('Backend product fetch failed, falling back to curated catalog:', err)
    }
  }
  return FALLBACK_PRODUCTS
}

export async function getProductById(id: number): Promise<Product> {
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await axiosInstance.get<Product>(`/products/${id}`)
      if (response.data) return response.data
    } catch (err) {
      console.warn(`Backend fetch for product ${id} failed, checking catalog:`, err)
    }
  }
  const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id)
  if (fallback) return fallback
  throw new Error(`Product with ID ${id} not found`)
}
