import { useState } from 'react'
import {
  Image as ImageIcon,
  UploadCloud,
  Star,
  Trash2,
  Box,
  Video,
} from 'lucide-react'
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
    <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/60">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Media &amp; Visual Assets</h2>
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          {mediaItems.length} of 12 uploaded
        </span>
      </div>

      {/* Upload Dropzone */}
      <label className="p-6 rounded-xl bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed border-outline-variant/60 group">
        <input
          type="file"
          accept="image/*,video/*,.glb"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-2 shadow-xs border border-outline-variant/60 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-on-surface">
          Drag high-resolution product assets here, or <span className="text-primary underline">browse</span>
        </span>
        <span className="text-xs text-on-surface-variant mt-1">
          Supports JPG, PNG, WEBP, MP4, and 3D .GLB files up to 50MB
        </span>
      </label>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden bg-surface-container aspect-square shadow-xs flex flex-col justify-between border border-outline-variant/60"
          >
            <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />

            {item.isPrimary && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold tracking-wider shadow-xs">
                PRIMARY COVER
              </span>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!item.isPrimary && (
                <button
                  type="button"
                  onClick={() => onSetPrimary(item.id)}
                  className="w-8 h-8 rounded-full bg-white text-on-surface flex items-center justify-center shadow-sm hover:text-primary cursor-pointer transition-transform hover:scale-110"
                  title="Set as primary"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemoveMedia(item.id)}
                className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm hover:bg-red-50 cursor-pointer transition-transform hover:scale-110"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* 3D / AR Asset Tile */}
        {has3dAsset && (
          <div className="relative rounded-xl overflow-hidden bg-surface-container-high aspect-square flex flex-col items-center justify-center p-3 text-center group cursor-pointer border border-outline-variant/60">
            <Box className="w-7 h-7 text-primary" />
            <span className="text-xs font-bold text-on-surface mt-1.5">
              aero_pro.glb
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">14.8 MB • 3D</span>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold shadow-xs">
              AR READY
            </div>
          </div>
        )}
      </div>

      {/* Video showcase link */}
      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/60">
        <Video className="w-5 h-5 text-on-surface-variant shrink-0" />
        <input
          type="text"
          value={videoInput}
          onChange={(e) => setVideoInput(e.target.value)}
          placeholder="Add YouTube or Vimeo product video URL (e.g., https://youtube.com/watch?v=...)"
          className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs placeholder:text-on-surface-variant border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
        />
        <button
          type="button"
          onClick={handleAddVideo}
          className="h-9 px-3.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold transition-all cursor-pointer border border-outline-variant/60 shadow-xs"
        >
          Add Video
        </button>
      </div>
    </section>
  )
}
