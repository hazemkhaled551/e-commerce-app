import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { useCart } from '@/features/cart'
import { useProducts } from '@/features/products'
import { useAuth } from '@/features/auth'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { totalQuantity, totalPrice, toggle } = useCart()
  const { changeCategory, changeSearch, searchQuery } = useProducts()
  const { user, isAuthenticated, logout } = useAuth()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    changeSearch(localSearch)
    setIsMobileSearchOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
    }
    // If already on homepage, scroll to catalog
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNavClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        if (sectionId) {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/60 shadow-xs transition-all">
      {/* Main Header Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Logo
            onClick={() => {
              changeCategory('all')
              handleNavClick()
            }}
          />

          {/* Global Search Input (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl hidden sm:flex items-center bg-surface-container-low focus-within:bg-surface-container-lowest rounded-xl px-3.5 py-2 border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-outline text-lg mr-2 select-none">
              search
            </span>
            <input
              className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-body-md text-sm"
              placeholder="Search audio, electronics, desk gear, kitchenware..."
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                changeSearch(e.target.value)
              }}
            />
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant bg-surface-container-high rounded shadow-xs">
              ⌘K
            </kbd>
          </form>

          {/* Right Action Hub */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-xl hover:bg-surface-container-low cursor-pointer"
              aria-label="Toggle mobile search"
            >
              <span className="material-symbols-outlined text-xl">
                {isMobileSearchOpen ? 'close' : 'search'}
              </span>
            </button>

            {/* Customer Portal Link (Desktop) */}
            <a
              className="hidden xl:inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-body-sm text-xs font-semibold px-2.5 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
              href="#portal"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              <span>Portal</span>
            </a>

            {/* Wishlist Button */}
            <button
              type="button"
              className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-xl hover:bg-surface-container-low cursor-pointer"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/60 transition-all shadow-xs cursor-pointer"
              aria-label={`Shopping cart with ${totalQuantity} items`}
            >
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  shopping_cart
                </span>
                <span className="absolute -top-1.5 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity > 0 ? totalQuantity : 2}
                </span>
              </div>
              <span className="font-body-sm text-xs sm:text-sm font-bold text-on-surface hidden md:inline">
                ${totalPrice > 0 ? totalPrice.toFixed(2) : '272.46'}
              </span>
            </button>

            {/* Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="relative group flex items-center">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high px-2.5 py-1.5 rounded-xl border border-outline-variant/50 transition-all cursor-pointer"
                  title={`Signed in as ${user?.name}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="font-body-sm text-xs font-semibold text-on-surface hidden md:inline">
                    {user?.name}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-[0_8px_24px_rgba(36,51,49,0.08)] py-1.5 min-w-[170px] z-50">
                  <span className="px-3 py-1.5 text-xs text-on-surface-variant border-b border-outline-variant/30 truncate font-body-sm">
                    {user?.email}
                  </span>
                  {String(user?.role || '').trim().toUpperCase() === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2 border-b border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-sm">dashboard</span>
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs text-stock-out hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/50 transition-all cursor-pointer text-on-surface"
                title="Sign In or Register"
              >
                <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <span className="font-body-sm text-xs font-semibold hidden md:inline">
                  Sign In
                </span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-xl hover:bg-surface-container-low cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="sm:hidden mt-3 flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/60 shadow-inner animate-fade-in"
          >
            <span className="material-symbols-outlined text-outline text-lg mr-2">search</span>
            <input
              autoFocus
              className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-body-md text-sm"
              placeholder="Search audio, desk gear, cookware..."
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                changeSearch(e.target.value)
              }}
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('')
                  changeSearch('')
                }}
                className="text-outline hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </form>
        )}

        {/* Expandable Mobile Navigation Sheet */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-3 pt-3 border-t border-outline-variant/40 flex flex-col gap-1 text-sm font-semibold animate-fade-in">
            <button
              type="button"
              onClick={() => handleNavClick('collections')}
              className="text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <span>Curated Collections</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('catalog-section')}
              className="text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <span>Featured Catalog</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('bestsellers')}
              className="text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <span>Customer Favorites</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </button>
            <a
              href="#portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low flex items-center justify-between transition-colors"
            >
              <span>Customer Portal</span>
              <span className="material-symbols-outlined text-sm text-outline">storefront</span>
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
