export function CategoryTopBanner() {
  return (
    <div className="mb-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm bg-surface-container-low p-space-md rounded-xl shadow-xs border border-outline-variant/15">
      <div className="flex items-center gap-space-sm">
        <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-xs">
          <span className="material-symbols-outlined text-[20px]">account_tree</span>
        </span>
        <div>
          <p className="font-body-md text-body-md text-on-surface font-semibold">
            Catalog Hierarchy Synced
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Storefront navigation cache was refreshed 14 minutes ago across 3 regional edge CDN nodes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-space-xs self-end md:self-auto flex-wrap">
        <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-semibold">
          28 Nodes
        </span>
        <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
          Tier-1 Multi-Store
        </span>
      </div>
    </div>
  )
}

