import { Plus } from 'lucide-react'

interface CategoryHeaderProps {
  onAddCategory: () => void
}

export function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
          Categories &amp; Taxonomy
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl">
          Organize your store catalog with hierarchical categories, SEO slugs, and merchandising banners for omni-channel discovery.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2 shrink-0">
        <button
          type="button"
          onClick={onAddCategory}
          className="h-9 px-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-xs text-xs font-semibold cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>
    </div>
  )
}
