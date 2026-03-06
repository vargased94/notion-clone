import { useCallback } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Palette,
  Highlighter,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface ToolbarButtonProps {
  icon: React.ElementType
  isActive?: boolean
  onClick: () => void
  label: string
}

function ToolbarButton({ icon: Icon, isActive, onClick, label }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-notion-bg-hover',
        isActive ? 'bg-notion-bg-active text-notion-text-primary' : 'text-notion-text-secondary',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function ToolbarDivider() {
  return <div className="h-5 w-px bg-notion-border" />
}

interface FloatingToolbarProps {
  editor: Editor
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg"
    >
      <ToolbarButton
        icon={Bold}
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Underline}
        label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarDivider />
      <ToolbarButton
        icon={Code}
        label="Code"
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <ToolbarButton
        icon={Link}
        label="Link"
        isActive={editor.isActive('link')}
        onClick={setLink}
      />
      <ToolbarDivider />
      <ToolbarButton
        icon={Palette}
        label="Color"
        isActive={false}
        onClick={() => {
          // Color picker - Phase 6
        }}
      />
      <ToolbarDivider />
      <ToolbarButton
        icon={Highlighter}
        label="Highlight"
        isActive={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />
      <ToolbarDivider />
      <ToolbarButton
        icon={MessageSquare}
        label="Comment"
        isActive={false}
        onClick={() => {
          // Comments - Phase 8
        }}
      />
    </BubbleMenu>
  )
}
