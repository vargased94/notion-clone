import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    equation: {
      setEquation: (latex: string) => ReturnType
    }
  }
}

export const EquationExtension = Node.create({
  name: 'equation',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      latex: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-equation]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-equation': '',
        'data-latex': HTMLAttributes.latex,
        class: 'notion-equation',
      }),
    ]
  },

  addCommands() {
    return {
      setEquation:
        (latex: string) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex },
          })
        },
    }
  },
})
