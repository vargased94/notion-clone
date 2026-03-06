import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_ORDER,
} from '../types/sharing.types'
import type { PermissionLevel } from '../types/sharing.types'

interface PermissionSelectProps {
  value: PermissionLevel
  onChange: (level: PermissionLevel) => void
  showRemove?: boolean
  onRemove?: () => void
}

export function PermissionSelect({ value, onChange, showRemove, onRemove }: PermissionSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
      >
        {PERMISSION_LABELS[value]}
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-50 mt-1 w-[220px] rounded-xl border border-notion-border bg-notion-bg-secondary p-1 shadow-xl">
            {PERMISSION_ORDER.map((level) => (
              <button
                key={level}
                onClick={() => { onChange(level); setIsOpen(false) }}
                className={cn(
                  'flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-notion-bg-hover',
                  value === level && 'bg-notion-bg-hover',
                )}
              >
                <span className="font-mono text-xs font-medium text-notion-text-primary">
                  {PERMISSION_LABELS[level]}
                </span>
                <span className="font-mono text-[10px] text-notion-text-muted">
                  {PERMISSION_DESCRIPTIONS[level]}
                </span>
              </button>
            ))}

            {showRemove && onRemove && (
              <>
                <div className="my-1 h-px bg-notion-divider" />
                <button
                  onClick={() => { onRemove(); setIsOpen(false) }}
                  className="flex w-full items-center rounded-lg px-3 py-2 font-mono text-xs text-red-400 transition-colors hover:bg-notion-bg-hover"
                >
                  Remove access
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
