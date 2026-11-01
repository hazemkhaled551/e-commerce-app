import { Link } from 'react-router-dom'

interface CatalogHeaderProps {
  onExport: () => void
  onAddProduct: () => void
}

export function CatalogHeader({ onExport, onAddProduct }: CatalogHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-lg">
      <div className="flex flex-col gap-space-xs">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link to="/admin" className="hover:text-primary cursor-pointer transition-colors">
            Admin
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Catalog</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Products</span>
        </div>

        {/* Headline */}
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Products &amp; Catalog
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
          Manage master SKU catalog, visibility channels, variant structures, and multi-location availability across all storefronts.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-space-sm flex-wrap shrink-0">
        <button
          type="button"
          onClick={onExport}
          className="h-10 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-semibold flex items-center gap-space-xs shadow-sm hover:bg-surface-container-low transition-all cursor-pointer border border-outline-variant/20"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            file_download
          </span>
          <span>Export Catalog</span>
        </button>

        <button
          type="button"
          onClick={onAddProduct}
          className="h-10 px-space-lg rounded-lg bg-primary-container text-on-primary font-body-md text-body-md font-semibold flex items-center gap-space-xs shadow-sm hover:bg-secondary transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add Product</span>
        </button>
      </div>
    </div>
  )
}

