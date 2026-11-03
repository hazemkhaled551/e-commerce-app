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
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* 1. Persistent Fixed Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Content Viewport (offset on large screens by sidebar width) */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
        {/* Persistent Context Header */}
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Operational Main Stage */}
        <main className="relative pt-20 w-full px-4 sm:px-6 lg:px-8 pb-12 flex-1 bg-background">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
