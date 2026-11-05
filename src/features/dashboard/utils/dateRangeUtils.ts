import type { DateRangeFilter } from '../types/dashboard'

/**
 * Format a Date object as YYYY-MM-DD
 */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Format YYYY-MM-DD into a localized friendly date string (e.g. "Nov 4, 2026")
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) return dateStr
  const [y, m, d] = parts
  const date = new Date(y, m - 1, d)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format a start/end date pair into a readable range text, e.g. "(Nov 4, 2026)" or "(Oct 28 – Nov 4, 2026)"
 */
export function formatRangeText(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return ''

  const partsS = startStr.split('-').map(Number)
  const partsE = endStr.split('-').map(Number)
  if (partsS.length !== 3 || partsE.length !== 3) return `(${startStr} – ${endStr})`

  const [sy, sm, sd] = partsS
  const [ey, em, ed] = partsE
  const sDate = new Date(sy, sm - 1, sd)
  const eDate = new Date(ey, em - 1, ed)

  if (startStr === endStr) {
    return `(${sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`
  }

  if (sy === ey) {
    const sFormatted = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const eFormatted = eDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `(${sFormatted} – ${eFormatted})`
  }

  const sFormatted = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const eFormatted = eDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `(${sFormatted} – ${eFormatted})`
}

/**
 * Compute dynamic real-time date presets based on the current calendar date.
 * No hardcoded dates.
 */
export function getDynamicDateRangePresets(): DateRangeFilter[] {
  const now = new Date()
  const todayStr = toIsoDate(now)

  // Yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = toIsoDate(yesterday)

  // Last 7 days (including today = 7 days)
  const d7 = new Date(now)
  d7.setDate(d7.getDate() - 6)
  const d7Str = toIsoDate(d7)

  // Last 30 days
  const d30 = new Date(now)
  d30.setDate(d30.getDate() - 29)
  const d30Str = toIsoDate(d30)

  // Last 90 days
  const d90 = new Date(now)
  d90.setDate(d90.getDate() - 89)
  const d90Str = toIsoDate(d90)

  // This Month (1st of current month to today)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthStr = toIsoDate(thisMonthStart)

  // Year to Date (Jan 1 of this year to today)
  const ytdStart = new Date(now.getFullYear(), 0, 1)
  const ytdStr = toIsoDate(ytdStart)

  // Last 12 Months
  const d12m = new Date(now)
  d12m.setFullYear(d12m.getFullYear() - 1)
  const d12mStr = toIsoDate(d12m)

  return [
    {
      period: 'today',
      label: 'Today',
      startDate: todayStr,
      endDate: todayStr,
      dateRangeText: formatRangeText(todayStr, todayStr),
    },
    {
      period: 'today',
      label: 'Yesterday',
      startDate: yesterdayStr,
      endDate: yesterdayStr,
      dateRangeText: formatRangeText(yesterdayStr, yesterdayStr),
    },
    {
      period: '7d',
      label: 'Last 7 Days',
      startDate: d7Str,
      endDate: todayStr,
      dateRangeText: formatRangeText(d7Str, todayStr),
    },
    {
      period: '30d',
      label: 'Last 30 Days',
      startDate: d30Str,
      endDate: todayStr,
      dateRangeText: formatRangeText(d30Str, todayStr),
    },
    {
      period: 'this_month',
      label: 'This Month',
      startDate: thisMonthStr,
      endDate: todayStr,
      dateRangeText: formatRangeText(thisMonthStr, todayStr),
    },
    {
      period: '90d',
      label: 'Last 90 Days',
      startDate: d90Str,
      endDate: todayStr,
      dateRangeText: formatRangeText(d90Str, todayStr),
    },
    {
      period: 'ytd',
      label: 'Year to Date (YTD)',
      startDate: ytdStr,
      endDate: todayStr,
      dateRangeText: formatRangeText(ytdStr, todayStr),
    },
    {
      period: '12m',
      label: 'Last 12 Months',
      startDate: d12mStr,
      endDate: todayStr,
      dateRangeText: formatRangeText(d12mStr, todayStr),
    },
  ]
}

/**
 * Create a custom date range filter from arbitrary start & end dates
 */
export function createCustomDateRange(startDate: string, endDate: string): DateRangeFilter {
  // Ensure start is before or equal to end
  const s = startDate <= endDate ? startDate : endDate
  const e = startDate <= endDate ? endDate : startDate

  return {
    period: 'custom',
    label: 'Custom Range',
    startDate: s,
    endDate: e,
    dateRangeText: formatRangeText(s, e),
  }
}

