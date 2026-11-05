import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Warehouse,
  Users,
  Star,
  Tag,
  BarChart3,
  ShieldCheck,
  Settings,
  ExternalLink,
  X,
  Store,
} from 'lucide-react'
import { useAuth } from '@/features/auth'

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminSidebar({ isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  const userName = user?.name || 'Administrator'
  const roleUpper = String(user?.role || '').trim().toUpperCase()
  const userRole =
    roleUpper === 'ADMIN'
      ? 'System Administrator'
      : roleUpper === 'CUSTOMER'
        ? 'Customer Account'
        : user?.role || 'System Administrator'

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
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out border-r border-outline-variant/60 shadow-[0_1px_8px_rgba(36,51,49,0.03)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Console Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-outline-variant/50">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-on-surface leading-tight">
                  NexaStore
                </span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider leading-none">
                  Admin Console
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Structure */}
          <nav className="flex flex-col gap-4 p-3.5">
            {/* 1. OVERVIEW */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-outline">
                Overview
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent('/admin')
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Overview</span>
                </div>
              </Link>
            </div>

            {/* 2. COMMERCE */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-outline">
                Commerce
              </span>
              <Link
                to="/admin/orders"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent('/admin/orders')
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Orders</span>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isCurrent('/admin/orders')
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  14 pending
                </span>
              </Link>

              <Link
                to="/admin/products"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent('/admin/products')
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Products &amp; Catalog</span>
                </div>
              </Link>

              <Link
                to="/admin/categories"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent('/admin/categories')
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderTree className="w-4 h-4 shrink-0" />
                  <span>Categories &amp; Taxonomy</span>
                </div>
              </Link>

              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Warehouse className="w-4 h-4 shrink-0" />
                  <span>Inventory &amp; Stock</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-error/10 text-error text-[10px] font-bold">
                  5 low
                </span>
              </Link>
            </div>

            {/* 3. CUSTOMERS & MARKETING */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-outline">
                Customers &amp; Growth
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Customers</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 shrink-0" />
                  <span>Reviews &amp; Ratings</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>Promotions &amp; Codes</span>
                </div>
              </Link>
            </div>

            {/* 4. ANALYTICS & OPS */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-outline">
                Analytics &amp; System
              </span>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Reports &amp; Analytics</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Employees &amp; Roles</span>
                </div>
              </Link>
              <Link
                to="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Store Settings</span>
                </div>
              </Link>
            </div>

            {/* Storefront Link */}
            <div className="pt-2 border-t border-outline-variant/40">
              <Link
                to="/"
                onClick={onCloseMobile}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors text-xs font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Customer Store</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom Profile & Status Card */}
        <div className="p-3 m-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-on-surface">API Healthy</span>
            </div>
            <span className="font-mono text-[10px] text-outline">v2.14.0</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
              {userName[0]}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-on-surface truncate">
                {userName}
              </span>
              <span className="text-[10px] text-on-surface-variant truncate">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
