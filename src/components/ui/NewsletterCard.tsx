import { useState } from 'react'
import type { FormEvent } from 'react'

export interface NewsletterCardProps {
  title?: string
  description?: string
  disclaimer?: string
}

export function NewsletterCard({
  title = 'Stay Ahead of Limited Drops & Private Sales',
  description = 'Join 25,000+ members receiving weekly design digests, firmware updates, and early access codes.',
  disclaimer = 'No spam. Unsubscribe with a single click anytime.',
}: NewsletterCardProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-12 shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-surface-container text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
      </div>

      <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight max-w-xl">
        {title}
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mt-2 mb-6">
        {description}
      </p>

      {subscribed ? (
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stock-in-bg text-stock-in font-body-sm text-body-sm font-semibold border border-stock-in/30">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Thank you for subscribing to Nexa Store drops!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-outline absolute left-3 top-3 text-lg pointer-events-none">
              mail
            </span>
            <input
              className="w-full bg-surface-container-low pl-10 pr-4 py-3 rounded-xl text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
              placeholder="Enter your work or personal email..."
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="bg-primary hover:bg-secondary text-on-primary font-body-sm text-body-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      )}

      <span className="text-[12px] text-outline mt-3">{disclaimer}</span>
    </div>
  )
}
