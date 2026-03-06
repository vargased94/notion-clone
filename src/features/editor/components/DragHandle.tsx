import { GripVertical, Plus } from 'lucide-react'

interface DragHandleProps {
  onAdd: () => void
  onDragStart: () => void
  visible: boolean
}

export function DragHandle({ onAdd, onDragStart, visible }: DragHandleProps) {
  if (!visible) return null

  return (
    <div className="absolute -left-12 top-0.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/block:opacity-100">
      <button
        onClick={onAdd}
        className="flex h-6 w-6 items-center justify-center rounded text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <button
        onMouseDown={onDragStart}
        className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-notion-text-muted transition-colors hover:bg-notion-bg-hover active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
