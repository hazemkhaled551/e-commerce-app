import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest mt-10 pt-12 pb-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          {/* Logo & Mission Column */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4 pr-6">
            <Logo size="sm" />
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-sm">
              Nexa Store engineers tactile, high-performance hardware and lifestyle artifacts for modern spaces. Designed with meticulous craft and durable materials.
            </p>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm pt-2">
              <span className="material-symbols-outlined text-stock-in">verified</span>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                ISO/IEC 27001 Certified Security
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col gap-2.5">
            <span className="font-body-md text-body-md font-bold text-on-surface tracking-wider uppercase text-xs">
              Shop
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#electronics">
              Audio &amp; Acoustics
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#workspace">
              Workspace &amp; Desk
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#kitchen">
              Kitchen &amp; Culinary
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#power">
              Power &amp; Chargers
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#new">
              New Arrivals
            </a>
          </div>

          {/* Customer Care Column */}
          <div className="flex flex-col gap-2.5">
            <span className="font-body-md text-body-md font-bold text-on-surface tracking-wider uppercase text-xs">
              Customer Care
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#tracking">
              Order Tracking
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#rma">
              RMA Returns &amp; Exchanges
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#warranty">
              Hardware Warranty
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#shipping">
              Shipping Policies
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#support">
              Help Desk Concierge
            </a>
          </div>

          {/* Company & Legal Column */}
          <div className="flex flex-col gap-2.5">
            <span className="font-body-md text-body-md font-bold text-on-surface tracking-wider uppercase text-xs">
              Company &amp; Trust
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#about">
              About Us
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#sustainability">
              Sustainability Standards
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#security">
              Security Whitepaper
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#privacy">
              Privacy Policy
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#terms">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Legal Bottom Sub-bar with Payment methods */}
        <div className="pt-6 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4 text-outline text-[12px]">
          <div>
            © 2025 Nexa Retail Technologies Inc. • 256-Bit SSL Encrypted Checkout • ISO/IEC 27001 Compliant
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="px-2 py-0.5 rounded bg-surface-container-low font-label-caps text-label-caps text-on-surface font-semibold">
              VISA
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-low font-label-caps text-label-caps text-on-surface font-semibold">
              MC
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-low font-label-caps text-label-caps text-on-surface font-semibold">
              AMEX
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-low font-label-caps text-label-caps text-on-surface font-semibold">
              APPLE PAY
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-low font-label-caps text-label-caps text-on-surface font-semibold">
              PAYPAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a className="hover:text-on-surface transition-colors" href="#privacy">
              Privacy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#terms">
              Terms
            </a>
            <a className="hover:text-on-surface transition-colors" href="#cookies">
              Cookie Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
