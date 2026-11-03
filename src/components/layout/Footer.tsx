import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/60 mt-12 pt-14 pb-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-outline-variant/50">
          {/* Logo & Mission Column (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4 pr-4">
            <Logo size="sm" />
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm">
              Nexa Store crafts tactile, high-performance hardware and lifestyle artifacts for modern spaces. Designed with meticulous craft and durable materials.
            </p>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs pt-1">
              <span className="material-symbols-outlined text-stock-in text-base">verified</span>
              <span className="font-semibold text-on-surface">
                ISO/IEC 27001 Certified Security
              </span>
            </div>
          </div>

          {/* Shop Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-bold text-on-surface tracking-wider uppercase">
              Shop Collections
            </span>
            <Link
              to="/"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Audio &amp; Acoustics
            </Link>
            <Link
              to="/"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Workspace &amp; Desk
            </Link>
            <Link
              to="/"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Kitchen &amp; Culinary
            </Link>
            <Link
              to="/"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Everyday &amp; EDC
            </Link>
            <Link
              to="/"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Proven Best Sellers
            </Link>
          </div>

          {/* Customer Care Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-bold text-on-surface tracking-wider uppercase">
              Customer Care
            </span>
            <a
              href="#tracking"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Order Tracking
            </a>
            <a
              href="#rma"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              30-Day Returns &amp; RMA
            </a>
            <a
              href="#warranty"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              2-Year Hardware Warranty
            </a>
            <a
              href="#shipping"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Shipping &amp; Logistics
            </a>
            <a
              href="#concierge"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Concierge Help Desk
            </a>
          </div>

          {/* Company & Legal Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-bold text-on-surface tracking-wider uppercase">
              Trust &amp; Legal
            </span>
            <a
              href="#about"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              About the Studio
            </a>
            <a
              href="#sustainability"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Sustainability Standards
            </a>
            <a
              href="#security"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Security Whitepaper
            </a>
            <a
              href="#privacy"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>

          {/* Newsletter Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-bold text-on-surface tracking-wider uppercase">
              Hardware Dispatch
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Weekly material notes, release drops, and firmware updates.
            </p>
            {subscribed ? (
              <span className="text-xs font-semibold text-stock-in flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Subscribed
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 text-xs rounded-xl border border-outline-variant/60 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-on-primary text-xs font-semibold py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Join Dispatch
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal Bottom Sub-bar with Payment methods */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-outline text-[12px]">
          <div>
            © 2026 Nexa Retail Technologies Inc. • 256-Bit SSL Encrypted Checkout • ISO/IEC 27001 Compliant
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40 font-mono text-[10px] text-on-surface font-semibold">
              VISA
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40 font-mono text-[10px] text-on-surface font-semibold">
              MASTERCARD
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40 font-mono text-[10px] text-on-surface font-semibold">
              AMEX
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40 font-mono text-[10px] text-on-surface font-semibold">
              APPLE PAY
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant/40 font-mono text-[10px] text-on-surface font-semibold">
              PAYPAL
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a className="hover:text-on-surface transition-colors" href="#privacy">
              Privacy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#terms">
              Terms
            </a>
            <a className="hover:text-on-surface transition-colors" href="#cookies">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
