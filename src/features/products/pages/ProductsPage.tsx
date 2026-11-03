import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { HeroSlider } from '../components/HeroSlider'
import { CuratedCollectionsGrid } from '../components/CuratedCollectionsGrid'
import { FlagshipSpotlight } from '../components/FlagshipSpotlight'
import { ProductDiscoveryToolbar } from '../components/ProductDiscoveryToolbar'
import { CraftManifesto } from '../components/CraftManifesto'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { NewsletterCard } from '@/components/ui/NewsletterCard'
import { useCart } from '@/features/cart'
import type { Product } from '../types/product'

export function ProductsPage() {
  const navigate = useNavigate()
  const {
    products,
    selectedProduct,
    selectProduct,
    changeCategory,
    selectedCategory,
    searchQuery,
    changeSearch,
    sortBy,
    changeSort,
  } = useProducts()

  const { addItem, changeQuantity } = useCart()

  // Local discovery interaction states
  const [inStockOnly, setInStockOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid')

  const handleProductClick = useCallback(
    (product: Product) => {
      navigate(`/products/${product.id}`)
    },
    [navigate]
  )

  const handleCloseModal = useCallback(() => {
    selectProduct(null)
  }, [selectProduct])

  const handleAddToCart = useCallback(
    (product: Product, quantity = 1) => {
      addItem(product)
      if (quantity > 1) {
        changeQuantity(product.id, quantity)
      }
    },
    [addItem, changeQuantity]
  )

  // Filter by inStock status if toggle is active
  const filteredProducts = useMemo(() => {
    if (!inStockOnly) return products
    return products.filter((p) => p.stockStatus !== 'out-of-stock')
  }, [products, inStockOnly])

  // Split products into Featured Highlights and Best Sellers
  const hasCuratedIds = filteredProducts.some((p) => p.id >= 100)
  const featuredProducts = hasCuratedIds
    ? filteredProducts.filter((p) => p.id >= 100 && p.id < 200)
    : filteredProducts.slice(0, Math.ceil(filteredProducts.length / 2))
  const bestSellers = hasCuratedIds
    ? filteredProducts.filter((p) => p.id >= 200)
    : filteredProducts.slice(Math.ceil(filteredProducts.length / 2))

  // Find the flagship hero spotlight item (AeroSound Pro or first available product)
  const spotlightProduct = products.find((p) => p.id === 101) || products[0]

  // Curated category collections with high-res Google-hosted images
  const categories = [
    {
      title: 'Workspace & Ergonomics',
      subtitle: 'Solid American walnut risers, standing frames & task seating',
      productCount: 8,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDchRGwwZYoaJLvCafsmdsQhkIj7Uxy0dYcnnhkT9O1i6-r3pQ-PKuHfcVLel0eoMzpT5g64xMTxG5G3Rj0KT19yZREVX1M6c9wyAsFz6g0SGXy3Zk7vW2or6uGs7E0DseufhUddvFsyqi5lRRvD_os8GcWOcW9lPGBjYU5IrIUhe_L1E5xR2d_7AJ2MUj9OCN5_Skm5Z4YzRiiiLpmdeDyWH-rrYads2V1zENMtY_5aK_oy-AO9Rzojg',
      id: 'workspace',
    },
    {
      title: 'Electronics & Audio',
      subtitle: 'Studio acoustic drivers, DAC interfaces & GaN chargers',
      productCount: 14,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyp-SMvxJD6rbwCWVtXzNfLqdGLxqATItUfNQ5_pcrADcpMKznht-ZVXWR_BnDC8TnvfArgZWEzv3Tf8dPiA_R6w9rIrO23jEUUdP9COCxjKcOoNSq_1a6EVjahkdsgkgWego9ndgzTV2RoZJRkwWo7mn8y2aXs_4l236090QJNPvBAYnvedoWb798tKwe5yEZs1en2GAwKttzvvF7UyknniAJ7I_lo8wZOqiEhNWGDfrbdckRc6OIrw',
      id: 'electronics',
    },
    {
      title: 'Kitchen & Culinary',
      subtitle: 'Matte enameled cast iron & induction kettles',
      productCount: 12,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMUL2K2Cd6SU_3DtVU1LD-JnfUDMO7FmrOcLEgfaGhORYqDfRHTR-kTYnQUJUsnqpWQbDmzNnzZ_3K1Tzt0d122iEx2z7X0YqXLRAXPimU9H13WabhhB5EODmywKugh3ALRFn56GmFoDVnkEQUqinbDnIjU3ve4vSd7pX-BRbxyC_FTBRQBb76KX_vK8jAaMxN6P-Zd-2vknoPgDTRXuA163WJWLs2ejnPnCk22-kJv_iNQaqb7gfHQ',
      id: 'kitchen',
    },
    {
      title: 'Everyday & Outdoors',
      subtitle: 'Vacuum-sealed titanium flasks & modular EDC',
      productCount: 6,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZxgu0kIWHyCB0Ezw14JNb6gOIGFGFDkIAo7S6Jspr9Kjk641DnexgYej7NzU193eA7U2gVczCuESHgY_kOYV7it3xyUo3_dg85jBI-3ZIs_pTnNVZEJKrFw3Fde8mpw-qNdqcUWvWoB03lMy3uvvBi7QOGeOj3GVhJglVQcH-lRlhoQ8APryAea3CDpXUsPv9qaa6svH3lNmGJ4Ai-EQniSJQMdbLTAEZ3fuNITsN9QI-x01nwvRkA',
      id: 'outdoors',
    },
  ]

  // Category filter tabs for inline discovery toolbar
  const categoryTabs = [
    { id: 'electronics', label: 'Audio & Acoustics' },
    { id: 'workspace', label: 'Desk & Workspace' },
    { id: 'kitchen', label: 'Kitchen & Culinary' },
    { id: 'outdoors', label: 'Everyday & EDC' },
  ]

  const handleResetFilters = useCallback(() => {
    changeCategory('all')
    changeSearch('')
    setInStockOnly(false)
  }, [changeCategory, changeSearch])

  // Testimonials with verified buyer proof
  const testimonials = [
    {
      quote:
        'Exceptional heat distribution and artisanal glaze finish. Heats evenly across my induction stove and cleans like new every time.',
      author: 'Sarah Jenkins',
      role: 'VIP Member • Cast & Clay Dutch Oven',
      rating: 5,
    },
    {
      quote:
        'Incredible acoustic isolation and marathon battery life. The 42dB ANC rivaled my studio over-ear set during cross-country flights.',
      author: 'Marcus Brody',
      role: 'Verified Audiophile • AeroSound Pro',
      rating: 5,
    },
    {
      quote:
        'Solid walnut deck, smooth dual-motor action, and exceptional ergonomics. My workspace posture improved on day one.',
      author: 'Liam Patel',
      role: 'Software Architect • ErgoMesh Chair & Desk',
      rating: 5,
    },
  ]

  return (
    <main className="w-full bg-background min-h-screen">
      <div className="flex flex-col w-full">
        {/* ============================================================ */}
        {/* 1. Hero Section: Full-Width E-Commerce Hero Slider */}
        {/* ============================================================ */}
        <HeroSlider
          onSelectCategory={(category) => {
            changeCategory(category)
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          onExploreCategories={() => {
            document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* ============================================================ */}
        {/* 2. Curated Pillar Collections (Asymmetric Editorial Grid) */}
        {/* ============================================================ */}
        <CuratedCollectionsGrid
          collections={categories}
          onSelectCategory={(categoryId) => {
            changeCategory(categoryId)
          }}
        />

        {/* ============================================================ */}
        {/* 3. The Flagship Spotlight (Industrial Deep-Dive) */}
        {/* ============================================================ */}
        <FlagshipSpotlight
          product={spotlightProduct}
          onAddToCart={handleAddToCart}
          onQuickView={handleProductClick}
        />

        {/* ============================================================ */}
        {/* 4. Curated Catalog Section with Full Discovery Toolbar */}
        {/* ============================================================ */}
        <section
          className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full"
          id="catalog-section"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 pb-4 border-b border-outline-variant/60">
            <div>
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Featured Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
                Precision Hardware &amp; Daily Artifacts
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Explore individual equipment engineered with durable craft ({featuredProducts.length} items available)
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary hover:text-secondary text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-end"
            >
              <span>Reset All Filters</span>
              <span className="material-symbols-outlined text-base">restart_alt</span>
            </button>
          </div>

          {/* Interactive Discovery Toolbar (Categories + In-Stock + Sorting + View Mode) */}
          <ProductDiscoveryToolbar
            categories={categoryTabs}
            activeCategory={selectedCategory}
            onSelectCategory={(catId) => {
              changeCategory(catId)
            }}
            totalCount={products.length}
            sortBy={sortBy}
            onSortChange={changeSort}
            searchQuery={searchQuery}
            onSearchChange={changeSearch}
            inStockOnly={inStockOnly}
            onToggleInStock={() => setInStockOnly((prev) => !prev)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onClearAllFilters={handleResetFilters}
          />

          {/* Products Grid / Empty State */}
          {featuredProducts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/50 max-w-lg mx-auto my-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-1">
                No matching hardware found
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                No items match your active filters &ldquo;{searchQuery || selectedCategory}&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-primary hover:bg-secondary text-on-primary font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'detailed'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              }
            >
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  actionType="add-to-cart"
                  onQuickView={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 5. Promotional Capsule Section */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-6 w-full">
          <PromoBanner
            badge="Seasonal Capsule"
            headline="Spring Equinox Collection — Up to 25% Off Storewide"
            description="Upgrade your daily sanctuary with studio-grade sound and ergonomic seating designed for endurance."
            couponCode="SPRING25"
            couponRequirement="Min $100 order"
            buttonText="Claim Spring Discount"
            onClaim={() => {
              document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </section>

        {/* ============================================================ */}
        {/* 6. Customer Favorites & Best Sellers Shelf */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full" id="bestsellers">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-outline-variant/60">
            <div>
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Proven Classics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
                Customer Favorites &amp; Best Sellers
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Trusted gear verified by thousands of satisfied creators ({bestSellers.length} items)
              </p>
            </div>

            <button
              type="button"
              onClick={() => changeCategory('all')}
              className="text-primary hover:text-secondary text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-end"
            >
              <span>Explore All Favorites</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {bestSellers.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/50 max-w-lg mx-auto my-8 shadow-xs">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">inventory_2</span>
              <p className="text-sm text-on-surface font-semibold">
                No best sellers found for current filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 text-primary text-xs font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  actionType="quick-view"
                  onQuickView={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 7. Engineering & Materiality Manifesto (The 4 Pillars) */}
        {/* ============================================================ */}
        <CraftManifesto />

        {/* ============================================================ */}
        {/* 8. Customer Reviews & Social Proof */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-outline-variant/60">
            <div>
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Verified Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
                Authentic Buyer Experiences
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Genuine impressions from daily users across studio and culinary spaces
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-on-surface self-start sm:self-end bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/50 shadow-xs">
              <span className="text-stock-low">★★★★★</span>
              <span>4.9 / 5.0 Global Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={idx}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. Drop Dispatch & Journal Newsletter */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
          <NewsletterCard
            title="Join the Nexa Store Hardware Dispatch"
            description="Receive weekly design notes, material deep-dives, firmware updates, and private drop access before general release."
            disclaimer="No marketing spam. Unsubscribe with one click anytime."
          />
        </section>
      </div>

      {/* Quick View Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </main>
  )
}
