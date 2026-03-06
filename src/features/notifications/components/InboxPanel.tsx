import { useEffect } from 'react'
import { Inbox, X, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function InboxPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reset,
  } = useNotifications()

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    fetchNotifications()
  }, [isOpen, fetchNotifications, reset])

  return (
    <>
      {/* Trigger — styled like a SidebarItem */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-[30px] w-full items-center gap-2.5 rounded px-2.5 font-mono text-[13px] text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
      >
        <Inbox className="h-[18px] w-[18px] shrink-0 text-notion-text-muted" />
        <span className="flex-1 text-left">Inbox</span>
        {unreadCount > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 flex h-full w-[380px] flex-col border-l border-notion-border bg-notion-bg-secondary shadow-xl">
            {/* Header */}
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-notion-text-muted" />
                <span className="font-mono text-sm font-semibold text-notion-text-primary">
                  Inbox
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 font-mono text-[10px] font-medium text-red-400">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16">
                  <Inbox className="h-8 w-8 text-notion-text-muted/40" />
                  <p className="font-mono text-xs text-notion-text-muted">
                    You&apos;re all caught up!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col py-1">
                  {notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
