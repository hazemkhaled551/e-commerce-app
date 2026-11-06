import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderTree, X, Tag, Plus, Loader2, ExternalLink } from 'lucide-react'
import type { CategoryItem } from '../../types/category'
import { getAdminCategories } from '../../api/adminCategoryApi'
import { loadBrandsFromStorage } from '../../data/mockBrandData'
import { loadCollectionsFromStorage } from '../../data/mockCollectionData'

interface TaxonomySidebarProps {
  category: string
  categoryId?: string
  categories?: CategoryItem[]
  brand: string
  collections: string[]
  tags: string[]
  onCategoryChange: (categoryId: string, categoryName: string) => void
  onBrandChange: (brand: string) => void
  onToggleCollection: (collection: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function TaxonomySidebar({
  category,
  categoryId,
  categories: initialCategories,
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
  const [fetchedCategories, setFetchedCategories] = useState<CategoryItem[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [availableBrands] = useState<string[]>(() =>
    loadBrandsFromStorage().map((b) => b.name)
  )
  const [availableCollections] = useState<string[]>(() =>
    loadCollectionsFromStorage().map((c) => c.title)
  )

  const loadedCategories =
    initialCategories && initialCategories.length > 0 ? initialCategories : fetchedCategories

  const isLoadingCats = (!initialCategories || initialCategories.length === 0) && !hasFetched

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return

    let ignore = false
    getAdminCategories({ view: 'flat', limit: 100 })
      .then((res) => {
        if (!ignore) {
          setFetchedCategories(res.categories)
          setHasFetched(true)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('Could not load categories in TaxonomySidebar:', err)
          setHasFetched(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [initialCategories])

  const handleAddTagSubmit = () => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim().toLowerCase())
      setTagInput('')
    }
  }

  // Find effective selected category ID
  const selectedCatId =
    categoryId ||
    loadedCategories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase() || c.id === category
    )?.id ||
    ''

  const handleSelectCategory = (id: string) => {
    const selected = loadedCategories.find((c) => c.id === id)
    if (selected) {
      onCategoryChange(selected.id, selected.name)
    } else {
      onCategoryChange(id, id)
    }
  }

  return (
    <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/60">
      <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
        <FolderTree className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-on-surface">
          Taxonomy &amp; Classification
        </h2>
      </div>

      {/* Product Category - Select Dropdown */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Product Category <span className="text-red-500">*</span>
          </label>
          {isLoadingCats && (
            <span className="flex items-center gap-1 text-[10px] text-primary">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading...</span>
            </span>
          )}
        </div>

        <div className="relative">
          <select
            value={selectedCatId}
            onChange={(e) => handleSelectCategory(e.target.value)}
            disabled={isLoadingCats}
            className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs font-medium disabled:opacity-50"
          >
            <option value="" disabled>
              {isLoadingCats ? 'Loading categories...' : 'Select Category...'}
            </option>
            {loadedCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.level === 'subcategory'
                  ? `↳ ${c.name} (${c.parentName || 'Subcategory'})`
                  : c.name}
              </option>
            ))}
          </select>
          <FolderTree className="w-4 h-4 text-primary/50 absolute right-2.5 top-3 pointer-events-none" />
        </div>
        <span className="text-[11px] text-on-surface-variant">
          Assigns product to store navigation and category filters.
        </span>
      </div>

      {/* Brand / Manufacturer */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Brand / Manufacturer
          </label>
          <Link
            to="/admin/brands"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium"
            title="Open Brands management page in new tab"
          >
            <span>Manage Brands</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
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
          {availableBrands.map((bName) => (
            <option key={bName} value={bName}>
              {bName}
            </option>
          ))}
          {!availableBrands.includes(brand) && brand && (
            <option value={brand}>{brand}</option>
          )}
          <option value="__add_new__">+ Add New Brand</option>
        </select>
      </div>

      {/* Collections */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Collections
          </label>
          <Link
            to="/admin/collections"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium"
            title="Open Collections management page in new tab"
          >
            <span>Manage Collections</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {availableCollections.map((c) => {
            const isChecked = collections.includes(c)
            return (
              <label key={c} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCollection(c)}
                  className="rounded text-primary border-outline-variant/80 focus:ring-primary/30 cursor-pointer w-4 h-4 accent-primary"
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
