import { useState, useEffect } from 'react'
import {
  Info,
  Link as LinkIcon,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { checkProductSlugAvailability } from '../../api/adminProductApi'

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

  // Live remote check for slug
  const [remoteSlugCheck, setRemoteSlugCheck] = useState<{
    slug: string
    status: 'idle' | 'checking' | 'available' | 'taken'
    message: string | null
  }>({
    slug: '',
    status: 'idle',
    message: null,
  })

  const trimmedSlug = slug.trim().toLowerCase()

  useEffect(() => {
    if (!trimmedSlug || trimmedSlug.length < 2) return

    let ignore = false
    const timer = setTimeout(() => {
      checkProductSlugAvailability(trimmedSlug)
        .then((result) => {
          if (!ignore) {
            setRemoteSlugCheck({
              slug: trimmedSlug,
              status: result.available ? 'available' : 'taken',
              message: result.available ? null : result.message || 'Slug already in use',
            })
          }
        })
        .catch(() => {
          if (!ignore) {
            setRemoteSlugCheck({
              slug: trimmedSlug,
              status: 'taken',
              message: 'Check failed',
            })
          }
        })
    }, 400)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [trimmedSlug])

  const slugStatus = !trimmedSlug
    ? 'idle'
    : remoteSlugCheck.slug === trimmedSlug
      ? remoteSlugCheck.status
      : 'checking'

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onTitleChange(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      onSlugChange(generatedSlug)
    }
  }

  const applyFormat = (command: string) => {
    if (activeTab === 'html') return
    document.execCommand(command, false)
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">General Information</h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Required *
        </span>
      </div>

      {/* Product Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="prod-title">
            Product Title <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-on-surface-variant font-mono">
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
          className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
        />
      </div>

      {/* Permalink Live Box */}
      <div className="p-2.5 px-3 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/60 shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <LinkIcon className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider shrink-0">
            Permalink:
          </span>
          {isEditingSlug ? (
            <input
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="h-7 px-2 font-mono text-xs bg-white rounded border border-outline-variant/60 flex-1 max-w-sm text-primary focus:outline-none focus:border-primary"
            />
          ) : (
            <span className="text-xs text-on-surface-variant font-mono truncate">
              https://nexa-store.com/products/
              <span className="font-semibold text-primary underline">{slug || 'your-product-slug'}</span>
            </span>
          )}

          {/* Availability pill */}
          {slugStatus === 'checking' && (
            <span className="shrink-0 flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
              <span>Checking</span>
            </span>
          )}
          {slugStatus === 'available' && (
            <span className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Available</span>
            </span>
          )}
          {slugStatus === 'taken' && (
            <span className="shrink-0 flex items-center gap-1 text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span>Taken</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsEditingSlug(!isEditingSlug)}
          className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer"
        >
          {isEditingSlug ? 'Done' : 'Edit Slug'}
        </button>
      </div>

      {/* Short Subtitle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="prod-summary">
          Short Subtitle / Value Proposition
        </label>
        <input
          id="prod-summary"
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="e.g. Flagship over-ear hybrid active noise cancelling headphones with 60h battery life"
          className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
        />
      </div>

      {/* Description Rich Editor */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Description &amp; Story
          </label>
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-white text-primary shadow-xs border border-outline-variant/40'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'html'
                  ? 'bg-white text-primary shadow-xs border border-outline-variant/40'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              HTML Code
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="rounded-t-lg bg-surface-container-low p-2 flex flex-wrap items-center gap-1 border border-outline-variant/60 border-b-0">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('strikeThrough')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-outline-variant/60 mx-1" />
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer font-bold text-xs"
            title="H2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer font-semibold text-xs"
            title="H3"
          >
            H3
          </button>
          <div className="h-4 w-px bg-outline-variant/60 mx-1" />
          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('code')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-outline-variant/60 mx-1" />
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-on-surface cursor-pointer transition-colors"
            title="Insert Media"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editor Body */}
        {activeTab === 'html' ? (
          <textarea
            value={descriptionHtml}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={7}
            className="w-full p-4 rounded-b-lg bg-surface-container-lowest font-mono text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        ) : (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onDescriptionChange(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            className="p-4 rounded-b-lg bg-surface-container-lowest min-h-[160px] text-sm text-on-surface flex flex-col gap-2 border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        )}
      </div>
    </section>
  )
}
