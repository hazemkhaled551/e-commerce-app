import { useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { PageLoader } from '@/components/feedback/PageLoader'

/**
 * AdminLayout
 * Dedicated dashboard layout for store operators and administrators:
 * Features a fixed enterprise sidebar, a contextual top header bar, and main operational workspace.
 */
export function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Persistent Fixed Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Content Viewport (offset on large screens by sidebar width) */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all">
        {/* Persistent Context Header */}
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Operational Main Stage */}
        <main className="relative pt-20 w-full px-space-md sm:px-space-lg flex-1 bg-background">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

