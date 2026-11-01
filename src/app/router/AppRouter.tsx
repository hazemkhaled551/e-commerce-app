import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerLayout } from '@/components/layout/CustomerLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { FullPageLoader } from '@/components/feedback/PageLoader'

// Lazy-loaded customer storefront pages
const ProductsPage = lazy(() =>
  import('@/features/products/pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/features/products/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
)

// Lazy-loaded admin dashboard pages
const DashboardOverviewPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardOverviewPage }))
)
const ProductsCatalogPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.ProductsCatalogPage }))
)
const ProductEditPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.ProductEditPage }))
)
const CategoriesPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.CategoriesPage }))
)

// Lazy-loaded auth pages
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

export function AppRouter() {
  return (
    <Routes>
      {/* 1. Customer Storefront Layout (Public Customer Views) */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
      </Route>

      {/* 2. Admin Dashboard Layout (Unprotected for now until backend implements roles) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="dashboard" element={<DashboardOverviewPage />} />
        <Route path="products" element={<ProductsCatalogPage />} />
        <Route path="products/new" element={<ProductEditPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="products/:id" element={<ProductEditPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

      {/* 3. Authentication Routes */}
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
