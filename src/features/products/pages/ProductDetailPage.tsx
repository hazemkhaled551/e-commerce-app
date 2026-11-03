import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '@/features/cart'
import { useProducts } from '../hooks/useProducts'
import { FALLBACK_PRODUCTS } from '../api/productApi'
import { Breadcrumbs } from '@/components/ui'
import type { Product } from '../types/product'

type TabType = 'specs' | 'overview' | 'reviews' | 'shipping'

const GALLERY_IMAGES = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsHnrr_KHLanJGCEgk2WYkEWjeA-94KmTCDrVXs8yrz1mxY-DcB-jYzXU-NCnyJJwdRRy2tMNSASGjRtkFrdZbuyeVQ31t2vZNGQp4LtDj-rhBqgtKC08HBnoQs-VjPzfT34QRfBzVTcBe_bO6bJ-z7awUfktc2hSJHZwygqcq2iziWHjmJ8cG-oEvaX04jljwgpxHLk1RFi4CFIPT6rk3BAPz1F16WtsNNLAYcOd3wRJQim-VjwirnA',
    alt: 'Premium matte black over-ear wireless noise cancelling headphones resting on a minimalist architectural podium',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcN7vwenNYQQ7LeVTSi95vBjnW4VGBOz59INdDdSGwMwGM44PL8meyMi78w-LuE9kRLMWYfP5B8L_7hLb7tuHtEiTFllQIstBBDUN9aR4YRPZ7YRjFw-KS70mzAhaWXH83e_KCniaqxlrct-pFqYCVB9Q_TmUIqMecztUH-V2Aq3hnb7Pb9Jz-LuX0GE-G0etfiEDXqQcgsXaBM7nNYhumPlj76FnFW5Pi5-FAuPnHJi-TlcNrfRxVWg',
    alt: 'Studio frontal perspective of sleek matte black over-ear headphones highlighting memory foam headband',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAckvNnMjzf9DOE09m_ShoCovif4AL7C6hgKsXiwzZgb2go703AEM8rtmb-By5E1F-Bq8jKNk3lz8aswOQTpI5n3vVWkjNZ4vPkRs6tb8HE9QDlAtqIU8DwQAtN5zZ1JtFCafDY1FfjkGFaWrdoWTRzRyG5151GCEs28wpeVldKaInxIHFit3VehSzSahJpdqV3cBp51dvGnYEsCUor-gQxNtMccyv5FKAunMbcLUs7JWyitYoG-uYmoQ',
    alt: 'Macro close-up of perforated breathable memory foam ear cushion and engineered titanium acoustic driver mesh',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoJOc0O61uutDNqfKpl6paslR_FsFFryvIvsW0NXGVevSXcnzaYwtAOKNT4BDNYuT99rRRXH2pzr2ShjZVvMUpvQ3xlfQF9JoYsNhu7Vx7DSpa1N2fGiwspytFj_e2LhYlTjixn0eD5CIgnMBmUmLtWkvNmOBto_u1xiWqJ4hUVeVrgziYXCoDspBA9ozFT1ZZHVl_NULhprzX_jPXVCjRf2K3a-dD-M5USWpq0r1xb4N5r3cC-k-o8g',
    alt: 'Ballistic nylon travel zipper case partially open displaying folded headphones and accessories',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4XHBdPges47FuHmA_eknDkEQgCfFP4w5nxCJPrqUEXaVgnlY2MgjE7QA8CJAss1LNkbwDk2LV9MNzL5LNJ-obOC9kY1DszJ6iJBtzwqzcdNUeej_2RvOSwcyfno2mvUEQJF3oSQv2WEtIs5W3YQwsgBMXRl5_CNopnq_NtQLhtx6SAbQ2YoCNAVQ1s1ApPzez6N4uFc3y0VjSEJME_TxDj99bPfbywvf_wHyP3cHGcQrRWJ1eICf_Rw',
    alt: 'Sophisticated creative workspace desk setup featuring headphones on oak stand next to audio interface',
  },
]

