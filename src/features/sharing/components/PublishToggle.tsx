import { Globe, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { PageShare } from '../types/sharing.types'

interface PublishToggleProps {
  share: PageShare | null
  onEnable: () => void
  onDisable: () => void
  onUpdate: (updates: Partial<Pick<PageShare, 'allow_editing' | 'allow_comments' | 'allow_duplicate' | 'search_indexing'>>) => void
}

export function PublishToggle({ share, onEnable, onDisable, onUpdate }: PublishToggleProps) {
  const [copied, setCopied] = useState(false)
  const isEnabled = share?.is_enabled ?? false

  const publicUrl = share?.slug
    ? `${window.location.origin}/public/${share.slug}`
    : null

  const handleCopy = () => {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-3">
      {/* Toggle row */}
      <button
        onClick={isEnabled ? onDisable : onEnable}
        className="flex w-full items-center justify-between rounded-md py-2 transition-colors hover:bg-notion-bg-hover"
      >
        <div className="flex items-center gap-2.5">
          <Globe className={cn('h-4 w-4', isEnabled ? 'text-notion-green-primary' : 'text-notion-text-muted')} />
          <div className="flex flex-col text-left">
            <span className="font-mono text-xs font-medium text-notion-text-primary">
              Publish to web
            </span>
            <span className="font-mono text-[10px] text-notion-text-muted">
              {isEnabled ? 'Anyone with the link can view' : 'Share a public link'}
            </span>
          </div>
        </div>
        <ToggleSwitch enabled={isEnabled} />
      </button>

      {/* Options when enabled */}
      {isEnabled && (
        <div className="mt-1 flex flex-col gap-1">
          {/* Copy link */}
          {publicUrl && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-md bg-notion-bg-hover px-3 py-2 transition-colors hover:bg-notion-bg-tertiary"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-notion-green-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-notion-text-muted" />
              )}
              <span className="truncate font-mono text-[10px] text-notion-text-muted">
                {copied ? 'Copied!' : publicUrl}
              </span>
            </button>
          )}

          {/* Share options */}
          <div className="mt-1 flex flex-col">
            <ShareOption
              label="Allow editing"
              enabled={share?.allow_editing ?? false}
              onChange={(v) => onUpdate({ allow_editing: v })}
            />
            <ShareOption
              label="Allow comments"
              enabled={share?.allow_comments ?? false}
              onChange={(v) => onUpdate({ allow_comments: v })}
            />
            <ShareOption
              label="Allow duplicate"
              enabled={share?.allow_duplicate ?? false}
              onChange={(v) => onUpdate({ allow_duplicate: v })}
            />
            <ShareOption
              label="Search engine indexing"
              enabled={share?.search_indexing ?? false}
              onChange={(v) => onUpdate({ search_indexing: v })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ShareOption({
  label,
  enabled,
  onChange,
}: {
  label: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between rounded-md px-1 py-1.5 transition-colors hover:bg-notion-bg-hover"
    >
      <span className="font-mono text-[11px] text-notion-text-secondary">{label}</span>
      <ToggleSwitch enabled={enabled} size="sm" />
    </button>
  )
}

function ToggleSwitch({ enabled, size = 'md' }: { enabled: boolean; size?: 'sm' | 'md' }) {
  const trackClass = size === 'sm' ? 'h-4 w-7' : 'h-5 w-9'
  const thumbClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  const translate = size === 'sm' ? 'translate-x-3' : 'translate-x-4'

  return (
    <div
      className={cn(
        'flex items-center rounded-full p-0.5 transition-colors',
        trackClass,
        enabled ? 'bg-notion-green-primary' : 'bg-notion-bg-tertiary',
      )}
    >
      <div
        className={cn(
          'rounded-full bg-white transition-transform',
          thumbClass,
          enabled ? translate : 'translate-x-0',
        )}
      />
    </div>
  )
}
