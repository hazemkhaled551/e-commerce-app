import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, ChevronDown, Check, ArrowRight, Clock, Sparkles } from 'lucide-react'
import type { DateRangeFilter } from '../types/dashboard'
import {
  toIsoDate,
  formatFriendlyDate,
  formatRangeText,
  getDynamicDateRangePresets,
  createCustomDateRange,
} from '../utils/dateRangeUtils'

interface DateRangePickerProps {
  value?: DateRangeFilter
  onChange?: (range: DateRangeFilter) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const presets = useMemo(() => getDynamicDateRangePresets(), [])
  const defaultRange = presets[3] // Default: Last 30 Days

  const currentRange = value || defaultRange
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Internal draft state for custom start and end dates
  const [draftStart, setDraftStart] = useState<string>(currentRange.startDate)
  const [draftEnd, setDraftEnd] = useState<string>(currentRange.endDate)

  const todayStr = useMemo(() => toIsoDate(new Date()), [])

  // Toggle dropdown and sync draft state
  const handleToggleOpen = () => {
    if (!isOpen) {
      setDraftStart(currentRange.startDate)
      setDraftEnd(currentRange.endDate)
    }
    setIsOpen((prev) => !prev)
  }

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Calculate day difference
  const daysSelected = useMemo(() => {
    if (!draftStart || !draftEnd) return 0
    const start = new Date(draftStart)
    const end = new Date(draftEnd)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 1
  }, [draftStart, draftEnd])

  // Handle Preset Selection
  const handleSelectPreset = (preset: DateRangeFilter) => {
    setDraftStart(preset.startDate)
    setDraftEnd(preset.endDate)
    onChange?.(preset)
    setIsOpen(false)
  }

  // Handle Start Date Input Change
  const handleStartDateChange = (newStart: string) => {
    setDraftStart(newStart)
    if (draftEnd && newStart > draftEnd) {
      setDraftEnd(newStart)
    }
  }

  // Handle End Date Input Change
  const handleEndDateChange = (newEnd: string) => {
    setDraftEnd(newEnd)
    if (draftStart && newEnd < draftStart) {
      setDraftStart(newEnd)
    }
  }

  // Apply Custom Selection
  const handleApplyCustom = () => {
    if (!draftStart || !draftEnd) return
    const customRange = createCustomDateRange(draftStart, draftEnd)
    onChange?.(customRange)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className="h-10 px-3.5 rounded-xl bg-white text-on-surface border border-outline-variant/60 shadow-xs hover:border-primary/50 hover:bg-surface-container-lowest transition-all flex items-center gap-2 text-xs cursor-pointer font-medium select-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Calendar className="w-4 h-4 text-primary shrink-0" />
        <span className="font-bold text-on-surface">{currentRange.label}</span>
        <span className="text-on-surface-variant font-mono text-[11px] hidden sm:inline">
          {currentRange.dateRangeText}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-outline-variant/60 z-50 animate-fade-in overflow-hidden flex flex-col text-left">
          {/* Header */}
          <div className="p-3.5 bg-surface-container-lowest border-b border-outline-variant/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">Select Date Range</h4>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  {daysSelected} {daysSelected === 1 ? 'day' : 'days'} selected: {formatFriendlyDate(draftStart)} → {formatFriendlyDate(draftEnd)}
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Live Filter
            </span>
          </div>

          {/* Main Body (Presets + Custom Range Inputs) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/50 max-h-[360px] overflow-y-auto">
            {/* Left Column: Quick Presets (5 cols) */}
            <div className="sm:col-span-5 p-2 flex flex-col gap-0.5 bg-surface-container-lowest/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-2.5 py-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Quick Presets
              </span>

              {presets.map((preset) => {
                const isSelected =
                  currentRange.period === preset.period &&
                  currentRange.label === preset.label

                return (
                  <button
                    key={`${preset.period}-${preset.label}`}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-primary text-white font-semibold shadow-xs'
                        : 'text-on-surface hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                )
              })}
            </div>

            {/* Right Column: Start & End Date Custom Inputs (7 cols) */}
            <div className="sm:col-span-7 p-4 flex flex-col justify-between gap-4 bg-white">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  Custom Start &amp; End Date
                </span>

                {/* Start Date Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-on-surface flex items-center justify-between">
                    <span>Start Date (تاريخ البداية)</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {formatFriendlyDate(draftStart)}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={draftStart}
                      max={draftEnd || todayStr}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-xl bg-surface-container-lowest text-on-surface font-mono border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-xs"
                    />
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="flex items-center justify-center -my-1 text-on-surface-variant">
                  <ArrowRight className="w-3.5 h-3.5 text-primary rotate-90 sm:rotate-0" />
                </div>

                {/* End Date Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-on-surface flex items-center justify-between">
                    <span>End Date (تاريخ النهاية)</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {formatFriendlyDate(draftEnd)}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={draftEnd}
                      min={draftStart}
                      max={todayStr}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-xl bg-surface-container-lowest text-on-surface font-mono border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Range Preview Box */}
              <div className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Active Selection
                </span>
                <span className="text-xs font-semibold text-on-surface font-mono">
                  {formatRangeText(draftStart, draftEnd)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/50 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const defaultP = presets[3]
                setDraftStart(defaultP.startDate)
                setDraftEnd(defaultP.endDate)
                onChange?.(defaultP)
                setIsOpen(false)
              }}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
            >
              Reset to 30d
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-all cursor-pointer border border-outline-variant/60 shadow-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyCustom}
                className="h-8 px-4 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Range</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