const COMPANIONS: Product[] = [
  {
    id: 201,
    title: 'AeroSound Travel Hardcase',
    category: 'PROTECTION',
    price: 29.0,
    description: 'Water-resistant EVA shell with magnetic accessory pouch.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxrzYxzQVYpNBF1adx2lH7QGnnfivIBXtrHGOPB0E-VUzhaVUcfkxkz-ck71McZpibyearfZHtsVSLZxfO8Zsc-J-qd1BOMW7qPgFqYuE1ttwxGK_UdvuNEjQQ4NsSAhUZ_6ekGvz706iJvRF5Emev3WCrtU9H9s0I1mied6-h0hmOvvTkiuZR5Hqu4zfWD34mYi6247Sq5paXUbXblt-eXB2i6hlPINM2toqHkI7wkjGmVVtVcqoOiw',
    rating: { rate: 4.8, count: 520 },
    badge: 'Essential',
  },
  {
    id: 102,
    title: 'DeskPower 65W GaN Fast Charger',
    category: 'POWER & CHARGING',
    price: 45.0,
    description: 'Dual USB-C PD 3.0 ports. Refuels headphones in 35 mins.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwF-DDTk1EulK3v5745l62ltTRs_9QhRboHa9ag3DVB_P3GQv_IzhPAjjvJYy1CQe7DjCNoZPZg9sr5OKHT23tvr90I_YU6r2LcrtdFSmqufmqLdJVinWH-85MorVPXWOCKDiKzByk-M0nc9fK4qV4haoK5erVcP-vxkjzQsTvDaSO9wra8bC9XjomkChvsHKYfCbkY7S1a3O_rvXMipETqvbrrziOKva_hqk2_kZMiXWmynV3K1Kiww',
    rating: { rate: 4.8, count: 840 },
    badge: 'GaN 3.0',
  },
  {
    id: 202,
    title: 'Braided USB-C to 3.5mm Hi-Fi Cable',
    category: 'CABLES & AUDIO',
    price: 18.0,
    description: 'Oxygen-free copper conductor with inline volume slider.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEqQAYJmBEEDinkhXDYAlnW2rnrKPRv94EZbRCoCjbeAncca4WL9XQyBgAOiCP61W5k3Pa3ys1ihhY96zF3EO_wgpmBmYgJMCDpIqf0Gtf6jK0XLIDLFv1vZ2x4Rcr19tL5bBY--iUzRsy0relaShuIDTPhYs3Ndkz6eRzZZVa6C8mJCvfjrfBU-X8hNt-vPHcZUIcwSBq5pF0b36-R8GgQjLe5XGRdFk7RSOXmdNs6ZhDgtH3-b2GFA',
    rating: { rate: 4.7, count: 230 },
  },
  {
    id: 203,
    title: 'AuraGlow Ambient RGB Soundbar',
    category: 'DESKTOP AUDIO',
    price: 175.0,
    description: 'Syncs with AeroSound for unified room acoustics.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqI8RjCEk2pd1riUoxfuLBfjnWffWeNORT-So4TEjRYMKRAaWSXyfVsXj2e2rYCCxuZGzkGZsCZ5BU_FknmC6AxmZtiPcCRLXECHtChMDJks5rD9AwoFrTHtP05_sZnNlp_4a4ITf-RS4hCHw3GVUo9z83b3fSnPqJpS-mlLf32s7c2VNCmVnDyfZqgmG59LmriBO12_1ZuWaDQy87SbvoqCKAgOJG28QX3DG-YOenFRB-BRt60i7XtQ',
    rating: { rate: 4.9, count: 680 },
    badge: 'Best Match',
  },
]

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem, toggle } = useCart()
  const { products } = useProducts()

  // Match product from Redux products, then FALLBACK_PRODUCTS, or use Flagship Headphones (101)
  const product: Product = useMemo(() => {
    if (id) {
      const foundInRedux = products.find((p) => String(p.id) === id)
      if (foundInRedux) return foundInRedux
      const foundInFallback = FALLBACK_PRODUCTS.find((p) => String(p.id) === id)
      if (foundInFallback) return foundInFallback
    }
    return FALLBACK_PRODUCTS[0] // 101: AeroSound Pro
  }, [id, products])

  // Dynamic gallery images based on product
  const galleryImages = useMemo(() => {
    if (product.id === 101) {
      return GALLERY_IMAGES
    }
    return [
      {
        src: product.image,
        alt: `${product.title} front studio view`,
      },
      {
        src: product.image,
        alt: `${product.title} material & build detail`,
      },
      {
        src: product.image,
        alt: `${product.title} packaged product display`,
      },
      {
        src: product.image,
        alt: `${product.title} in everyday environment`,
      },
    ]
  }, [product])

  // Component UI States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Midnight Matte Black')
  const [selectedCushion, setSelectedCushion] = useState<'standard' | 'cooling'>('standard')
  const [quantity, setQuantity] = useState(1)

  // Reset image when id changes (React recommended pattern)
  const [prevId, setPrevId] = useState(id)
  if (prevId !== id) {
    setPrevId(id)
    setSelectedImageIndex(0)
  }

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('specs')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Dynamic pricing
  const cushionAddon = selectedCushion === 'cooling' ? 15.0 : 0.0
  const unitPrice = (product.price || 199.0) + cushionAddon
  const totalPrice = unitPrice * quantity

  // Quantity adjuster (limit guard 1 to 5)
  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > 5) return 5
      return next
    })
  }

  // Handle Add to Cart
  const handleAddToCart = (itemToAdd: Product, customTitle?: string) => {
    for (let i = 0; i < (itemToAdd.id === product.id ? quantity : 1); i++) {
      addItem({
        ...itemToAdd,
        price: itemToAdd.id === product.id ? unitPrice : itemToAdd.price,
      })
    }
    setToastMessage(customTitle || `${itemToAdd.title} (${selectedColor})`)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* Toast Notification (Bottom Right) */}
      {toastMessage && (
        <div
          id="cart-toast"
          className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.04)] max-w-md border border-outline-variant/30 animate-fadeIn"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
              Added to Cart!
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {toastMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="px-space-md py-1.5 bg-primary-container hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            View Cart
          </button>
          <button
            type="button"
            aria-label="Close Notification"
            onClick={() => setToastMessage(null)}
            className="text-outline hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: product.category || 'Electronics & Audio', href: '/' },
            { label: product.title },
          ]}
        />
      </section>

      {/* Main Product Section (2-Column Grid) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* ================= LEFT COLUMN: IMAGE GALLERY ================= */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Main Stage Image Card */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm group">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-primary text-on-primary font-label-caps text-label-caps px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                  Flagship Studio Grade
                </span>
                <span className="bg-surface-container-lowest/90 backdrop-blur text-on-surface font-label-caps text-label-caps px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs text-primary">verified</span> Authentic Acoustic
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur hover:bg-surface-container-lowest flex items-center justify-center shadow-sm transition-all hover:scale-105 cursor-pointer ${
                    isWishlisted ? 'text-error' : 'text-on-surface'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Hero Image */}
              <img
                id="main-product-img"
                onClick={() => setIsLightboxOpen(true)}
                src={galleryImages[selectedImageIndex]?.src || product.image}
                alt={galleryImages[selectedImageIndex]?.alt || product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />

              {/* Interactive Zoom Indicator Badge */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 text-on-surface font-body-sm text-xs shadow-xs hover:bg-surface-container-lowest transition-colors cursor-pointer border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-sm text-primary">zoom_in</span>
                <span>Click to enlarge view</span>
              </button>
            </div>

            {/* Thumbnail Strip (4-5 Angles) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-space-sm">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`thumb-btn rounded-lg overflow-hidden aspect-square bg-surface-container-lowest relative group shadow-sm transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'ring-2 ring-primary'
                      : 'ring-0 hover:ring-2 hover:ring-outline'
                  }`}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      selectedImageIndex === idx ? 'bg-primary/10' : 'bg-transparent group-hover:bg-primary/5'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Media Visual Feature Highlights Bento */}
            <div className="grid grid-cols-3 gap-space-sm pt-space-xs text-left">
              <div className="p-space-sm bg-surface-container-lowest rounded-xl flex items-center gap-space-sm shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">graphic_eq</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">Hybrid ANC</p>
                  <p className="font-label-caps text-label-caps text-outline">-42dB Attenuation</p>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-lowest rounded-xl flex items-center gap-space-sm shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">battery_charging_full</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">60h Playtime</p>
                  <p className="font-label-caps text-label-caps text-outline">Fast USB-C Charge</p>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-lowest rounded-xl flex items-center gap-space-sm shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">spatial_audio</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">Spatial Audio</p>
                  <p className="font-label-caps text-label-caps text-outline">Dynamic Head Tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PURCHASING ENGINE ================= */}
          <div className="lg:col-span-5 flex flex-col gap-space-md text-left">
            {/* Header & Branding Metadata */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-bold">
                  AEROSOUND AUDIO LABS
                </span>
                <span className="font-body-sm text-body-sm text-outline">SKU: NX-AUD-9420</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface leading-tight">
                {product.title}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {product.description ||
                  'Engineered with 40mm biomimetic neodymium drivers, active quad-mic isolation, and low-latency lossless Bluetooth 5.3 aptX HD.'}
              </p>
            </div>

            {/* Social Proof & Rating Summary */}
            <div className="flex items-center gap-space-sm flex-wrap pb-1">
              <div className="flex items-center bg-surface-container-high px-space-sm py-1 rounded-full">
                <div className="flex text-stock-low mr-1.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface mr-1">
                  {product.rating?.rate || 4.9}
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  ({product.rating?.count?.toLocaleString() || '1,420'} reviews)
                </span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Top Rated
              </span>
              <span className="text-outline font-body-sm text-body-sm">•</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">local_mall</span> 2.4k bought this month
              </span>
            </div>

            {/* Pricing Card Container */}
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-baseline gap-space-sm">
                <span className="font-display-hero text-display-hero text-on-surface font-bold tracking-tight">
                  ${unitPrice.toFixed(2)}
                </span>
                <span className="font-headline-sm text-headline-sm text-outline line-through">
                  ${((product.originalPrice || 249.0) + cushionAddon).toFixed(2)}
                </span>
                <span className="bg-stock-in-bg text-stock-in font-label-caps text-label-caps px-2 py-1 rounded font-bold uppercase">
                  Save $50 (20% OFF)
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">credit_card</span>
                Or 4 interest-free payments of{' '}
                <span className="font-semibold text-on-surface">${(unitPrice / 4).toFixed(2)}</span> with{' '}
                <span className="font-bold underline cursor-pointer">Klarna</span> or{' '}
                <span className="font-bold underline cursor-pointer">Afterpay</span>
              </p>
            </div>

            {/* Live Stock Availability State */}
            <div className="p-space-sm bg-stock-in-bg rounded-xl flex items-center justify-between text-stock-in shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stock-in animate-pulse"></span>
                <span className="font-body-sm text-body-sm font-semibold">In Stock</span>
                <span className="text-stock-in font-body-sm text-body-sm">
                  ― Ships today if ordered within <strong className="font-bold underline">3 hrs 24 mins</strong>
                </span>
              </div>
              <span className="material-symbols-outlined text-lg">bolt</span>
            </div>

            {/* Configuration: Color Swatches */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <div className="flex justify-between items-center font-body-sm text-body-sm">
                <span className="font-bold text-on-surface">
                  Finish: <span className="font-normal text-on-surface-variant">{selectedColor}</span>
                </span>
                <span className="text-primary font-semibold text-xs cursor-pointer hover:underline">
                  View 360° View
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedColor('Midnight Matte Black')
                    setSelectedImageIndex(0)
                  }}
                  className={`color-swatch-btn flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedColor === 'Midnight Matte Black'
                      ? 'bg-surface-container-high ring-2 ring-primary text-on-surface font-semibold'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-neutral-900 shadow-inner"></span>
                  <span className="font-body-sm text-body-sm font-medium">Midnight Black</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedColor('Cloud White')
                    setSelectedImageIndex(1)
                  }}
                  className={`color-swatch-btn flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedColor === 'Cloud White'
                      ? 'bg-surface-container-high ring-2 ring-primary text-on-surface font-semibold'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-outline-variant/40 shadow-inner"></span>
                  <span className="font-body-sm text-body-sm font-medium">Cloud White</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedColor('Navy Titanium')
                    setSelectedImageIndex(4)
                  }}
                  className={`color-swatch-btn flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedColor === 'Navy Titanium'
                      ? 'bg-surface-container-high ring-2 ring-primary text-on-surface font-semibold'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-700 shadow-inner"></span>
                  <span className="font-body-sm text-body-sm font-medium">Navy Titanium</span>
                </button>
              </div>
            </div>

            {/* Configuration: Ear Cushion Fit Option */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <div className="flex justify-between items-center font-body-sm text-body-sm">
                <span className="font-bold text-on-surface">Cushion Configuration</span>
                <span className="text-outline text-xs">Hypoallergenic &amp; Replaceable</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  onClick={() => setSelectedCushion('standard')}
                  className={`cushion-chip p-space-sm rounded-lg text-left transition-all cursor-pointer ${
                    selectedCushion === 'standard'
                      ? 'bg-surface-container-high ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">
                      Memory Foam Standard
                    </span>
                    {selectedCushion === 'standard' && (
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Included standard</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCushion('cooling')}
                  className={`cushion-chip p-space-sm rounded-lg text-left transition-all cursor-pointer ${
                    selectedCushion === 'cooling'
                      ? 'bg-surface-container-high ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Cooling Gel Pro</span>
                    <span className="font-label-caps text-label-caps text-primary font-bold">+$15.00</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Infused thermoregulating gel
                  </p>
                </button>
              </div>
            </div>

            {/* Quantity & Limit Guard */}
            <div className="flex items-center gap-space-md pt-space-xs">
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-bold text-on-surface mb-1">Quantity</span>
                <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 shadow-sm border border-outline-variant/30">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => handleQtyChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors font-bold cursor-pointer disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="w-10 text-center font-price-md text-price-md font-bold text-on-surface">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => handleQtyChange(1)}
                    disabled={quantity >= 5}
                    className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors font-bold cursor-pointer disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span> Max 5 units per customer order
                </span>
                <span className="font-body-sm text-body-sm text-stock-in font-medium">
                  Free express courier eligibility active
                </span>
              </div>
            </div>

            {/* Primary Actions Bar */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-3.5 px-space-lg bg-primary-container hover:bg-secondary text-on-primary font-body-lg text-body-lg font-bold rounded-xl flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  <span>Add to Cart • ${totalPrice.toFixed(2)}</span>
                </button>
                <button
                  type="button"
                  aria-label="Wishlist"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl flex items-center justify-center shadow-sm transition-all border border-outline-variant/30 cursor-pointer ${
                    isWishlisted ? 'text-error' : 'text-on-surface-variant hover:text-error'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Express Payment Fast Lane */}
              <div className="grid grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product, 'Instant checkout with Apple Pay')}
                  className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-body-sm text-body-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span className="font-bold tracking-tight">Buy with Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product, 'Instant checkout with Google Pay')}
                  className="py-2.5 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-body-sm text-body-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors border border-outline-variant/30 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg text-primary">account_balance_wallet</span>
                  <span>Google Pay</span>
                </button>
              </div>
            </div>

            {/* Assurance & Warranty Highlight Box */}
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-sm mt-space-xs border border-outline-variant/30">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">local_shipping</span>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">Free 2-Day Guaranteed Delivery</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Standard express shipping on all orders over $50. Insured delivery via FedEx.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                  published_with_changes
                </span>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">30-Day Risk-Free Trial</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Listen for a month. If it doesn&apos;t revolutionize your audio, return it pre-paid for 100% refund.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">verified_user</span>
                <div>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">2-Year Nexa Acoustic Coverage</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Full hardware and battery degradation replacement warranty handled domestically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Availability States Showcase */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-space-xl text-left">
        <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
            <div>
              <span className="font-body-sm text-body-sm font-bold text-on-surface">
                System Stock Availability States:
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time inventory levels dynamically render across customer touchpoints:
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-stock-in-bg text-stock-in font-body-sm text-body-sm font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stock-in"></span> In Stock (28+ units ready)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stock-low-bg text-stock-low font-body-sm text-body-sm font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stock-low"></span> Low Stock: Only 3 units left
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stock-out-bg text-stock-out font-body-sm text-body-sm font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stock-out"></span> Backorder: Restock April 12
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Deep Dive Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-space-2xl text-left">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
          {/* Tab Header Strip */}
          <div className="flex items-center overflow-x-auto bg-surface-container-low px-space-md pt-space-xs gap-space-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`tab-button px-space-lg py-3 font-body-md text-body-md rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Technical Specifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`tab-button px-space-lg py-3 font-body-md text-body-md rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-base">description</span>
              <span>Overview &amp; Features</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`tab-button px-space-lg py-3 font-body-md text-body-md rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              <span>Customer Reviews (1,420)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`tab-button px-space-lg py-3 font-body-md text-body-md rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'shipping'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-base">local_shipping</span>
              <span>Shipping &amp; Warranty</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="p-space-lg md:p-space-xl">
            {/* TAB 1: SPECS */}
            {activeTab === 'specs' && (
              <div className="tab-panel flex flex-col gap-space-xl animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Precision Acoustic Engineering
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Validated under rigorous laboratory conditions for fidelity, wireless resilience, and ergonomic endurance.
                    </p>
                  </div>
                  <a
                    className="font-body-sm text-body-sm text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    href="#download-spec"
                  >
                    <span className="material-symbols-outlined text-base">download</span> Download Full Spec PDF
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Left Spec Column */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Acoustic Driver</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">40mm Custom Neodymium Biomimetic</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Frequency Response</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">10 Hz – 40,000 Hz (Hi-Res Certified)</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Active Noise Cancellation</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">Hybrid 4-Mic Array with Wind Reduction</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Wireless Protocol</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">Bluetooth 5.3 (aptX HD, AAC, LDAC, SBC)</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Wireless Range</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">Up to 20 meters (65 feet) unobstructed</span>
                    </div>
                  </div>

                  {/* Right Spec Column */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Battery Endurance</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">45h (ANC On) / 60h (ANC Off)</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Fast Charge Metric</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">10 min charge = 5 hours playback</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Physical Weight</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">254 grams (Ultra-light ergonomic)</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Wired Connectivity</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">3.5mm Aux Lossless + USB-C Digital Audio</span>
                    </div>
                    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Voice Isolation</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-bold">Dual Beamforming with AI Environmental Filter</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="tab-panel flex flex-col gap-space-lg animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-center">
                  <div className="flex flex-col gap-space-sm">
                    <span className="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider">
                      Acoustic Purity
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Hear details you never knew existed.
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      The AeroSound Pro combines custom-tuned diaphragms with advanced spatial DSP to recreate the physical sensation of sitting in an acoustic listening room. High-resolution codecs transmit double the data rate of typical headphones, preventing compression artifacts on vocals and orchestral brass.
                    </p>
                    <ul className="flex flex-col gap-2 pt-2">
                      <li className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        Adaptive transparency mode lets you talk without removing earcups
                      </li>
                      <li className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        Multipoint pairing seamlessly swaps between laptop calls and mobile audio
                      </li>
                      <li className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        Companion smartphone app offers 10-band parametric EQ personalization
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[16/10] bg-surface-container-low shadow-sm">
                    <img
                      alt="Sound engineer overview test"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMRmGWcR-gIq8QydmK3jbkfy8LaVJFPs1ztGeTvhYl5BD3JUspIegw-SL8GWaevuk8Kb2VAqw-vl1pfAewhiriK41TH6RVRZ3Ero6H27kkhrdVkRqkzuKfR74VY0MWvP7deR43L4aYDdgtePmE7LnvC7GDBqBoYPbidveIAP9XuHmodGPfojfnayeZJeDwYWDzxlcZH9qaw8IVHHn02dDK5slSEfL7X34nZgzZTvDW7Eckk1cY-_IBlg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="tab-panel flex flex-col gap-space-xl animate-fadeIn">
                {/* Rating Summary Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl p-space-lg bg-surface-container-low rounded-xl items-center">
                  <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
                    <span className="font-display-hero text-display-hero font-bold text-on-surface">4.9</span>
                    <div className="flex text-stock-low my-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      Based on 1,420 verified buyer ratings
                    </span>
                    <button
                      type="button"
                      className="mt-space-md px-space-md py-2 bg-primary hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* Breakdown Bars */}
                  <div className="lg:col-span-8 flex flex-col gap-2">
                    <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                      <span className="w-12 text-on-surface-variant font-medium">5 Star</span>
                      <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-stock-low h-full rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <span className="w-10 text-right font-bold text-on-surface">82%</span>
                    </div>

                    <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                      <span className="w-12 text-on-surface-variant font-medium">4 Star</span>
                      <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-stock-low h-full rounded-full" style={{ width: '14%' }}></div>
                      </div>
                      <span className="w-10 text-right font-bold text-on-surface">14%</span>
                    </div>

                    <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                      <span className="w-12 text-on-surface-variant font-medium">3 Star</span>
                      <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-stock-low h-full rounded-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="w-10 text-right font-bold text-on-surface">3%</span>
                    </div>

                    <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                      <span className="w-12 text-on-surface-variant font-medium">2 Star</span>
                      <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-stock-low h-full rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="w-10 text-right font-bold text-on-surface">1%</span>
                    </div>

                    <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                      <span className="w-12 text-on-surface-variant font-medium">1 Star</span>
                      <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-stock-low h-full rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="w-10 text-right font-bold text-on-surface">0%</span>
                    </div>
                  </div>
                </div>

                {/* Reviews Cards */}
                <div className="flex flex-col gap-space-md">
                  {/* Review 1 */}
                  <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold flex items-center justify-center">
                          MV
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-body-md text-body-md font-bold text-on-surface">
                              Marcus Vance
                            </span>
                            <span className="bg-stock-in-bg text-stock-in font-label-caps text-label-caps px-2 py-0.5 rounded font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-xs">verified</span> Verified Buyer
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-outline">
                            Purchased: Midnight Matte Black • 2 weeks ago
                          </span>
                        </div>
                      </div>
                      <div className="flex text-stock-low">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                      Outperformed my $380 European headphones easily.
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      I travel on 4 domestic flights every month. The noise cancellation eliminates jet engine roar without making me feel that weird cabin ear pressure. The physical buttons are a huge upgrade over laggy touch controls, and battery lasts forever.
                    </p>
                    <div className="flex items-center gap-space-md pt-2 text-outline font-body-sm text-body-sm">
                      <button type="button" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-sm">thumb_up</span> Helpful (84)
                      </button>
                      <button type="button" className="hover:text-primary transition-colors cursor-pointer">
                        Report
                      </button>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center justify-center">
                          ER
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-body-md text-body-md font-bold text-on-surface">
                              Elena Rostova
                            </span>
                            <span className="bg-stock-in-bg text-stock-in font-label-caps text-label-caps px-2 py-0.5 rounded font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-xs">verified</span> Verified Buyer
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-outline">
                            Purchased: Cloud White • 1 month ago
                          </span>
                        </div>
                      </div>
                      <div className="flex text-stock-low">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                      The Cooling Gel Pro pads are an absolute must-have.
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      I do 8-hour coding sessions and usually my ears overheat with other leatherette cans. These stay cool the whole day. Sound profile is crisp, punchy low-end without being muddy. Nexa shipped it in under 24 hours.
                    </p>
                    <div className="flex items-center gap-space-md pt-2 text-outline font-body-sm text-body-sm">
                      <button type="button" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-sm">thumb_up</span> Helpful (42)
                      </button>
                      <button type="button" className="hover:text-primary transition-colors cursor-pointer">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHIPPING & WARRANTY */}
            {activeTab === 'shipping' && (
              <div className="tab-panel flex flex-col gap-space-lg animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                  <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col gap-space-sm border border-outline-variant/20">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">local_shipping</span> Delivery &amp; Tracking
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      All domestic orders ship from our central state automated fulfillment facilities. Orders placed by 3:00 PM EST ship the same calendar day.
                    </p>
                    <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                      <li>• <strong>Standard Express (2-3 Business Days):</strong> Free on $50+ orders</li>
                      <li>• <strong>Next-Day Priority Air:</strong> $14.99 at checkout</li>
                      <li>• <strong>Signature confirmation:</strong> Available upon request at checkout</li>
                    </ul>
                  </div>

                  <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col gap-space-sm border border-outline-variant/20">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">verified_user</span> Return &amp; Warranty Policy
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Every unit includes our unmatched 30-day &ldquo;Love it or Leave it&rdquo; guarantee with zero restocking deductions.
                    </p>
                    <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                      <li>• <strong>Hassle-free pre-paid shipping label:</strong> Included with return requests</li>
                      <li>• <strong>2-Year Nexa Warranty:</strong> Covers drivers, headband mechanisms, and electronics</li>
                      <li>• <strong>Live Concierge Replacement:</strong> New unit dispatched before return arrives</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Companion Products Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-space-2xl text-left">
        <div className="flex items-center justify-between mb-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-widest">
              Complete Your Listening Rig
            </span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Recommended Accessories &amp; Companion Gear
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {COMPANIONS.map((companion) => (
            <div
              key={companion.id}
              className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all group border border-outline-variant/30"
            >
              <div>
                <Link to={`/products/${companion.id}`} className="block">
                  <div className="relative w-full aspect-square rounded-lg bg-surface-container-low overflow-hidden mb-space-sm">
                    {companion.badge && (
                      <span className="absolute top-2 left-2 z-10 bg-surface-container-lowest/90 font-label-caps text-label-caps font-bold px-2 py-0.5 rounded-full text-on-surface shadow-xs">
                        {companion.badge}
                      </span>
                    )}
                    <img
                      alt={companion.title}
                      src={companion.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  {companion.category}
                </span>
                <Link to={`/products/${companion.id}`}>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {companion.title}
                  </h3>
                </Link>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mb-2">
                  {companion.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                <span className="font-price-md text-price-md text-on-surface font-bold">
                  ${companion.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddToCart(companion)}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary transition-colors cursor-pointer"
                  title={`Add ${companion.title} to Cart`}
                >
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Sticky Bottom Purchase Bar for Mobile Shoppers */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/60 px-4 py-3 shadow-[0_-4px_20px_rgba(36,51,49,0.08)] flex items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={galleryImages[selectedImageIndex]?.src || product.image}
            alt={product.title}
            className="w-11 h-11 rounded-lg object-contain bg-surface-container-low p-1 border border-outline-variant/40 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate max-w-[140px] sm:max-w-xs">
              {product.title}
            </span>
            <span className="text-sm font-extrabold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleAddToCart(product)}
          className="bg-primary hover:bg-secondary text-on-primary font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">shopping_bag</span>
          <span>Add to Cart</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* Fullscreen Gallery Lightbox Modal */}
      {/* ============================================================ */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="absolute -top-12 right-0 text-white hover:text-white/80 p-2 cursor-pointer rounded-full"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <img
              src={galleryImages[selectedImageIndex]?.src || product.image}
              alt={galleryImages[selectedImageIndex]?.alt || product.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white flex items-center justify-center backdrop-blur cursor-pointer"
                  aria-label="Previous angle"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      (prev + 1) % galleryImages.length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white flex items-center justify-center backdrop-blur cursor-pointer"
                  aria-label="Next angle"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
