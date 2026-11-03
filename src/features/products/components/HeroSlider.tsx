import { useState, useEffect, useCallback, useRef } from 'react'

export interface HeroSlide {
  id: string
  badge: string
  badgeIcon?: string
  title: string
  highlightText?: string
  description: string
  primaryCtaText: string
  secondaryCtaText?: string
  categoryTarget: string
  imageUrl: string
  imageAlt: string
  specs: { label: string; value: string; icon?: string }[]
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'audio-flagship',
    badge: 'Flagship 2026 Collection',
    badgeIcon: 'headphones',
    title: 'Precision Engineering for Everyday Living.',
    highlightText: 'Everyday Living',
    description:
      'Discover audiophile-grade studio acoustics, 42dB Hybrid active noise cancellation, and marathon 60-hour battery reserve built with aerospace-grade aluminum.',
    primaryCtaText: 'Shop Acoustic Series',
    secondaryCtaText: 'Explore Categories',
    categoryTarget: 'electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2000&auto=format&fit=crop',
    imageAlt: 'AeroSound Pro Studio wireless active noise cancelling headphones',
    specs: [
      { label: 'Active Isolation', value: '42 dB', icon: 'tune' },
      { label: 'Battery Reserve', value: '60 Hrs', icon: 'battery_charging_full' },
      { label: 'Curated Score', value: '4.9 ★', icon: 'star' },
    ],
  },
  {
    id: 'workspace-architectural',
    badge: 'Architectural Workspace',
    badgeIcon: 'desktop_windows',
    title: 'Master Your Space with Architectural Precision.',
    highlightText: 'Architectural Precision',
    description:
      'Solid American walnut risers, whisper-quiet dual-motor standing frames, and breathable tension-mesh seating engineered for deep creative flow.',
    primaryCtaText: 'Discover Workspace',
    secondaryCtaText: 'Explore Ergonomics',
    categoryTarget: 'workspace',
    imageUrl:
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2000&auto=format&fit=crop',
    imageAlt: 'Minimalist ergonomic desk setup with monitor and walnut accessories',
    specs: [
      { label: 'Hardwood Deck', value: 'Solid Walnut', icon: 'forest' },
      { label: 'Motor System', value: 'Dual-Lift', icon: 'speed' },
      { label: 'Warranty Cover', value: '10 Years', icon: 'verified' },
    ],
  },
  {
    id: 'culinary-artisanal',
    badge: "Chef's Artisanal Craft",
    badgeIcon: 'skillet',
    title: 'Artisanal Craftsmanship for the Modern Kitchen.',
    highlightText: 'Modern Kitchen',
    description:
      'Heavyweight matte enameled cast iron, induction-ready multi-layer bases, and precision heat retention engineered for slow-simmered perfection.',
    primaryCtaText: 'Shop Culinary Gear',
    secondaryCtaText: 'View Dutch Ovens',
    categoryTarget: 'kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop',
    imageAlt: 'Artisan cast iron cookware in contemporary luxury kitchen',
    specs: [
      { label: 'Cooktop Prep', value: 'Induction Ready', icon: 'electric_bolt' },
      { label: 'Exterior Glaze', value: 'Triple Enamel', icon: 'auto_awesome' },
      { label: 'Craft Guarantee', value: 'Lifetime Care', icon: 'workspace_premium' },
    ],
  },
  {
    id: 'lifestyle-edc',
    badge: 'Limited Spring Release',
    badgeIcon: 'luggage',
    title: 'Refined EDC Essentials Built for a Lifetime.',
    highlightText: 'Built for a Lifetime',
    description:
      'Double-wall vacuum thermal flasks, RFID-shielded titanium wallets, and weather-tested modular everyday gear crafted for travel and resilience.',
    primaryCtaText: 'Explore EDC Gear',
    secondaryCtaText: 'See New Arrivals',
    categoryTarget: 'outdoors',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop',
    imageAlt: 'Minimalist everyday carry essentials, watches, and travel flasks',
    specs: [
      { label: 'Materials', value: 'Grade-5 Ti', icon: 'shield' },
      { label: 'Thermal Shield', value: '36h Chill', icon: 'ac_unit' },
      { label: 'Weather Grade', value: 'IPX7 Sealed', icon: 'water_drop' },
    ],
  },
]

export interface HeroSliderProps {
  slides?: HeroSlide[]
  autoPlayInterval?: number
  onSelectCategory?: (category: string) => void
  onExploreCategories?: () => void
}

