import { useState, useRef, useCallback } from 'react'
import {
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  Maximize2,
  Download,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { supabase } from '@/lib/supabase'

interface ImageBlockViewProps {
  src: string | null
  pageId: string
  onUpdate: (src: string) => void
  onRemove: () => void
}

export function ImageBlockView({ src, pageId, onUpdate, onRemove }: ImageBlockViewProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'full'>('center')
  const [width, setWidth] = useState<number>(100)
  const [isHovered, setIsHovered] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${pageId}/${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabase.storage
      .from('page-images')
      .upload(fileName, file)

    if (!error) {
      const { data } = supabase.storage.from('page-images').getPublicUrl(fileName)
      onUpdate(data.publicUrl)
    }
    setIsUploading(false)
  }

  const handleEmbedUrl = () => {
    const url = window.prompt('Paste image URL')
    if (url) onUpdate(url)
  }

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!imgRef.current) return
      setIsResizing(true)

      const startX = e.clientX
      const startWidth = imgRef.current.offsetWidth
      const container = imgRef.current.parentElement?.parentElement
      const containerWidth = container?.offsetWidth || 700

      const onMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX
        const newPx = Math.max(100, startWidth + delta)
        const pct = Math.min(100, Math.round((newPx / containerWidth) * 100))
        setWidth(pct)
      }

      const onMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [],
  )

  if (!src) {
    return (
      <div className="my-2 flex flex-col items-center gap-3 rounded-lg border border-dashed border-notion-border bg-notion-bg-input p-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex items-center gap-2 font-mono text-sm text-notion-text-muted">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
            Uploading...
          </div>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md bg-notion-bg-hover px-4 py-2 font-mono text-sm text-notion-text-primary transition-colors hover:bg-notion-bg-tertiary"
            >
              Upload image
            </button>
            <button
              onClick={handleEmbedUrl}
              className="font-mono text-xs text-notion-text-muted hover:text-notion-text-secondary"
            >
              or embed from URL
            </button>
          </>
        )}
      </div>
    )
  }

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    full: 'justify-center',
  }[alignment]

  return (
    <div
      className={cn('group/img relative my-2 flex', alignClass)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative"
        style={{ width: alignment === 'full' ? '100%' : `${width}%` }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          className="w-full rounded-sm"
          draggable={false}
        />

        {/* Resize handle */}
        <div
          onMouseDown={handleResize}
          className={cn(
            'absolute top-0 right-0 h-full w-2 cursor-col-resize',
            isResizing ? 'bg-notion-green-primary/30' : 'hover:bg-notion-green-primary/20',
          )}
        />

        {/* Toolbar */}
        {isHovered && !isResizing && (
          <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
            <button
              onClick={() => setAlignment('left')}
              className={cn('rounded p-1.5', alignment === 'left' ? 'bg-notion-bg-active' : 'hover:bg-notion-bg-hover')}
            >
              <AlignStartHorizontal className="h-3.5 w-3.5 text-notion-text-secondary" />
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={cn('rounded p-1.5', alignment === 'center' ? 'bg-notion-bg-active' : 'hover:bg-notion-bg-hover')}
            >
              <AlignCenterHorizontal className="h-3.5 w-3.5 text-notion-text-secondary" />
            </button>
            <button
              onClick={() => setAlignment('right')}
              className={cn('rounded p-1.5', alignment === 'right' ? 'bg-notion-bg-active' : 'hover:bg-notion-bg-hover')}
            >
              <AlignEndHorizontal className="h-3.5 w-3.5 text-notion-text-secondary" />
            </button>
            <button
              onClick={() => setAlignment('full')}
              className={cn('rounded p-1.5', alignment === 'full' ? 'bg-notion-bg-active' : 'hover:bg-notion-bg-hover')}
            >
              <Maximize2 className="h-3.5 w-3.5 text-notion-text-secondary" />
            </button>
            <div className="h-4 w-px bg-notion-border" />
            <a
              href={src}
              download
              className="rounded p-1.5 hover:bg-notion-bg-hover"
            >
              <Download className="h-3.5 w-3.5 text-notion-text-secondary" />
            </a>
            <button
              onClick={onRemove}
              className="rounded p-1.5 hover:bg-notion-bg-hover"
            >
              <Trash2 className="h-3.5 w-3.5 text-notion-text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
