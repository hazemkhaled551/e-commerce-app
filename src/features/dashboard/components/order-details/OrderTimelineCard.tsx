import { useState } from 'react'
import {
  History,
  Printer,
  Boxes,
  ShieldCheck,
  CreditCard,
  ShoppingCart,
  FileText,
  Truck,
  PauseCircle,
  Send,
} from 'lucide-react'
import type { OrderTimelineEvent } from '../../types/orderDetails'

interface OrderTimelineCardProps {
  timeline: OrderTimelineEvent[]
  onAddStaffNote: (note: string) => void
}

export function OrderTimelineCard({
  timeline,
  onAddStaffNote,
}: OrderTimelineCardProps) {
  const [noteText, setNoteText] = useState('')

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    onAddStaffNote(noteText.trim())
    setNoteText('')
  }

  const renderEventIcon = (type: OrderTimelineEvent['iconType']) => {
    switch (type) {
      case 'print':
        return <Printer className="w-3.5 h-3.5 text-primary" />
      case 'inventory':
        return <Boxes className="w-3.5 h-3.5 text-secondary" />
      case 'fraud':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
      case 'created':
        return <ShoppingCart className="w-3.5 h-3.5 text-on-surface-variant" />
      case 'dispatch':
        return <Truck className="w-3.5 h-3.5 text-teal-600" />
      case 'hold':
        return <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
      case 'note':
      default:
        return <FileText className="w-3.5 h-3.5 text-primary" />
    }
  }

  const getIconContainerStyle = (type: OrderTimelineEvent['iconType']) => {
    switch (type) {
      case 'print':
        return 'bg-primary/10 border-primary/20'
      case 'inventory':
        return 'bg-secondary/10 border-secondary/20'
      case 'fraud':
      case 'payment':
        return 'bg-emerald-50 border-emerald-200'
      case 'dispatch':
        return 'bg-teal-50 border-teal-200'
      case 'hold':
        return 'bg-amber-50 border-amber-200'
      case 'created':
        return 'bg-surface-container border-outline-variant/60'
      case 'note':
      default:
        return 'bg-primary/10 border-primary/20'
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-outline-variant/60 p-5 sm:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0 border border-outline-variant/60">
            <History className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Order Activity &amp; Audit Trail
            </h2>
            <p className="text-xs text-on-surface-variant">
              Immutable system event log and operational annotations
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/50">
          {timeline.length} Logged Events
        </span>
      </div>

      {/* Vertical Timeline Graphic */}
      <div className="relative pl-6 sm:pl-8 flex flex-col gap-5 py-2">
        {/* Continuous Timeline Rail */}
        <div className="absolute left-3.5 sm:left-4.5 top-3 bottom-4 w-0.5 bg-outline-variant/60" />

        {timeline.map((event) => (
          <div key={event.id} className="relative flex items-start gap-3 sm:gap-4 group">
            {/* Circular Node Icon */}
            <div
              className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110 bg-white ${getIconContainerStyle(
                event.iconType
              )}`}
            >
              {renderEventIcon(event.iconType)}
            </div>

            {/* Event Description & Metadata */}
            <div className="flex flex-col gap-1 w-full pl-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-xs text-on-surface">
                  {event.title}
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Internal Staff Annotation Input */}
      <form
        onSubmit={handlePostNote}
        className="pt-4 border-t border-outline-variant/50 flex flex-col gap-2"
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Internal Staff Annotation (Not visible to customer)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add warehouse, packing, or special handling notes..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
          <button
            type="submit"
            disabled={!noteText.trim()}
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-surface-container disabled:text-on-surface-variant/50 disabled:cursor-not-allowed text-on-primary font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Staff Note</span>
          </button>
        </div>
      </form>
    </section>
  )
}

