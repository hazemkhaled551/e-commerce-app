import { useState } from 'react'

interface TaxonomySidebarProps {
  category: string
  brand: string
  collections: string[]
  tags: string[]
  onCategoryChange: (cat: string) => void
  onBrandChange: (brand: string) => void
  onToggleCollection: (collection: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

const AVAILABLE_COLLECTIONS = [
  'Featured Highlights (Home Grid)',
  'Best Sellers 2025',
  'Audio Architecture Showcase',
  'Clearance Vault',
]

export function TaxonomySidebar({
  category,
  brand,
  collections,
  tags,
  onCategoryChange,
  onBrandChange,
  onToggleCollection,
  onAddTag,
  onRemoveTag,
}: TaxonomySidebarProps) {
  const [tagInput, setTagInput] = useState('')

  const handleAddTagSubmit = () => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim().toLowerCase())
      setTagInput('')
    }
  }

  const handleChangeCategoryPrompt = () => {
    const newCat = window.prompt(
      'Enter category path (e.g., Electronics > Audio > Over-Ear Headphones):',
      category
    )
    if (newCat) onCategoryChange(newCat)
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">
        Taxonomy &amp; Classification
      </h2>

      {/* Product Category */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
          Product Category
        </label>
        <div className="p-space-xs rounded-lg bg-surface-container flex items-center justify-between border border-outline-variant/15">
          <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">
            {category}
          </span>
          <button
            type="button"
            onClick={handleChangeCategoryPrompt}
            className="text-primary hover:text-secondary text-xs font-semibold shrink-0 cursor-pointer ml-2"
          >
            Change
          </button>
        </div>
      </div>

      {/* Brand / Manufacturer */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
          Brand / Manufacturer
        </label>
        <select
          value={brand}
          onChange={(e) => {
            if (e.target.value === '__add_new__') {
              const newBrand = window.prompt('Enter new brand name:')
              if (newBrand) onBrandChange(newBrand)
            } else {
              onBrandChange(e.target.value)
            }
          }}
          className="w-full h-9 px-space-xs rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none border border-outline-variant/20 cursor-pointer"
        >
          <option value="Nexa Audio Labs (Internal)">Nexa Audio Labs (Internal)</option>
          <option value="AeroSound">AeroSound</option>
          <option value="Sony Master Audio">Sony Master Audio</option>
          <option value="Sennheiser Pro">Sennheiser Pro</option>
          <option value="Bose Commercial">Bose Commercial</option>
          <option value="DeskPower">DeskPower</option>
          <option value="Cast & Clay">Cast &amp; Clay</option>
          <option value="__add_new__">+ Add New Brand</option>
        </select>
      </div>

      {/* Collections */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">Collections</label>
        <div className="flex flex-col gap-1.5">
          {AVAILABLE_COLLECTIONS.map((c) => {
            const isChecked = collections.includes(c)
            return (
              <label key={c} className="flex items-center gap-space-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCollection(c)}
                  className="rounded text-primary cursor-pointer"
                />
                <span
                  className={`font-body-sm text-body-sm ${
                    isChecked ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}
                >
                  {c}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Search & Filter Tags */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
          Search &amp; Filter Tags
        </label>
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-body-sm text-[11px] flex items-center gap-1 border border-outline-variant/15"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="material-symbols-outlined text-[12px] cursor-pointer hover:text-error"
              >
                close
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTagSubmit()
              }
            }}
            placeholder="Add tag (press Enter)..."
            className="flex-1 h-8 px-space-xs rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none border border-outline-variant/20"
          />
          <button
            type="button"
            onClick={handleAddTagSubmit}
            className="h-8 px-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all cursor-pointer border border-outline-variant/20"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  )
}

