import type { OrderFilterTab } from '../../types/dashboard'

interface OrdersStatusTabsProps {
  activeTab: OrderFilterTab
  onTabChange: (tab: OrderFilterTab) => void
  counts: {
    all: number
    unfulfilled: number
    inTransit: number
    delivered: number
    returned: number
    cancelled: number
  }
}

export function OrdersStatusTabs({ activeTab, onTabChange, counts }: OrdersStatusTabsProps) {
  const tabs: { key: OrderFilterTab; label: string; count: number; badgeColor?: string }[] = [
    { key: 'all', label: 'All Orders', count: counts.all },
    {
      key: 'unfulfilled',
      label: 'Unfulfilled / Processing',
      count: counts.unfulfilled,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      key: 'in_transit',
      label: 'In Transit',
      count: counts.inTransit,
      badgeColor: 'bg-primary/10 text-primary',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      count: counts.delivered,
      badgeColor: 'bg-emerald-50 text-emerald-800',
    },
    {
      key: 'returned',
      label: 'Returns & Claims',
      count: counts.returned,
      badgeColor: 'bg-blue-50 text-blue-800',
    },
    {
      key: 'cancelled',
      label: 'Cancelled & Failed',
      count: counts.cancelled,
      badgeColor: 'bg-red-50 text-red-800',
    },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 border-b border-outline-variant/60 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : tab.badgeColor || 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {tab.count.toLocaleString()}
            </span>
          </button>
        )
      })}
    </div>
  )
}

