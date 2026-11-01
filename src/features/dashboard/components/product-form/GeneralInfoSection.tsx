import { useState } from 'react'

interface GeneralInfoSectionProps {
  title: string
  slug: string
  subtitle: string
  descriptionHtml: string
  onTitleChange: (val: string) => void
  onSlugChange: (val: string) => void
  onSubtitleChange: (val: string) => void
  onDescriptionChange: (val: string) => void
}

export function GeneralInfoSection({
  title,
  slug,
  subtitle,
  descriptionHtml,
  onTitleChange,
  onSlugChange,
  onSubtitleChange,
  onDescriptionChange,
}: GeneralInfoSectionProps) {
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual')

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onTitleChange(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      onSlugChange(generatedSlug)
    }
  }

  const applyFormat = (command: string) => {
    // For demo visual editor helper
    if (activeTab === 'html') return
    document.execCommand(command, false)
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">info</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">General Information</h2>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
          Required *
        </span>
      </div>

      {/* Product Title */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="prod-title">
            Product Title *
          </label>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {title.length} / 100
          </span>
        </div>
        <input
          id="prod-title"
          type="text"
          maxLength={100}
          value={title}
          onChange={handleTitleInput}
          placeholder="e.g. AeroSound Studio Wireless Headphones Pro"
          className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
        />
      </div>

      {/* Permalink Live Box */}
      <div className="p-space-xs px-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border border-outline-variant/20">
        <div className="flex items-center gap-1.5 overflow-hidden flex-1">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0">
            link
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">
            Permalink:
          </span>
          {isEditingSlug ? (
            <input
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              className="h-7 px-2 font-mono text-body-sm bg-surface-container-lowest rounded border border-outline-variant/40 flex-1 max-w-sm text-primary"
            />
          ) : (
            <span className="font-body-sm text-body-sm text-secondary font-mono truncate">
              https://nexa-store.com/products/
              <span className="font-semibold text-primary underline">{slug || 'your-product-slug'}</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsEditingSlug(!isEditingSlug)}
          className="font-label-caps text-label-caps text-primary hover:text-secondary font-semibold shrink-0 cursor-pointer"
        >
          {isEditingSlug ? 'Done' : 'Edit Slug'}
        </button>
      </div>

      {/* Short Subtitle */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="prod-summary">
          Short Subtitle / Value Proposition
        </label>
        <input
          id="prod-summary"
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="e.g. Flagship over-ear hybrid active noise cancelling headphones with 60h battery life"
          className="w-full h-10 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
        />
      </div>

      {/* Description Rich Editor */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <label className="font-body-sm text-body-sm font-semibold text-on-surface">
            Description &amp; Story
          </label>
          <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-space-xs py-0.5 rounded font-label-caps text-label-caps transition-all ${
                activeTab === 'visual'
                  ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`px-space-xs py-0.5 rounded font-label-caps text-label-caps transition-all ${
                activeTab === 'html'
                  ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              HTML Code
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="rounded-t-lg bg-surface-container-low p-1.5 flex flex-wrap items-center gap-1 border border-outline-variant/30 border-b-0">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Bold"
          >
            <span className="material-symbols-outlined text-[16px]">format_bold</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Italic"
          >
            <span className="material-symbols-outlined text-[16px]">format_italic</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('strikeThrough')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Strikethrough"
          >
            <span className="material-symbols-outlined text-[16px]">strikethrough_s</span>
          </button>
          <div className="h-4 w-px bg-outline-variant mx-1" />
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer font-bold text-xs"
            title="H2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer font-semibold text-xs"
            title="H3"
          >
            H3
          </button>
          <div className="h-4 w-px bg-outline-variant mx-1" />
          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Numbered List"
          >
            <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Blockquote"
          >
            <span className="material-symbols-outlined text-[16px]">format_quote</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('code')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Code"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
          </button>
          <div className="h-4 w-px bg-outline-variant mx-1" />
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Insert Link"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container text-on-surface cursor-pointer"
            title="Insert Media"
          >
            <span className="material-symbols-outlined text-[16px]">image</span>
          </button>
        </div>

        {/* Editor Body */}
        {activeTab === 'html' ? (
          <textarea
            value={descriptionHtml}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={7}
            className="w-full p-space-md rounded-b-lg bg-surface-container-lowest font-mono text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        ) : (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onDescriptionChange(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            className="p-space-md rounded-b-lg bg-surface-container-lowest min-h-[160px] font-body-md text-body-md text-on-surface flex flex-col gap-space-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        )}
      </div>
    </section>
  )
}

