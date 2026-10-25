export interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating?: number
  avatarInitial?: string
}

export function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
  avatarInitial,
}: TestimonialCardProps) {
  const initial =
    avatarInitial ||
    author
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  const stars = '★'.repeat(rating)
  const remaining = '★'.repeat(Math.max(0, 5 - rating))

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-amber-500 text-sm">
            <span>{stars}</span>
            {remaining && <span className="text-amber-300">{remaining}</span>}
          </div>
          <span className="font-label-caps text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified Buyer
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface italic mb-4">
          “{quote}”
        </p>
      </div>
      <div className="pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-body-sm text-body-sm font-bold text-on-surface truncate">{author}</span>
          <span className="font-body-sm text-[11px] text-outline truncate">{role}</span>
        </div>
      </div>
    </div>
  )
}
