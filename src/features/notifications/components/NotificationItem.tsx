import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, AtSign, FileEdit, Bell, Mail, Settings2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Notification } from '../types/notification.types'

const ICON_MAP = {
  mention: AtSign,
  comment: MessageSquare,
  comment_reply: MessageSquare,
  page_edit: FileEdit,
  reminder: Bell,
  invitation: Mail,
  property_change: Settings2,
} as const

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
}

export const NotificationItem = memo(function NotificationItem({ notification, onRead, onDelete }: NotificationItemProps) {
  const navigate = useNavigate()
  const Icon = ICON_MAP[notification.type]

  const initials = (notification.actor?.full_name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleClick = () => {
    if (!notification.is_read) onRead(notification.id)
    if (notification.page_id) navigate(`/${notification.page_id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-notion-bg-hover',
        !notification.is_read && 'bg-notion-bg-hover/50',
      )}
    >
      {/* Avatar */}
      {notification.actor?.avatar_url ? (
        <img
          src={notification.actor.avatar_url}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-notion-bg-tertiary font-mono text-[9px] font-semibold text-notion-text-muted">
          {initials}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-start gap-1.5">
          <Icon className="mt-0.5 h-3 w-3 shrink-0 text-notion-text-muted" />
          <span className="font-mono text-xs font-medium text-notion-text-primary">
            {notification.title}
          </span>
        </div>
        {notification.body && (
          <p className="mt-0.5 truncate font-mono text-[10px] text-notion-text-muted">
            {notification.body}
          </p>
        )}
        <span className="mt-1 block font-mono text-[10px] text-notion-text-muted">
          {formatTimeAgo(notification.created_at)}
        </span>
      </div>

      {/* Unread dot + delete */}
      <div className="flex shrink-0 items-center gap-1">
        {!notification.is_read && (
          <div className="h-2 w-2 rounded-full bg-notion-green-primary" />
        )}
        <div
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onDelete(notification.id) } }}
          className="hidden rounded p-0.5 text-notion-text-muted hover:text-red-400 group-hover:block"
        >
          <X className="h-3 w-3" />
        </div>
      </div>
    </button>
  )
})

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
