import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductsPage, ProductDetailPage } from '@/features/products'
import { CartDrawer } from '@/features/cart'
import {
  LoginPage,
  RegisterPage,
  VerifyPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@/features/auth'

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header />
      <ProductsPage />
      <CartDrawer />
      <Footer />
    </div>
  )
}

function ProductDetailLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header />
      <ProductDetailPage />
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

