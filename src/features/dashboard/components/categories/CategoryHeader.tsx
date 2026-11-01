import { Link } from 'react-router-dom'

interface CategoryHeaderProps {
  onAddCategory: () => void
}

export function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-xl">
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link to="/admin" className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            Admin
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/admin/products" className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            Products &amp; Catalog
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Categories &amp; Taxonomy</span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Categories &amp; Taxonomy
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
          Organize your store catalog with hierarchical categories, SEO slugs, and merchandising banners for omni-channel discovery.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-space-xs">
        <button
          type="button"
          onClick={onAddCategory}
          className="h-10 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-secondary transition-all flex items-center gap-space-xs shadow-sm font-body-md text-body-md font-semibold cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Category</span>
        </button>
      </div>
    </div>
  )
}

