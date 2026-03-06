import { useState } from 'react'
import { Settings, Lock, Unlock, Maximize2, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Page } from '../hooks/usePages'

type PageFont = Page['font']

interface PageSettingsProps {
  page: Page
  onUpdate: (updates: Partial<Pick<Page, 'is_locked' | 'font' | 'full_width' | 'small_text'>>) => void
}

export function PageSettings({ page, onUpdate }: PageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const font: PageFont = page.font ?? 'default'
  const fullWidth = page.full_width ?? false
  const smallText = page.small_text ?? false

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        title="Page settings"
      >
        <Settings className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-50 mt-2 w-[260px] rounded-xl border border-notion-border bg-notion-bg-secondary p-2 shadow-xl">
            <div className="px-2 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-notion-text-muted">
              PAGE SETTINGS
            </div>

            {/* Font */}
            <div className="px-2 py-2">
              <span className="font-mono text-xs text-notion-text-secondary">Font</span>
              <div className="mt-1.5 flex gap-1">
                {([
                  { value: 'default' as PageFont, label: 'Ag', fontClass: 'font-sans' },
                  { value: 'serif' as PageFont, label: 'Ag', fontClass: 'font-serif' },
                  { value: 'mono' as PageFont, label: 'Ag', fontClass: 'font-mono' },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ font: opt.value })}
                    className={cn(
                      'flex h-9 flex-1 items-center justify-center rounded-md border text-sm transition-colors',
                      font === opt.value
                        ? 'border-notion-green-primary bg-notion-green-primary/10 text-notion-green-primary'
                        : 'border-notion-border text-notion-text-secondary hover:bg-notion-bg-hover',
                      opt.fontClass,
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-1 h-px bg-notion-divider" />

            {/* Full width */}
            <button
              onClick={() => onUpdate({ full_width: !fullWidth })}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-notion-bg-hover"
            >
              <div className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-notion-text-muted" />
                <span className="font-mono text-xs text-notion-text-secondary">Full width</span>
              </div>
              <ToggleSwitch enabled={fullWidth} />
            </button>

            {/* Small text */}
            <button
              onClick={() => onUpdate({ small_text: !smallText })}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-notion-bg-hover"
            >
              <div className="flex items-center gap-2">
                <MinusCircle className="h-4 w-4 text-notion-text-muted" />
                <span className="font-mono text-xs text-notion-text-secondary">Small text</span>
              </div>
              <ToggleSwitch enabled={smallText} />
            </button>

            <div className="my-1 h-px bg-notion-divider" />

            {/* Lock */}
            <button
              onClick={() => onUpdate({ is_locked: !page.is_locked })}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-notion-bg-hover"
            >
              <div className="flex items-center gap-2">
                {page.is_locked ? (
                  <Lock className="h-4 w-4 text-red-400" />
                ) : (
                  <Unlock className="h-4 w-4 text-notion-text-muted" />
                )}
                <span className="font-mono text-xs text-notion-text-secondary">
                  {page.is_locked ? 'Locked' : 'Lock page'}
                </span>
              </div>
              <ToggleSwitch enabled={page.is_locked} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={cn(
        'flex h-5 w-9 items-center rounded-full p-0.5 transition-colors',
        enabled ? 'bg-notion-green-primary' : 'bg-notion-bg-tertiary',
      )}
    >
      <div
        className={cn(
          'h-4 w-4 rounded-full bg-white transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </div>
  )
}
