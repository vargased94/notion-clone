import { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { supabase } from '@/lib/supabase'

const GRADIENT_COVERS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
]

const SOLID_COVERS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#2d4059', '#ea5455', '#f07b3f',
  '#ffd460', '#005f73', '#0a9396', '#94d2bd',
]

interface PageCoverProps {
  coverUrl: string | null
  coverPosition: number
  pageId: string
  onUpdate: (coverUrl: string | null, coverPosition?: number) => void
}

export function PageCover({ coverUrl, coverPosition, pageId, onUpdate }: PageCoverProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [activeTab, setActiveTab] = useState<'gradients' | 'colors' | 'upload'>('gradients')
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `covers/${pageId}/${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabase.storage.from('page-images').upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from('page-images').getPublicUrl(fileName)
      onUpdate(data.publicUrl)
      setShowPicker(false)
    }
  }

  if (!coverUrl && !showPicker) {
    return (
      <button
        onClick={() => setShowPicker(true)}
        className="group flex h-8 items-center gap-1.5 px-24 font-mono text-xs text-notion-text-muted opacity-0 transition-opacity hover:opacity-100"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Add cover
      </button>
    )
  }

  return (
    <div>
      {/* Cover image */}
      {coverUrl && (
        <div
          className="group/cover relative h-[200px] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {coverUrl.startsWith('linear-gradient') || coverUrl.startsWith('#') ? (
            <div
              className="h-full w-full"
              style={{ background: coverUrl }}
            />
          ) : (
            <img
              src={coverUrl}
              alt="Cover"
              className="h-full w-full object-cover"
              style={{ objectPosition: `center ${coverPosition * 100}%` }}
            />
          )}

          {isHovered && (
            <div className="absolute right-4 bottom-3 flex gap-2">
              <button
                onClick={() => setShowPicker(true)}
                className="rounded-md bg-black/60 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                Change cover
              </button>
              <button
                onClick={() => onUpdate(null)}
                className="rounded-md bg-black/60 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cover picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowPicker(false)}
          />
          <div className="relative z-10 w-[480px] overflow-hidden rounded-xl border border-notion-border bg-notion-bg-secondary shadow-2xl">
            {/* Header */}
            <div className="flex h-11 items-center justify-between px-4">
              <span className="font-mono text-sm font-semibold text-notion-text-primary">Cover</span>
              <button
                onClick={() => setShowPicker(false)}
                className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-notion-border px-4">
              {(['gradients', 'colors', 'upload'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'border-b-2 pb-2 font-mono text-xs capitalize transition-colors',
                    activeTab === tab
                      ? 'border-notion-green-primary text-notion-green-primary'
                      : 'border-transparent text-notion-text-muted hover:text-notion-text-secondary',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'gradients' && (
                <div className="grid grid-cols-3 gap-3">
                  {GRADIENT_COVERS.map((gradient) => (
                    <button
                      key={gradient}
                      onClick={() => { onUpdate(gradient); setShowPicker(false) }}
                      className="h-[72px] rounded-lg transition-transform hover:scale-105"
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="grid grid-cols-4 gap-3">
                  {SOLID_COVERS.map((color) => (
                    <button
                      key={color}
                      onClick={() => { onUpdate(color); setShowPicker(false) }}
                      className="h-[56px] rounded-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-notion-bg-hover px-6 py-3 font-mono text-sm text-notion-text-primary transition-colors hover:bg-notion-bg-tertiary"
                  >
                    Upload image
                  </button>
                  <p className="font-mono text-xs text-notion-text-muted">
                    Recommended: 1500 x 300px
                  </p>
                </div>
              )}
            </div>

            {/* Remove cover */}
            {coverUrl && (
              <button
                onClick={() => { onUpdate(null); setShowPicker(false) }}
                className="flex w-full items-center justify-center gap-1.5 border-t border-notion-border py-2.5 font-mono text-xs text-red-400 transition-colors hover:bg-notion-bg-hover"
              >
                <X className="h-3 w-3" />
                Remove cover
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
