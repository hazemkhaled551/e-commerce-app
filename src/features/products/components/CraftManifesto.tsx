export function CraftManifesto() {
  const pillars = [
    {
      icon: 'architecture',
      title: 'Honest Materiality',
      description:
        'Engineered from solid hardwoods, enameled iron, and aerospace alloys. Zero planned obsolescence.',
    },
    {
      icon: 'published_with_changes',
      title: '30-Day In-Home Trial',
      description:
        'Experience each object in your actual daily routine. Prepaid return shipping with zero restocking fees.',
    },
    {
      icon: 'verified_user',
      title: '2-Year Direct Warranty',
      description:
        'Official hardware replacement and repair coverage directly from our engineering team.',
    },
    {
      icon: 'local_shipping',
      title: 'Carbon-Neutral Dispatch',
      description:
        'Orders ship within 4 hours in 100% recyclable molded fiber packaging with carbon offsets.',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
      <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-12 border border-outline-variant/60 shadow-[0_4px_24px_rgba(36,51,49,0.02)]">
        {/* Header */}
        <div className="max-w-xl mb-10">
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            Engineering Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
            Built for Decades, Not Seasons
          </h2>
          <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Every product in our catalog adheres to strict material, acoustic, and mechanical specifications.
          </p>
        </div>

        {/* 4 Pillars Grid with architectural divider styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex flex-col items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">{pillar.icon}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

