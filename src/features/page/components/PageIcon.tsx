import { useState, useRef, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiData {
  native: string
}

interface PageIconProps {
  icon: string | null
  iconType: 'emoji' | 'url' | 'none'
  onUpdate: (icon: string | null, iconType: 'emoji' | 'url' | 'none') => void
  size?: 'sm' | 'md' | 'lg'
}

export function PageIcon({ icon, iconType, onUpdate, size = 'lg' }: PageIconProps) {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const sizeClass = {
    sm: 'text-xl h-7 w-7',
    md: 'text-3xl h-10 w-10',
    lg: 'text-5xl h-16 w-16',
  }[size]

  // Close picker on click outside
  useEffect(() => {
    if (!showPicker) return

    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPicker])

  const handleSelect = (emoji: EmojiData) => {
    onUpdate(emoji.native, 'emoji')
    setShowPicker(false)
  }

  if (!icon || iconType === 'none') {
    return (
      <button
        onClick={() => setShowPicker(true)}
        className="group flex items-center gap-1.5 font-mono text-xs text-notion-text-muted opacity-0 transition-opacity hover:opacity-100"
      >
        Add icon
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`flex items-center justify-center rounded-lg transition-transform hover:scale-110 ${sizeClass}`}
      >
        {iconType === 'emoji' && <span>{icon}</span>}
        {iconType === 'url' && (
          <img src={icon} alt="icon" className="h-full w-full rounded-lg object-cover" />
        )}
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute top-full left-0 z-50 mt-2">
          <Picker
            data={data}
            onEmojiSelect={handleSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
          {icon && (
            <button
              onClick={() => { onUpdate(null, 'none'); setShowPicker(false) }}
              className="mt-1 w-full rounded-lg bg-notion-bg-secondary px-4 py-2 font-mono text-xs text-red-400 hover:bg-notion-bg-hover"
            >
              Remove icon
            </button>
          )}
        </div>
      )}
    </div>
  )
}
