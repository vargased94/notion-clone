import { useState, useEffect, useRef } from 'react'
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  SquareCheck,
  ChevronRight,
  Quote,
  Megaphone,
  Minus,
  Image,
  Code,
  Table2,
  Columns2,
  Video,
  Sigma,
  TableOfContents,
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface SlashMenuItem {
  id: string
  label: string
  description: string
  icon: React.ElementType
  type: string
  section: string
}

const SLASH_ITEMS: SlashMenuItem[] = [
  { id: 'text', label: 'Text', description: 'Plain text block', icon: Type, type: 'paragraph', section: 'BASIC BLOCKS' },
  { id: 'h1', label: 'Heading 1', description: 'Large section header', icon: Heading1, type: 'heading', section: 'BASIC BLOCKS' },
  { id: 'h2', label: 'Heading 2', description: 'Medium section header', icon: Heading2, type: 'heading', section: 'BASIC BLOCKS' },
  { id: 'h3', label: 'Heading 3', description: 'Small section header', icon: Heading3, type: 'heading', section: 'BASIC BLOCKS' },
  { id: 'bullet', label: 'Bulleted list', description: 'Simple bulleted list', icon: List, type: 'bulletList', section: 'BASIC BLOCKS' },
  { id: 'number', label: 'Numbered list', description: 'List with numbers', icon: ListOrdered, type: 'orderedList', section: 'BASIC BLOCKS' },
  { id: 'todo', label: 'To-do list', description: 'Track tasks with checkboxes', icon: SquareCheck, type: 'taskList', section: 'BASIC BLOCKS' },
  { id: 'toggle', label: 'Toggle', description: 'Collapsible content', icon: ChevronRight, type: 'toggle', section: 'BASIC BLOCKS' },
  { id: 'quote', label: 'Quote', description: 'Capture a quote', icon: Quote, type: 'blockquote', section: 'BASIC BLOCKS' },
  { id: 'callout', label: 'Callout', description: 'Highlight important info', icon: Megaphone, type: 'callout', section: 'BASIC BLOCKS' },
  { id: 'divider', label: 'Divider', description: 'Visual separator', icon: Minus, type: 'horizontalRule', section: 'BASIC BLOCKS' },
  { id: 'image', label: 'Image', description: 'Upload or embed image', icon: Image, type: 'image', section: 'MEDIA' },
  { id: 'code', label: 'Code', description: 'Code block with syntax', icon: Code, type: 'codeBlock', section: 'MEDIA' },
  { id: 'table', label: 'Table', description: 'Add a simple table', icon: Table2, type: 'table', section: 'MEDIA' },
  { id: 'embed', label: 'Embed', description: 'YouTube, iframe, etc.', icon: Video, type: 'embed', section: 'MEDIA' },
  { id: 'columns', label: 'Columns', description: 'Two-column layout', icon: Columns2, type: 'columns', section: 'ADVANCED' },
  { id: 'equation', label: 'Equation', description: 'LaTeX math expression', icon: Sigma, type: 'equation', section: 'ADVANCED' },
  { id: 'toc', label: 'Table of Contents', description: 'Auto-generated outline', icon: TableOfContents, type: 'tableOfContents', section: 'ADVANCED' },
]

interface SlashMenuProps {
  query: string
  onSelect: (item: SlashMenuItem) => void
  position: { top: number; left: number }
}

export function SlashMenu({ query, onSelect, position }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = SLASH_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  )

  // Group by section
  const sections = filtered.reduce<Record<string, SlashMenuItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filtered, selectedIndex, onSelect])

  // Scroll selected into view
  useEffect(() => {
    const el = menuRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (filtered.length === 0) return null

  let flatIndex = 0

  return (
    <div
      ref={menuRef}
      className="fixed z-50 max-h-[320px] w-[320px] overflow-y-auto rounded-lg border border-notion-border bg-notion-bg-secondary shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      {Object.entries(sections).map(([section, items]) => (
        <div key={section} className="py-1.5">
          <div className="px-3 pb-1 font-mono text-[10px] font-semibold tracking-wider text-notion-text-muted">
            {section}
          </div>
          {items.map((item) => {
            const idx = flatIndex++
            const Icon = item.icon
            return (
              <button
                key={item.id}
                data-index={idx}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 px-3 font-mono',
                  idx === selectedIndex ? 'bg-notion-bg-hover' : '',
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0',
                    idx === selectedIndex ? 'text-notion-green-primary' : 'text-notion-text-secondary',
                  )}
                />
                <div className="flex flex-col items-start gap-px">
                  <span className="text-xs text-notion-text-primary">{item.label}</span>
                  <span className="text-[10px] text-notion-text-muted">{item.description}</span>
                </div>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export type { SlashMenuItem }
