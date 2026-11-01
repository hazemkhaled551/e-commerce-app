import { useState } from 'react'
import type { ProductMediaItem } from '../../types/productForm'

interface MediaAssetsSectionProps {
  mediaItems: ProductMediaItem[]
  videoUrl: string
  has3dAsset: boolean
  onAddMedia: (item: ProductMediaItem) => void
  onRemoveMedia: (id: string) => void
  onSetPrimary: (id: string) => void
  onVideoUrlChange: (url: string) => void
}

export function MediaAssetsSection({
  mediaItems,
  videoUrl,
  has3dAsset,
  onAddMedia,
  onRemoveMedia,
  onSetPrimary,
  onVideoUrlChange,
}: MediaAssetsSectionProps) {
  const [videoInput, setVideoInput] = useState(videoUrl)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const fakeUrl = URL.createObjectURL(file)
    onAddMedia({
      id: `media-${Date.now()}`,
      url: fakeUrl,
      alt: file.name,
      isPrimary: mediaItems.length === 0,
    })
  }

  const handleAddVideo = () => {
    if (videoInput.trim()) {
      onVideoUrlChange(videoInput.trim())
    }
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">photo_library</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Media &amp; Visual Assets</h2>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {mediaItems.length} of 12 uploaded
        </span>
      </div>

      {/* Upload Dropzone */}
      <label className="p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-dashed border-outline-variant/40">
        <input
          type="file"
          accept="image/*,video/*,.glb"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-space-xs shadow-xs">
          <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
        </div>
        <span className="font-body-md text-body-md font-semibold text-on-surface">
          Drag high-resolution product assets here, or <span className="text-primary underline">browse</span>
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Supports JPG, PNG, WEBP, MP4, and 3D .GLB files up to 50MB
        </span>
      </label>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-sm">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-lg overflow-hidden bg-surface-container aspect-square shadow-sm flex flex-col justify-between border border-outline-variant/20"
          >
            <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />

            {item.isPrimary && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-caps text-[9px] font-bold tracking-wider">
                PRIMARY COVER
              </span>
            )}

            <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {!item.isPrimary && (
                <button
                  type="button"
                  onClick={() => onSetPrimary(item.id)}
                  className="w-7 h-7 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm hover:text-primary cursor-pointer"
                  title="Set as primary"
                >
                  <span className="material-symbols-outlined text-[15px]">star</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemoveMedia(item.id)}
                className="w-7 h-7 rounded-full bg-surface-container-lowest text-error flex items-center justify-center shadow-sm hover:bg-error-container cursor-pointer"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* 3D / AR Asset Tile */}
        {has3dAsset && (
          <div className="relative rounded-lg overflow-hidden bg-surface-container-high aspect-square flex flex-col items-center justify-center p-2 text-center group cursor-pointer border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[28px]">view_in_ar</span>
            <span className="font-label-caps text-label-caps font-bold text-on-surface mt-1">
              aero_pro.glb
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">14.8 MB • 3D</span>
            <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-primary-container text-on-primary font-label-caps text-[8px] font-semibold">
              AR READY
            </div>
          </div>
        )}
      </div>

      {/* Video showcase link */}
      <div className="flex items-center gap-space-xs pt-space-xs">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
          videocam
        </span>
        <input
          type="text"
          value={videoInput}
          onChange={(e) => setVideoInput(e.target.value)}
          placeholder="Add YouTube or Vimeo product video URL (e.g., https://youtube.com/watch?v=...)"
          className="flex-1 h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary-container"
        />
        <button
          type="button"
          onClick={handleAddVideo}
          className="h-9 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all cursor-pointer border border-outline-variant/20"
        >
          Add Video
        </button>
      </div>
    </section>
  )
}

