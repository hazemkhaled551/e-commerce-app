import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  Bell,
  Plus,
  ChevronRight,
  Store,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/features/auth'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const userName = user?.name || 'Alexander Wright'
  const userEmail = user?.email || 'admin@nexastore.com'

  // Dynamic breadcrumb generation based on path
  const getBreadcrumbs = () => {
    const path = location.pathname
    if (path.startsWith('/admin/orders/') && path !== '/admin/orders') {
      const orderId = path.split('/admin/orders/')[1]
      const label = orderId.startsWith('#') ? orderId : `#${orderId.toUpperCase()}`
      return [
        { label: 'Admin', to: '/admin' },
        // { label: 'Commerce', to: '/admin/orders' },
        { label: 'Orders', to: '/admin/orders' },
        { label, to: path },
      ]
    }
    if (path.startsWith('/admin/orders/') && path !== '/admin/orders') {
      const orderId = path.split('/admin/orders/')[1]
      const label = orderId.startsWith('#') ? orderId : `#${orderId.toUpperCase()}`
      return [
        { label: 'Admin', to: '/admin' },
        { label: 'Commerce', to: '/admin/orders' },
        { label: 'Orders', to: '/admin/orders' },
        { label, to: path },
      ]
    }
    if (path.startsWith('/admin/orders')) {
      return [
        { label: 'Admin', to: '/admin' },
        // { label: 'Commerce', to: '/admin/orders' },
        { label: 'Orders', to: '/admin/orders' },
      ]
    }
    if (path.startsWith('/admin/products/new')) {
      return [
        { label: 'Admin', to: '/admin' },
        { label: 'Products & Catalog', to: '/admin/products' },
        { label: 'Add Product', to: '/admin/products/new' },
      ]
    }
    if (path.startsWith('/admin/products/') && path !== '/admin/products') {
      return [
        { label: 'Admin', to: '/admin' },
        { label: 'Products & Catalog', to: '/admin/products' },
        { label: 'Edit Product', to: path },
      ]
    }
    if (path.startsWith('/admin/products')) {
      return [
        { label: 'Admin', to: '/admin' },
        { label: 'Products & Catalog', to: '/admin/products' },
      ]
    }
    if (path.startsWith('/admin/categories')) {
      return [
        { label: 'Admin', to: '/admin' },
        { label: 'Categories & Taxonomy', to: '/admin/categories' },
      ]
    }
    return [
      { label: 'Admin', to: '/admin' },
      { label: 'Dashboard Overview', to: '/admin' },
    ]
  }

  const breadcrumbs = getBreadcrumbs()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-4 sm:px-6 flex items-center justify-between gap-4 border-b border-outline-variant/60 shadow-[0_1px_8px_rgba(36,51,49,0.03)]">
      {/* Left: Mobile Toggle & Fixed Top Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-on-surface-variant whitespace-nowrap overflow-x-auto">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <div key={crumb.to + idx} className="flex items-center gap-1.5 shrink-0">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-outline-variant" />}
                {isLast ? (
                  <span className="font-semibold text-on-surface">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} className="hover:text-primary transition-colors font-medium">
                    {crumb.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Right Actions: Quick Add Product CTA, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Product CTA */}
        <Link
          to="/admin/products/new"
          className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        {/* Notifications Icon with Counter */}
        <button
          type="button"
          title="3 Unread Alerts"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer border border-outline-variant/60 shadow-xs"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User Profile Menu with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/60 shadow-xs bg-white"
          >
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {userName[0]}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-outline-variant/60 shadow-xl py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2.5 border-b border-outline-variant/40">
                <p className="text-xs font-bold text-on-surface truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {userEmail}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Store className="w-4 h-4 text-primary" />
                  <span>Customer Storefront</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Settings className="w-4 h-4 text-on-surface-variant" />
                  <span>Console Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
