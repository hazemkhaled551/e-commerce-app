import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { useCart } from '@/features/cart'
import { useProducts } from '@/features/products'
import { useAuth } from '@/features/auth'

export function Header() {
  const location = useLocation()
  const isPdpActive = location.pathname.startsWith('/product')
  const { totalQuantity, totalPrice, toggle } = useCart()
  const { changeCategory, changeSearch, selectedCategory, searchQuery } = useProducts()
  const { user, isAuthenticated, logout } = useAuth()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'electronics', label: 'Electronics & Audio' },
    { id: 'workspace', label: 'Desk & Workspace' },
    { id: 'kitchen', label: 'Kitchen & Culinary' },
    { id: 'outdoors', label: 'Lifestyle & EDC' },
  ]

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    changeSearch(localSearch)
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-surface-container-lowest shadow-sm">
    
      {/* 2. Main Search & Status Hub */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Security Badge */}
          <Logo onClick={() => changeCategory('all')} />

          {/* Global Search Input with Shortcut */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl hidden sm:flex items-center bg-surface-container-low rounded-xl px-3 py-2 shadow-inner focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-outline text-lg mr-2">search</span>
            <input
              className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none font-body-md text-body-md"
              placeholder="Search audio, electronics, desk gear, kitchenware..."
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                changeSearch(e.target.value)
              }}
            />
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant bg-surface-container-highest rounded shadow-sm">
              ⌘K
            </kbd>
          </form>

          {/* Utility Fast Links */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              className="hidden xl:inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-body-sm text-body-sm font-medium transition-colors"
              href="#portal"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              Customer Portal
            </a>
            <button
              type="button"
              className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-low cursor-pointer"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
                <span className="absolute -top-1.5 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity > 0 ? totalQuantity : 2}
                </span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-on-surface hidden md:inline">
                ${totalPrice > 0 ? totalPrice.toFixed(2) : '272.46'}
              </span>
            </button>
            {/* Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="relative group flex items-center">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  title={`Signed in as ${user?.name}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface hidden md:inline">
                    {user?.name}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg py-1 min-w-[150px] z-50">
                  <span className="px-3 py-1.5 text-xs text-on-surface-variant border-b border-outline-variant/20 truncate font-body-sm">
                    {user?.email}
                  </span>
                  <Link
                    to="/admin"
                    className="w-full text-left px-3 py-1.5 text-xs text-primary hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-1.5 border-b border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-sm">dashboard</span>
                    <span>Admin Console</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3 py-1.5 text-xs text-error hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-on-surface"
                title="Sign In or Register"
              >
                <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-base">person</span>
                </div>
                <span className="font-body-sm text-body-sm font-semibold hidden md:inline">
                  Sign In
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* 3. Category Filter Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 font-body-sm text-body-sm">
          {categories.map((cat) => {
            const isActive =
              !isPdpActive &&
              (selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                (cat.id === 'all' && selectedCategory === 'all'))
            return (
              <Link
                key={cat.id}
                to="/"
                onClick={() => changeCategory(cat.id)}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
