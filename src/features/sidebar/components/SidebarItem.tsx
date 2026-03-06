import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  isActive?: boolean
  iconClassName?: string
  labelClassName?: string
}

export function SidebarItem({ icon: Icon, label, onClick, isActive, iconClassName, labelClassName }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-[30px] w-full items-center gap-2 rounded px-2.5 font-mono text-[13px] text-notion-text-secondary transition-colors hover:bg-notion-bg-hover',
        isActive && 'bg-notion-bg-hover font-medium text-notion-text-primary',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', iconClassName)} />
      <span className={cn('truncate', labelClassName)}>{label}</span>
    </button>
  )
}
