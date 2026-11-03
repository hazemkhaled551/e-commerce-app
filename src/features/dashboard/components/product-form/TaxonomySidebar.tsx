import { useState } from 'react'
import { FolderTree, X, Tag, Plus } from 'lucide-react'

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
    <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/60">
      <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
        <FolderTree className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Taxonomy &amp; Classification
        </h2>
      </div>

      {/* Product Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Product Category
        </label>
        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/60 shadow-xs">
          <span className="text-xs text-on-surface font-medium truncate">
            {category}
          </span>
          <button
            type="button"
            onClick={handleChangeCategoryPrompt}
            className="text-primary hover:underline text-xs font-semibold shrink-0 cursor-pointer ml-2"
          >
            Change
          </button>
        </div>
      </div>

      {/* Brand / Manufacturer */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
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
          className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
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
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
          Collections
        </label>
        <div className="flex flex-col gap-2">
          {AVAILABLE_COLLECTIONS.map((c) => {
            const isChecked = collections.includes(c)
            return (
              <label key={c} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCollection(c)}
                  className="rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4"
                />
                <span
                  className={`text-xs ${
                    isChecked
                      ? 'text-on-surface font-semibold'
                      : 'text-on-surface-variant group-hover:text-on-surface'
                  } transition-colors`}
                >
                  {c}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Search & Filter Tags */}
      <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <span>Search &amp; Filter Tags</span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-medium flex items-center gap-1 border border-outline-variant/60"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-on-surface-variant cursor-pointer hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-1.5">
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
            className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
          <button
            type="button"
            onClick={handleAddTagSubmit}
            className="h-9 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold transition-all cursor-pointer border border-outline-variant/60 shadow-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </section>
  )
}
