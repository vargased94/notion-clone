import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContents: {
      setTableOfContents: () => ReturnType
    }
  }
}

export const TableOfContentsExtension = Node.create({
  name: 'tableOfContents',
  group: 'block',
  atom: true,

  parseHTML() {
    return [{ tag: 'div[data-toc]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-toc': '',
        class: 'notion-toc',
      }),
      'Table of Contents',
    ]
  },

  addCommands() {
    return {
      setTableOfContents:
        () =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({ type: this.name })
        },
    }
  },
})
