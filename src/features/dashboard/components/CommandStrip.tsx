import { useState } from 'react'

interface CommandStripProps {
  onSync?: () => void
  onExport?: () => void
  onDateRangeChange?: () => void
}

export function CommandStrip({ onSync, onExport, onDateRangeChange }: CommandStripProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncText, setLastSyncText] = useState('1m ago')

  const handleSyncClick = () => {
    setIsSyncing(true)
    if (onSync) onSync()
    setTimeout(() => {
      setIsSyncing(false)
      setLastSyncText('just now')
    }, 800)
  }

  return (
    <section className="py-space-md flex flex-col gap-space-md">
      {/* Top Title Strip & Action Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Production Live
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Real-time store performance, order fulfillment velocity, and critical inventory alerts across all touchpoints.
          </p>
        </div>

        {/* Action Controls & Date Pickers */}
        <div className="flex flex-wrap items-center gap-space-xs">
          {/* Date Selector Preset */}
          <button
            type="button"
            onClick={onDateRangeChange}
            className="h-9 px-space-sm rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-space-xs font-body-sm text-body-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              calendar_today
            </span>
            <span className="font-semibold">Last 30 Days</span>
            <span className="text-on-surface-variant font-normal">(Mar 17 – Apr 15, 2025)</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              arrow_drop_down
            </span>
          </button>

          {/* Export Action */}
          <button
            type="button"
            onClick={onExport}
            className="h-9 px-space-sm rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-space-xs font-body-sm text-body-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              file_download
            </span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm px-space-sm py-1 rounded-lg bg-surface-container-low">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Data synced {lastSyncText}
          </span>
          <span className="text-outline-variant">•</span>
          <span>
            Auto-refresh interval: <strong className="text-on-surface font-semibold">60s</strong>
          </span>
          <span className="text-outline-variant">•</span>
          <span>
            Store Currency: <strong className="text-on-surface font-semibold">USD ($)</strong>
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="font-label-caps text-label-caps font-semibold">
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

