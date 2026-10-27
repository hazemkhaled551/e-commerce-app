import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart'
import { PageLoader, FullPageLoader } from '@/components/feedback/PageLoader'

// Lazy-loaded pages with separate chunk code-splitting
const ProductsPage = lazy(() =>
  import('@/features/products/pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/features/products/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const VerifyPage = lazy(() =>
  import('@/features/auth/pages/VerifyPage').then((m) => ({ default: m.VerifyPage }))
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
)

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header />
      <Suspense fallback={<PageLoader />}>
        <ProductsPage />
      </Suspense>
      <CartDrawer />
      <Footer />
    </div>
  )
}

function ProductDetailLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header />
      <Suspense fallback={<PageLoader />}>
        <ProductDetailPage />
      </Suspense>
      <CartDrawer />
      <Footer />
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Main Storefront Route */}
      <Route path="/" element={<StorefrontLayout />} />

      {/* Product Detail Routes */}
      <Route path="/products/:id" element={<ProductDetailLayout />} />
      <Route path="/product/:id" element={<ProductDetailLayout />} />
      <Route path="/product-detail" element={<ProductDetailLayout />} />

      {/* Authentication Routes */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<FullPageLoader />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<FullPageLoader />}>
            <RegisterPage />
          </Suspense>
        }
      />
      <Route
        path="/verify"
        element={
          <Suspense fallback={<FullPageLoader />}>
            <VerifyPage />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<FullPageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Suspense fallback={<FullPageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


