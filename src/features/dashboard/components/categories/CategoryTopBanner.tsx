import { FolderTree } from 'lucide-react'

export function CategoryTopBanner() {
  return (
    <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-surface-container-low/70 p-3.5 rounded-2xl border border-outline-variant/60 text-left">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <FolderTree className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface">
            Catalog Taxonomy Synchronized
          </p>
          <p className="text-[11px] text-on-surface-variant">
            Storefront navigation cache was refreshed 14 minutes ago across 3 regional edge CDN nodes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
          28 Nodes
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
          Tier-1 Multi-Store
        </span>
      </div>
    </div>
  )
}
