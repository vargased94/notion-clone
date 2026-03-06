import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'
import type { CommentContent } from '../types/comment.types'

interface CommentInputProps {
  onSubmit: (content: CommentContent[]) => Promise<void>
  placeholder?: string
  autoFocus?: boolean
}

export function CommentInput({ onSubmit, placeholder = 'Add a comment...', autoFocus }: CommentInputProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)

    const content: CommentContent[] = [{ type: 'text', text: trimmed }]
    await onSubmit(content)

    setText('')
    setIsSubmitting(false)
    inputRef.current?.focus()
  }, [text, isSubmitting, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={1}
        className="flex-1 resize-none rounded-md border border-notion-border bg-notion-bg-primary px-3 py-2 font-mono text-xs text-notion-text-primary placeholder-notion-text-muted outline-none transition-colors focus:border-notion-green-primary"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className="shrink-0 rounded-md p-2 text-notion-text-muted transition-colors hover:bg-notion-bg-hover hover:text-notion-green-primary disabled:opacity-40"
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
