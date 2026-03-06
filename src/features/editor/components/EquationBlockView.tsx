import { useState, useEffect, useRef } from 'react'
import katex from 'katex'

interface EquationBlockViewProps {
  latex: string
  onUpdate: (latex: string) => void
}

export function EquationBlockView({ latex, onUpdate }: EquationBlockViewProps) {
  const [isEditing, setIsEditing] = useState(!latex)
  const [value, setValue] = useState(latex)
  const renderRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditing && renderRef.current && value) {
      try {
        katex.render(value, renderRef.current, {
          throwOnError: false,
          displayMode: true,
        })
      } catch {
        if (renderRef.current) {
          renderRef.current.textContent = value
        }
      }
    }
  }, [value, isEditing])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    setIsEditing(false)
    onUpdate(value)
  }

  if (isEditing) {
    return (
      <div className="my-2 rounded-lg border border-notion-border bg-notion-bg-input p-4">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSave()
            }
            if (e.key === 'Escape') handleSave()
          }}
          placeholder="Type a LaTeX equation..."
          rows={2}
          className="w-full resize-none bg-transparent font-mono text-sm text-notion-text-primary placeholder-notion-text-placeholder outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded bg-notion-green-primary px-3 py-1 font-mono text-xs font-medium text-white hover:bg-notion-green-dark"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group/eq my-2 cursor-pointer rounded-lg px-4 py-3 text-center transition-colors hover:bg-notion-bg-hover"
      onClick={() => setIsEditing(true)}
    >
      <div ref={renderRef} className="notion-equation-render" />
    </div>
  )
}
