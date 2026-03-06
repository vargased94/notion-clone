import { useEffect, useState, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import HighlightExtension from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import ImageExtension from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { common, createLowlight } from 'lowlight'
import type { EditorView } from '@tiptap/pm/view'

import { FloatingToolbar } from './FloatingToolbar'
import { SlashMenu, type SlashMenuItem } from './SlashMenu'
import { SlashCommandExtension, slashCommandPluginKey, type SlashCommandState } from '../extensions/SlashCommandExtension'
import { CalloutExtension } from '../extensions/CalloutExtension'
import { ToggleExtension } from '../extensions/ToggleExtension'
import { ColumnListExtension, ColumnExtension } from '../extensions/ColumnExtension'
import { EmbedExtension } from '../extensions/EmbedExtension'
import { EquationExtension } from '../extensions/EquationExtension'
import { TableOfContentsExtension } from '../extensions/TableOfContentsExtension'
import { supabase } from '@/lib/supabase'

const lowlight = createLowlight(common)

interface BlockEditorProps {
  pageId: string
  initialContent?: string
  onUpdate?: (html: string) => void
}

export function BlockEditor({ pageId, initialContent, onUpdate }: BlockEditorProps) {
  const [slashState, setSlashState] = useState<SlashCommandState>({
    active: false,
    query: '',
    position: { top: 0, left: 0 },
    range: null,
  })
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // replaced by CodeBlockLowlight
        blockquote: { HTMLAttributes: { class: 'notion-quote' } },
        bulletList: { HTMLAttributes: { class: 'notion-bullet-list' } },
        orderedList: { HTMLAttributes: { class: 'notion-ordered-list' } },
        horizontalRule: { HTMLAttributes: { class: 'notion-divider' } },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          return "Type '/' for commands..."
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'notion-link' },
      }),
      UnderlineExtension,
      HighlightExtension.configure({ multicolor: true }),
      TaskList.configure({
        HTMLAttributes: { class: 'notion-task-list' },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: 'notion-task-item' },
      }),
      TextStyle,
      Color,

      // Phase 4 extensions
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: { class: 'notion-code-block' },
        defaultLanguage: 'javascript',
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'notion-image' },
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'notion-table' },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: { class: 'notion-table-cell' },
      }),
      TableHeader.configure({
        HTMLAttributes: { class: 'notion-table-header' },
      }),
      CalloutExtension,
      ToggleExtension,
      ColumnListExtension,
      ColumnExtension,
      EmbedExtension,
      EquationExtension,
      TableOfContentsExtension,

      SlashCommandExtension,
    ],
    content: initialContent || '<p></p>',
    editorProps: {
      attributes: {
        class: 'notion-editor outline-none',
      },
      handleDrop: (view, event) => {
        // Handle image drops
        const files = event.dataTransfer?.files
        if (files?.length) {
          const file = files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            handleImageDrop(file, view, pageId)
            return true
          }
        }
        return false
      },
      handlePaste: (view, event) => {
        // Handle image pastes
        const items = event.clipboardData?.items
        if (items) {
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              event.preventDefault()
              const file = item.getAsFile()
              if (file) handleImageDrop(file, view, pageId)
              return true
            }
          }
        }
        return false
      },
    },
    onUpdate: ({ editor: ed }) => {
      const state = slashCommandPluginKey.getState(ed.state) as SlashCommandState
      setSlashState(state ?? { active: false, query: '', position: { top: 0, left: 0 }, range: null })

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        const html = ed.getHTML()
        onUpdate?.(html)
        saveContent(pageId, html)
      }, 500)
    },
    onSelectionUpdate: ({ editor: ed }) => {
      const state = slashCommandPluginKey.getState(ed.state) as SlashCommandState
      setSlashState(state ?? { active: false, query: '', position: { top: 0, left: 0 }, range: null })
    },
  })

  // Load content from DB
  useEffect(() => {
    if (!pageId || initialContent !== undefined) return

    const loadContent = async () => {
      const { data: docBlock } = await supabase
        .from('blocks')
        .select('properties')
        .eq('page_id', pageId)
        .is('parent_block_id', null)
        .order('position', { ascending: true })
        .limit(1)
        .single()

      if (docBlock?.properties?.html && editor) {
        editor.commands.setContent(docBlock.properties.html as string)
      }
    }

    loadContent()
  }, [pageId, editor, initialContent])

  const handleSlashSelect = useCallback(
    (item: SlashMenuItem) => {
      if (!editor || !slashState.range) return

      editor.chain().focus().deleteRange(slashState.range).run()

      switch (item.type) {
        case 'paragraph':
          editor.chain().focus().setParagraph().run()
          break
        case 'heading': {
          const level = item.id === 'h1' ? 1 : item.id === 'h2' ? 2 : 3
          editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
          break
        }
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run()
          break
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run()
          break
        case 'taskList':
          editor.chain().focus().toggleTaskList().run()
          break
        case 'blockquote':
          editor.chain().focus().toggleBlockquote().run()
          break
        case 'codeBlock':
          editor.chain().focus().toggleCodeBlock().run()
          break
        case 'horizontalRule':
          editor.chain().focus().setHorizontalRule().run()
          break
        case 'image': {
          const url = window.prompt('Image URL')
          if (url) editor.chain().focus().setImage({ src: url }).run()
          break
        }
        case 'table':
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          break
        case 'callout':
          editor.chain().focus().setCallout({ emoji: '💡' }).run()
          break
        case 'toggle':
          editor.chain().focus().setToggle().run()
          break
        case 'columns':
          editor.chain().focus().setColumns(2).run()
          break
        case 'equation': {
          const latex = window.prompt('LaTeX equation')
          if (latex) editor.chain().focus().setEquation(latex).run()
          break
        }
        case 'embed': {
          const src = window.prompt('Embed URL (YouTube, etc.)')
          if (src) {
            const embedUrl = convertToEmbedUrl(src)
            editor.chain().focus().setEmbed({ src: embedUrl }).run()
          }
          break
        }
        case 'tableOfContents':
          editor.chain().focus().setTableOfContents().run()
          break
        default:
          break
      }

      setSlashState({ active: false, query: '', position: { top: 0, left: 0 }, range: null })
    },
    [editor, slashState.range],
  )

  if (!editor) return null

  return (
    <div className="relative">
      <FloatingToolbar editor={editor} />
      <EditorContent editor={editor} />

      {slashState.active && (
        <SlashMenu
          query={slashState.query}
          onSelect={handleSlashSelect}
          position={slashState.position}
        />
      )}
    </div>
  )
}

function convertToEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  return url
}

async function handleImageDrop(file: File, view: EditorView, pageId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${pageId}/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage.from('page-images').upload(fileName, file)
  if (error) return

  const { data } = supabase.storage.from('page-images').getPublicUrl(fileName)
  const { tr } = view.state
  const pos = view.posAtCoords({ left: 0, top: 0 })?.pos ?? tr.selection.from

  const node = view.state.schema.nodes.image.create({ src: data.publicUrl })
  view.dispatch(tr.insert(pos, node))
}

async function saveContent(pageId: string, html: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('blocks')
    .select('id')
    .eq('page_id', pageId)
    .is('parent_block_id', null)
    .order('position', { ascending: true })
    .limit(1)
    .single()

  if (existing) {
    await supabase
      .from('blocks')
      .update({ properties: { html }, last_edited_by: user.id })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('blocks')
      .insert({
        page_id: pageId,
        type: 'paragraph',
        properties: { html },
        position: 0,
        created_by: user.id,
        last_edited_by: user.id,
      })
  }
}
