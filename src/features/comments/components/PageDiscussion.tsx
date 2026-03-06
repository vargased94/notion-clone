import { useEffect, useCallback } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useComments } from '../hooks/useComments'
import { CommentInput } from './CommentInput'
import { CommentThread } from './CommentThread'
import type { CommentContent } from '../types/comment.types'

interface PageDiscussionProps {
  pageId: string
}

export function PageDiscussion({ pageId }: PageDiscussionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    threads,
    isLoading,
    fetchComments,
    addComment,
    resolveComment,
    reopenComment,
    deleteComment,
    reset,
  } = useComments()

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    fetchComments(pageId)
  }, [isOpen, pageId, fetchComments, reset])

  const handleNewComment = useCallback(
    async (content: CommentContent[]) => {
      await addComment(pageId, content)
    },
    [pageId, addComment],
  )

  const handleReply = useCallback(
    async (content: CommentContent[], parentId: string) => {
      await addComment(pageId, content, { parentCommentId: parentId })
    },
    [pageId, addComment],
  )

  const openThreads = threads.filter((t) => t.status === 'open')
  const resolvedThreads = threads.filter((t) => t.status === 'resolved')

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        title="Comments"
      >
        <MessageCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 flex h-full w-[360px] flex-col border-l border-notion-border bg-notion-bg-secondary shadow-xl">
            {/* Header */}
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-notion-text-muted" />
                <span className="font-mono text-sm font-semibold text-notion-text-primary">
                  Comments
                </span>
                {openThreads.length > 0 && (
                  <span className="rounded-full bg-notion-green-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-medium text-notion-green-primary">
                    {openThreads.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* New comment */}
            <div className="border-b border-notion-border px-4 pb-3">
              <CommentInput onSubmit={handleNewComment} autoFocus />
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
                </div>
              ) : threads.length === 0 ? (
                <p className="py-8 text-center font-mono text-xs text-notion-text-muted">
                  No comments yet. Start a discussion!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Open threads */}
                  {openThreads.map((thread) => (
                    <CommentThread
                      key={thread.id}
                      comment={thread}
                      onReply={handleReply}
                      onResolve={resolveComment}
                      onReopen={reopenComment}
                      onDelete={deleteComment}
                    />
                  ))}

                  {/* Resolved threads */}
                  {resolvedThreads.length > 0 && (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-px flex-1 bg-notion-divider" />
                        <span className="font-mono text-[10px] text-notion-text-muted">
                          {resolvedThreads.length} resolved
                        </span>
                        <div className="h-px flex-1 bg-notion-divider" />
                      </div>
                      {resolvedThreads.map((thread) => (
                        <CommentThread
                          key={thread.id}
                          comment={thread}
                          onReply={handleReply}
                          onResolve={resolveComment}
                          onReopen={reopenComment}
                          onDelete={deleteComment}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
