import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminSidebar({ isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  const userName = user?.name || 'Alexander Wright'
  const userRole = user?.role === 'CUSTOMER' ? 'Store Administrator' : 'Operations Lead'

  const isCurrent = (path: string) => {
    if (path === '/admin' || path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out border-r border-outline-variant/20 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Console Header */}
          <div className="p-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/10">
            <Link to="/admin" className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                  Nexa Admin
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-none">
                  Store Console
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Structure */}
          <nav className="flex flex-col gap-space-md px-space-md py-space-md">
            {/* 1. OVERVIEW */}
            <div className="flex flex-col gap-space-xs">
              <span className="px-space-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Overview
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                  isCurrent('/admin')
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span className="font-body-md text-body-md">Dashboard</span>
                </div>
              </Link>
            </div>

            {/* 2. COMMERCE */}
            <div className="flex flex-col gap-space-xs">
              <span className="px-space-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Commerce
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span className="font-body-md text-body-md">Orders</span>
                </div>
                <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                  14 pending
                </span>
              </Link>
              <Link
                to="/admin/products"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                  isCurrent('/admin/products')
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  <span className="font-body-md text-body-md">Products &amp; Catalog</span>
                </div>
              </Link>
              <Link
                to="/admin/categories"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                  isCurrent('/admin/categories')
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">category</span>
                  <span className="font-body-md text-body-md">Categories</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">warehouse</span>
                  <span className="font-body-md text-body-md">Inventory &amp; Stock</span>
                </div>
                <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">
                  5 low
                </span>
              </Link>
            </div>

            {/* 3. CUSTOMERS & MARKETING */}
            <div className="flex flex-col gap-space-xs">
              <span className="px-space-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Customers &amp; Marketing
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                  <span className="font-body-md text-body-md">Customers</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">reviews</span>
                  <span className="font-body-md text-body-md">Reviews &amp; UGC</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">loyalty</span>
                  <span className="font-body-md text-body-md">Promotions &amp; Coupons</span>
                </div>
              </Link>
            </div>

            {/* 4. ANALYTICS & OPS */}
            <div className="flex flex-col gap-space-xs">
              <span className="px-space-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Analytics &amp; Ops
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">monitoring</span>
                  <span className="font-body-md text-body-md">Reports &amp; Analytics</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span className="font-body-md text-body-md">Employees &amp; Roles</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  <span className="font-body-md text-body-md">Store Settings</span>
                </div>
              </Link>
            </div>

            {/* Quick exit to customer storefront */}
            <div className="pt-space-xs border-t border-outline-variant/15">
              <Link
                to="/"
                onClick={onCloseMobile}
                className="flex items-center gap-space-sm px-space-sm py-2 rounded-xl text-primary hover:bg-surface-container-high transition-colors font-body-sm font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span>View Customer Storefront</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom profile card / system status */}
        <div className="p-space-md m-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-caps text-label-caps text-on-surface-variant">API Healthy</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant font-mono">
              v2.14.0
            </span>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs uppercase">
                {userName[0]}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-container ring-2 ring-surface-container-low" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                {userName}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant truncate">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

