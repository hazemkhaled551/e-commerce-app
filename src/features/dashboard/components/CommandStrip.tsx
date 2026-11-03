import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, Check } from 'lucide-react'
import type { DateRangeFilter } from '../types/dashboard'
import { DATE_RANGE_OPTIONS } from '../data/mockDashboardData'

interface CommandStripProps {
  currentRange?: DateRangeFilter
  onDateRangeChange?: (filter: DateRangeFilter) => void
}

export function CommandStrip({
  currentRange = DATE_RANGE_OPTIONS[2], // default: 30d
  onDateRangeChange,
}: CommandStripProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option: DateRangeFilter) => {
    onDateRangeChange?.(option)
    setIsOpen(false)
  }

  return (
    <section className="py-4 flex flex-col gap-4">
      {/* Top Title Strip & Action Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Real-time store performance, order fulfillment velocity, and critical inventory alerts across all channels.
          </p>
        </div>

        {/* Date Filter Dropdown (Active & API-Ready) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="h-10 px-3.5 rounded-xl bg-white text-on-surface border border-outline-variant/60 shadow-xs hover:border-primary/40 hover:bg-surface-container-low transition-all flex items-center gap-2 text-xs cursor-pointer font-medium select-none"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-bold text-on-surface">{currentRange.label}</span>
            <span className="text-on-surface-variant hidden sm:inline font-mono">
              {currentRange.dateRangeText}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-primary' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-outline-variant/60 py-1.5 z-50 animate-fade-in">
              <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/40 mb-1">
                Filter by Date Range (API)
              </div>
              <div className="flex flex-col max-h-72 overflow-y-auto">
                {DATE_RANGE_OPTIONS.map((option) => {
                  const isSelected = currentRange.period === option.period
                  return (
                    <button
                      key={option.period}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`px-3.5 py-2.5 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span>{option.label}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          {option.dateRangeText}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
