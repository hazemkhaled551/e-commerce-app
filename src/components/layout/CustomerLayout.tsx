import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart'
import { PageLoader } from '@/components/feedback/PageLoader'

/**
 * CustomerLayout
 * Dedicated storefront layout for customer-facing views:
 * Includes customer header, dynamic route outlet, global cart drawer, and storefront footer.
 */
export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <CartDrawer />
      <Footer />
    </div>
  )
}

