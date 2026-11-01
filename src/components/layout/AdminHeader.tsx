import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const userName = user?.name || 'Alexander Wright'
  const userEmail = user?.email || 'admin@nexa-store.com'

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
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-md sm:px-space-lg flex items-center justify-between gap-space-md border-b border-outline-variant/15">
      {/* Left Context: Toggle button, Breadcrumb & Production live pill */}
      <div className="flex items-center gap-space-sm sm:gap-space-md min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        {/* Breadcrumb path */}
        <div className="hidden md:flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
          <Link to="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">Dashboard</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Operations Overview</span>
        </div>

        {/* Environment status pill */}
        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span>Production • nexa-store.com</span>
        </div>
      </div>

      {/* Right Actions: Global Search, Quick Order, Notifications, User Menu */}
      <div className="flex items-center gap-space-xs sm:gap-space-sm flex-1 max-w-md justify-end">
        {/* Quick Search with shortcut */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search catalog, orders..."
            className="w-full pl-9 pr-14 py-space-xs h-9 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-label-caps text-label-caps px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
            ⌘K
          </span>
        </div>

        {/* New Order Button */}
        <button
          type="button"
          className="h-9 px-space-md rounded-xl bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold flex items-center gap-space-xs hover:bg-secondary transition-all shadow-sm cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden lg:inline">New Order</span>
        </button>

        {/* Notifications Icon with Counter */}
        <button
          type="button"
          title="3 Unread Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error text-on-error font-label-caps text-[9px] flex items-center justify-center leading-none font-bold">
            3
          </span>
        </button>

        {/* Help Icon */}
        <button
          type="button"
          title="System Documentation"
          className="w-9 h-9 rounded-xl hidden sm:flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>

        {/* User Profile Menu with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-space-xs pl-space-xs cursor-pointer p-1 rounded-xl hover:bg-surface-container transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase">
              {userName[0]}
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2 border-b border-outline-variant/15">
                <p className="font-headline-sm text-body-sm font-semibold text-on-surface truncate">
                  {userName}
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                  {userEmail}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    storefront
                  </span>
                  <span>View Customer Store</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    settings
                  </span>
                  <span>Console Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors cursor-pointer text-left font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
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

