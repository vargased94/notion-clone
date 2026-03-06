import { Plus } from 'lucide-react'

interface SidebarSectionProps {
  title: string
  onAdd?: () => void
  children: React.ReactNode
}

export function SidebarSection({ title, onAdd, children }: SidebarSectionProps) {
  return (
    <div>
      <div className="flex h-6 items-center justify-between px-2.5">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-notion-text-muted">
          {title}
        </span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="text-notion-text-muted transition-colors hover:text-notion-text-secondary"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
