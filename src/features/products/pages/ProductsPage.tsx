import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { TrustCard } from '@/components/ui/TrustCard'
import { CategoryCard } from '@/components/ui/CategoryCard'
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
  } = useProducts()

  const { addItem, changeQuantity } = useCart()

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

  // Split products into Featured Highlights and Best Sellers
  const hasCuratedIds = products.some((p) => p.id >= 100)
  const featuredProducts = hasCuratedIds
    ? products.filter((p) => p.id >= 100 && p.id < 200)
    : products.slice(0, Math.ceil(products.length / 2))
  const bestSellers = hasCuratedIds
    ? products.filter((p) => p.id >= 200)
    : products.slice(Math.ceil(products.length / 2))

  // Curated category collections with high-res Google-hosted images
  const categories = [
    {
      title: 'Electronics & Audio',
      subtitle: 'Acoustics & power gear',
      productCount: 14,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyp-SMvxJD6rbwCWVtXzNfLqdGLxqATItUfNQ5_pcrADcpMKznht-ZVXWR_BnDC8TnvfArgZWEzv3Tf8dPiA_R6w9rIrO23jEUUdP9COCxjKcOoNSq_1a6EVjahkdsgkgWego9ndgzTV2RoZJRkwWo7mn8y2aXs_4l236090QJNPvBAYnvedoWb798tKwe5yEZs1en2GAwKttzvvF7UyknniAJ7I_lo8wZOqiEhNWGDfrbdckRc6OIrw',
      id: 'electronics',
    },
    {
      title: 'Workspace & Ergonomics',
      subtitle: 'Task chairs & desk organizers',
      productCount: 8,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDchRGwwZYoaJLvCafsmdsQhkIj7Uxy0dYcnnhkT9O1i6-r3pQ-PKuHfcVLel0eoMzpT5g64xMTxG5G3Rj0KT19yZREVX1M6c9wyAsFz6g0SGXy3Zk7vW2or6uGs7E0DseufhUddvFsyqi5lRRvD_os8GcWOcW9lPGBjYU5IrIUhe_L1E5xR2d_7AJ2MUj9OCN5_Skm5Z4YzRiiiLpmdeDyWH-rrYads2V1zENMtY_5aK_oy-AO9Rzojg',
      id: 'workspace',
    },
    {
      title: 'Kitchen & Culinary',
      subtitle: 'Precision Dutch ovens & kettles',
      productCount: 12,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMUL2K2Cd6SU_3DtVU1LD-JnfUDMO7FmrOcLEgfaGhORYqDfRHTR-kTYnQUJUsnqpWQbDmzNnzZ_3K1Tzt0d122iEx2z7X0YqXLRAXPimU9H13WabhhB5EODmywKugh3ALRFn56GmFoDVnkEQUqinbDnIjU3ve4vSd7pX-BRbxyC_FTBRQBb76KX_vK8jAaMxN6P-Zd-2vknoPgDTRXuA163WJWLs2ejnPnCk22-kJv_iNQaqb7gfHQ',
      id: 'kitchen',
    },
    {
      title: 'Everyday & Outdoors',
      subtitle: 'Thermal flasks & travel EDC',
      productCount: 6,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZxgu0kIWHyCB0Ezw14JNb6gOIGFGFDkIAo7S6Jspr9Kjk641DnexgYej7NzU193eA7U2gVczCuESHgY_kOYV7it3xyUo3_dg85jBI-3ZIs_pTnNVZEJKrFw3Fde8mpw-qNdqcUWvWoB03lMy3uvvBi7QOGeOj3GVhJglVQcH-lRlhoQ8APryAea3CDpXUsPv9qaa6svH3lNmGJ4Ai-EQniSJQMdbLTAEZ3fuNITsN9QI-x01nwvRkA',
      id: 'outdoors',
    },
  ]

  // Testimonials with verified buyer proof
  const testimonials = [
    {
      quote: 'Exceptional heat distribution and artisanal glaze finish. Heats evenly across my induction stove!',
      author: 'Sarah Jenkins',
      role: 'Gold VIP Member • Cast & Clay Dutch Oven',
      rating: 5,
    },
    {
      quote: 'Incredible sound isolation and marathon battery life. The ANC rivaled my $400 over-ear set!',
      author: 'Marcus Brody',
      role: 'Verified Audiophile • AeroSound Pro',
      rating: 5,
    },
    {
      quote: 'Comfortable mesh seat, sturdy bracket build, fantastic ergonomics for an 8-hour workday.',
      author: 'Liam Patel',
      role: 'Software Architect • ErgoMesh Chair',
      rating: 5,
    },
  ]

  return (
    <main className="w-full bg-background min-h-screen">
      <div className="flex flex-col w-full">
        {/* ============================================================ */}
        {/* 1. Hero Section: Flagship Showcase */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 sm:py-10 w-full">
          <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low/70 rounded-3xl border border-outline-variant/60 shadow-[0_8px_30px_rgba(36,51,49,0.04)] overflow-hidden p-6 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text & Action Column */}
              <div className="lg:col-span-7 flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-body-sm text-xs font-semibold tracking-wider uppercase border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Flagship 2026 Collection
                </div>
                <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-tight">
                  Precision Engineering for Everyday Living.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Discover audiophile-grade acoustics, ergonomic workspace essentials, and minimalist home design built with meticulous craft and durable materials.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-primary hover:bg-secondary text-on-primary font-body-md text-body-md font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-body-md text-body-md font-semibold px-6 py-3 rounded-xl shadow-xs hover:border-outline transition-all cursor-pointer border border-outline-variant"
                  >
                    Explore Categories
                  </button>
                </div>

                {/* Micro Spec Metric Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-6 w-full max-w-md">
                  <div className="flex flex-col bg-surface-container-low p-3 rounded-xl">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">42 dB</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Active Isolation</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-low p-3 rounded-xl">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">60 Hrs</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Battery Reserve</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-low p-3 rounded-xl">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">4.9 ★</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">3,420 Reviews</span>
                  </div>
                </div>
              </div>

              {/* Visual Column with Floating Spec Pills */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="w-full aspect-[4/3] sm:aspect-square bg-surface-container-low rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center p-6">
                  <img
                    className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    alt="Flagship AeroSound Pro wireless active noise cancelling headphones"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNeEwW87IcBj1hbWUzIRNBgtGbk0FZew_6B-h9FCC9u8idw52_BCdlpN9h9FqKbtG5tJt_x1s3ijDrBBKj8qtPipgvNWj797DFlmAGAMzSRcXQMeitdY5QPyJxyRCuhUgt-eal8y_vg0g0STRzqcAK-_pbH24G7hVNqK02aREWPArVMi7Z7ommAIcN7wwjpbJ5FFofgSqWefIP54Rab9VVM2aifHoPCTyJyS66Op-jgbxvf1ZgfBuBvw"
                  />
                  {/* Floating Spec Badges */}
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">tune</span>
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      42dB Hybrid ANC
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-stock-in text-sm">battery_charging_full</span>
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      60h Quick Charge
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip directly below Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <TrustCard
              icon={<span className="material-symbols-outlined text-xl">local_shipping</span>}
              title="Free 2-Day Shipping"
              description="On domestic orders $99+"
            />
            <TrustCard
              icon={<span className="material-symbols-outlined text-xl">published_with_changes</span>}
              title="30-Day Risk-Free Trial"
              description="Easy prepaid return labels"
            />
            <TrustCard
              icon={<span className="material-symbols-outlined text-xl">verified</span>}
              title="2-Year Warranty"
              description="Official hardware cover"
            />
            <TrustCard
              icon={<span className="material-symbols-outlined text-xl">security</span>}
              title="Zero-Spam Checkout"
              description="Encrypted private details"
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. Shop by Category (Curated Collections) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full" id="categories">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Curated Collections
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Explore precision-built products by category
              </p>
            </div>
            <button
              type="button"
              onClick={() => changeCategory('all')}
              className="text-primary font-body-sm text-body-sm font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Browse Complete Catalog</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                title={cat.title}
                subtitle={cat.subtitle}
                productCount={cat.productCount}
                imageUrl={cat.imageUrl}
                onClick={() => changeCategory(cat.id)}
              />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. Featured Highlights */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full" id="featured">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Featured Highlights
                </h2>
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-on-primary">
                    Filtered: {selectedCategory}
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Top-rated equipment engineered for daily performance ({featuredProducts.length} items)
              </p>
            </div>
            <button
              type="button"
              onClick={() => changeCategory('all')}
              className="text-primary font-body-sm text-body-sm font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Products</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
              <p className="font-body-md text-on-surface font-semibold">
                No featured products found for current filter &ldquo;{searchQuery || selectedCategory}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => changeCategory('all')}
                className="mt-3 text-primary text-sm font-bold hover:underline"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  actionType="add-to-cart"
                  onQuickView={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 4. Promotional Banner */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-6 w-full">
          <PromoBanner
            badge="Seasonal Privilege"
            headline="Spring Equinox Collection — Up to 25% Off Storewide"
            description="Upgrade your work-from-home sanctuary with studio-grade sound and ergonomic seating designed for endurance."
            couponCode="SPRING25"
            couponRequirement="Min $100 order"
            buttonText="Claim Spring Discount"
            onClaim={() => {
              document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </section>

        {/* ============================================================ */}
        {/* 5. Customer Favorites & Best Sellers */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full" id="bestsellers">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Customer Favorites &amp; Best Sellers
                </h2>
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-on-primary">
                    Filtered: {selectedCategory}
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Reliable essentials verified by thousands of satisfied creators ({bestSellers.length} items)
              </p>
            </div>
            <button
              type="button"
              onClick={() => changeCategory('all')}
              className="text-primary font-body-sm text-body-sm font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Best Sellers</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {bestSellers.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
              <p className="font-body-md text-on-surface font-semibold">
                No best sellers found for current filter &ldquo;{searchQuery || selectedCategory}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => changeCategory('all')}
                className="mt-3 text-primary text-sm font-bold hover:underline"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  actionType="quick-view"
                  onQuickView={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 6. Why Shop With Us (4-Column Value Prop) */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              Built on Complete Transparency
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Our engineering standards extend to your entire purchasing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrustCard
              variant="vertical"
              icon={<span className="material-symbols-outlined text-2xl">speed</span>}
              title="Express Insured Dispatch"
              description="Orders ship within 4 hours from regional fulfillment hubs, covered by full transport guarantee."
            />
            <TrustCard
              variant="vertical"
              icon={<span className="material-symbols-outlined text-2xl">autorenew</span>}
              title="30-Day Zero-Risk Returns"
              description="Self-service prepaid return labels generated in under 60 seconds with no restocking penalty."
            />
            <TrustCard
              variant="vertical"
              icon={<span className="material-symbols-outlined text-2xl">verified_user</span>}
              title="2-Year Hardware Warranty"
              description="Comprehensive defect replacement and certified direct repair support on all mechanical parts."
            />
            <TrustCard
              variant="vertical"
              icon={<span className="material-symbols-outlined text-2xl">support_agent</span>}
              title="24/7 Concierge Support"
              description="Live human assistance via chat, phone, or verified ticketing with zero automated runaround."
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. Customer Reviews & Social Proof */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Verified Buyer Experiences
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Authentic feedback from real daily users
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-on-surface">
              <span className="text-stock-low">★★★★★</span>
              <span>4.9/5 Overall Store Rating</span>
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
        {/* 8. Newsletter Subscription Section */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
          <NewsletterCard />
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
