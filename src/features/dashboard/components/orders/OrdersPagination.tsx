import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OrdersPaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function OrdersPagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: OrdersPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="p-4 bg-white rounded-2xl shadow-xs border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-on-surface-variant text-xs">
        <span>
          Showing <strong className="text-on-surface font-semibold">1</strong> to{' '}
          <strong className="text-on-surface font-semibold">{Math.min(pageSize, totalCount)}</strong> of{' '}
          <strong className="text-on-surface font-semibold">{totalCount.toLocaleString()}</strong> orders
        </span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10) || 10)}
            className="h-8 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-medium border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer shadow-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Page Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-lg bg-white border border-outline-variant/60 text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 1
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-outline-variant/60 text-on-surface hover:bg-surface-container'
          }`}
        >
          1
        </button>

        <button
          type="button"
          onClick={() => onPageChange(2)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 2
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-outline-variant/60 text-on-surface hover:bg-surface-container'
          }`}
        >
          2
        </button>

        <button
          type="button"
          onClick={() => onPageChange(3)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 3
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-outline-variant/60 text-on-surface hover:bg-surface-container'
          }`}
        >
          3
        </button>

        <span className="px-1 text-on-surface-variant text-xs">...</span>

        <button
          type="button"
          onClick={() => onPageChange(185)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 185
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-outline-variant/60 text-on-surface hover:bg-surface-container'
          }`}
        >
          185
        </button>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-lg bg-white border border-outline-variant/60 text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

