import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnList: {
      setColumns: (count?: number) => ReturnType
    }
  }
}

export const ColumnListExtension = Node.create({
  name: 'columnList',
  group: 'block',
  content: 'column+',

  parseHTML() {
    return [{ tag: 'div[data-column-list]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-column-list': '',
        class: 'notion-column-list',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setColumns:
        (count: number = 2) =>
        ({ chain }: CommandProps) => {
          const columns = Array.from({ length: count }, () => ({
            type: 'column',
            attrs: { width: 1 / count },
            content: [{ type: 'paragraph' }],
          }))

          return chain()
            .insertContent({
              type: this.name,
              content: columns,
            })
            .run()
        },
    }
  },
})

export const ColumnExtension = Node.create({
  name: 'column',
  group: '',
  content: 'block+',

  addAttributes() {
    return {
      width: { default: 0.5 },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-column]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-column': '',
        class: 'notion-column',
        style: `flex: ${HTMLAttributes.width || 0.5}`,
      }),
      0,
    ]
  },
})
