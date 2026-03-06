import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/useTheme'

const OPTIONS = [
  { value: 'light' as const, icon: Sun, label: 'Light' },
  { value: 'dark' as const, icon: Moon, label: 'Dark' },
  { value: 'system' as const, icon: Monitor, label: 'System' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-1 rounded-lg bg-notion-bg-primary p-1">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const isActive = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors',
              isActive
                ? 'bg-notion-bg-hover text-notion-text-primary'
                : 'text-notion-text-muted hover:text-notion-text-secondary',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
