export interface PromoBannerProps {
  badge?: string
  headline: string
  description: string
  couponCode?: string
  couponRequirement?: string
  buttonText: string
  onClaim?: () => void
}

export function PromoBanner({
  badge = 'Seasonal Privilege',
  headline,
  description,
  couponCode = 'SPRING25',
  couponRequirement = 'Min $100 order',
  buttonText = 'Claim Spring Discount',
  onClaim,
}: PromoBannerProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-8 lg:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 my-6">
      {/* Decorative background blur element */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col items-start max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-caps text-label-caps font-bold tracking-wider uppercase mb-3 shadow-sm">
          {badge}
        </div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
          {headline}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-4">
          {description}
        </p>
        {couponCode && (
          <div className="inline-flex items-center gap-3 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm text-on-surface font-body-sm text-body-sm font-semibold">
            <span className="material-symbols-outlined text-primary text-base">sell</span>
            <span>
              Use code <span className="text-primary font-bold">{couponCode}</span> at checkout • {couponRequirement}
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 relative z-10 w-full md:w-auto flex flex-col items-center sm:items-start">
        <button
          type="button"
          onClick={onClaim}
          className="w-full md:w-auto bg-primary hover:bg-secondary text-on-primary font-body-md text-body-md font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{buttonText}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
        <span className="text-[11px] text-outline mt-2 text-center md:text-left">
          Applied automatically at checkout for eligible carts
        </span>
      </div>
    </div>
  )
}