export function HeroSlider({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
  onSelectCategory,
  onExploreCategories,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const totalSlides = slides.length

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return

    const timer = setInterval(() => {
      handleNext()
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isPaused, totalSlides, autoPlayInterval, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    const sliderNode = sliderRef.current
    if (sliderNode) {
      sliderNode.addEventListener('keydown', handleKeyDown)
      return () => sliderNode.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext, handlePrev])

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    setTouchStartX(null)
    setIsPaused(false)
  }

  const currentSlide = slides[currentIndex]

  const handlePrimaryCta = (slide: HeroSlide) => {
    if (onSelectCategory) {
      onSelectCategory(slide.categoryTarget)
    }
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSecondaryCta = () => {
    if (onExploreCategories) {
      onExploreCategories()
    } else {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sliderRef}
      tabIndex={0}
      aria-label="Featured Collections Carousel"
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] xl:h-[690px] overflow-hidden bg-neutral-950 focus:outline-none select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================================ */}
      {/* 1. Slide Images & Cinematic Background Overlays */}
      {/* ============================================================ */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background High-Res Image with Slow Ken-Burns Transition */}
            <img
              src={slide.imageUrl}
              alt={slide.imageAlt}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />

            {/* Dark & Deep Teal Multi-Layer Cinematic Contrast Overlays */}
            {/* Horizontal Gradient: ensures left-hand typography is 100% legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 sm:via-neutral-950/65 to-neutral-950/30" />

            {/* Vertical Vignette Gradient: anchors bottom pagination & top header */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40" />

            {/* Subtle Brand Teal Ambient Glow in Top-Left */}
            <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          </div>
        )
      })}

      {/* ============================================================ */}
      {/* 2. Slide Content (Constrained to max-w-7xl, aligned with page) */}
      {/* ============================================================ */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-2xl sm:max-w-3xl flex flex-col items-start gap-4 sm:gap-5 text-white">
          {/* Badge / Collection Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-body-sm text-xs font-semibold tracking-wider uppercase transition-all shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {currentSlide.badgeIcon && (
              <span className="material-symbols-outlined text-sm text-[#55bdb3]">
                {currentSlide.badgeIcon}
              </span>
            )}
            <span className="text-white/95">{currentSlide.badge}</span>
          </div>

          {/* Slide Headline */}
          <h1
            key={`title-${currentSlide.id}`}
            className="font-display-hero text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
          >
            {currentSlide.title}
          </h1>

          {/* Slide Description */}
          <p
            key={`desc-${currentSlide.id}`}
            className="font-body-lg text-base sm:text-lg text-white/80 max-w-xl sm:max-w-2xl leading-relaxed drop-shadow-sm transition-all duration-500 delay-75 animate-in fade-in slide-in-from-bottom-2"
          >
            {currentSlide.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => handlePrimaryCta(currentSlide)}
              className="bg-primary hover:bg-[#075b60] text-white font-body-md text-sm sm:text-base font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentSlide.primaryCtaText}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            {currentSlide.secondaryCtaText && (
              <button
                type="button"
                onClick={handleSecondaryCta}
                className="bg-white/10 hover:bg-white/20 active:bg-white/25 text-white backdrop-blur-md border border-white/25 font-body-md text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs hover:border-white/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{currentSlide.secondaryCtaText}</span>
              </button>
            )}
          </div>

          {/* Micro Spec Metric Pills */}
          {currentSlide.specs && currentSlide.specs.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-6 w-full max-w-lg">
              {currentSlide.specs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex flex-col bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 rounded-xl transition-all shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-white/90">
                    {spec.icon && (
                      <span className="material-symbols-outlined text-xs sm:text-sm text-[#55bdb3]">
                        {spec.icon}
                      </span>
                    )}
                    <span className="font-headline-sm text-sm sm:text-lg font-bold text-white tracking-tight">
                      {spec.value}
                    </span>
                  </div>
                  <span className="font-body-sm text-[11px] sm:text-xs text-white/70 mt-0.5 truncate">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. Navigation Controls: Next / Prev Arrows */}
      {/* ============================================================ */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-neutral-900/40 hover:bg-neutral-900/75 active:bg-neutral-900/90 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_left</span>
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-neutral-900/40 hover:bg-neutral-900/75 active:bg-neutral-900/90 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_right</span>
      </button>

      {/* ============================================================ */}
      {/* 4. Bottom Controls: Dots Indicator */}
      {/* ============================================================ */}
      <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 z-30 pointer-events-none flex justify-center">
        <div className="flex items-center gap-2 pointer-events-auto bg-neutral-950/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-sm">
          {slides.map((_, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer relative ${
                  isActive
                    ? 'w-8 sm:w-10 h-2.5 bg-primary shadow-sm'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

