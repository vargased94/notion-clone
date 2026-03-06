import { useState, memo } from 'react'
import { MoreHorizontal, Check, RotateCcw, Trash2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CommentInput } from './CommentInput'
import type { Comment, CommentContent } from '../types/comment.types'

interface CommentThreadProps {
  comment: Comment
  onReply: (content: CommentContent[], parentId: string) => Promise<void>
  onResolve: (commentId: string) => void
  onReopen: (commentId: string) => void
  onDelete: (commentId: string) => void
}

export const CommentThread = memo(function CommentThread({ comment, onReply, onResolve, onReopen, onDelete }: CommentThreadProps) {
  const [showReply, setShowReply] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const isResolved = comment.status === 'resolved'

  const handleReply = async (content: CommentContent[]) => {
    await onReply(content, comment.id)
    setShowReply(false)
  }

  const contentText = comment.content
    .map((c) => {
      if (c.type === 'text') return c.text ?? ''
      if (c.type === 'mention_user') return `@user`
      if (c.type === 'mention_page') return `@page`
      return ''
    })
    .join('')

  const initials = (comment.author?.full_name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={cn(
      'rounded-lg border border-notion-border p-3',
      isResolved && 'opacity-60',
    )}>
      {/* Main comment */}
      <div className="group flex gap-2.5">
        {/* Avatar */}
        {comment.author?.avatar_url ? (
          <img
            src={comment.author.avatar_url}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-notion-bg-tertiary font-mono text-[9px] font-semibold text-notion-text-muted">
            {initials}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-notion-text-primary">
                {comment.author?.full_name ?? 'Unknown'}
              </span>
              <span className="font-mono text-[10px] text-notion-text-muted">
                {formatTimeAgo(comment.created_at)}
              </span>
              {isResolved && (
                <span className="rounded bg-green-500/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-green-400">
                  Resolved
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="hidden rounded p-0.5 text-notion-text-muted transition-colors hover:bg-notion-bg-hover group-hover:block"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute top-full right-0 z-50 mt-1 w-[160px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-xl">
                    {isResolved ? (
                      <button
                        onClick={() => { onReopen(comment.id); setShowMenu(false) }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Re-open
                      </button>
                    ) : (
                      <button
                        onClick={() => { onResolve(comment.id); setShowMenu(false) }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                      >
                        <Check className="h-3 w-3" />
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => { onDelete(comment.id); setShowMenu(false) }}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-red-400 hover:bg-notion-bg-hover"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <p className="mt-1 font-mono text-xs leading-relaxed text-notion-text-secondary">
            {contentText}
          </p>

          {/* Reply button */}
          {!isResolved && !showReply && (
            <button
              onClick={() => setShowReply(true)}
              className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-notion-text-muted transition-colors hover:text-notion-text-secondary"
            >
              <MessageSquare className="h-3 w-3" />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-3 flex flex-col gap-3 border-l-2 border-notion-border pl-3">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Reply input */}
      {showReply && (
        <div className="ml-8 mt-3">
          <CommentInput
            onSubmit={handleReply}
            placeholder="Write a reply..."
            autoFocus
          />
        </div>
      )}
    </div>
  )
})

function ReplyItem({ reply, onDelete }: { reply: Comment; onDelete: (id: string) => void }) {
  const initials = (reply.author?.full_name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const contentText = reply.content
    .map((c) => (c.type === 'text' ? c.text ?? '' : ''))
    .join('')

  return (
    <div className="group flex gap-2">
      {reply.author?.avatar_url ? (
        <img src={reply.author.avatar_url} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-notion-bg-tertiary font-mono text-[8px] font-semibold text-notion-text-muted">
          {initials}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-medium text-notion-text-primary">
            {reply.author?.full_name ?? 'Unknown'}
          </span>
          <span className="font-mono text-[10px] text-notion-text-muted">
            {formatTimeAgo(reply.created_at)}
          </span>
          <button
            onClick={() => onDelete(reply.id)}
            className="ml-auto hidden rounded p-0.5 text-notion-text-muted hover:text-red-400 group-hover:block"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        <p className="mt-0.5 font-mono text-xs text-notion-text-secondary">{contentText}</p>
      </div>
    </div>
  )
}

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
