import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggle: {
      setToggle: () => ReturnType
      toggleToggle: () => ReturnType
    }
  }
}

export const ToggleExtension = Node.create({
  name: 'toggle',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      open: { default: true },
    }
  },

  parseHTML() {
    return [{ tag: 'details' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes, {
        class: 'notion-toggle',
        open: HTMLAttributes.open ? '' : undefined,
      }),
      ['summary', { class: 'notion-toggle-summary' }, ''],
      ['div', { class: 'notion-toggle-content' }, 0],
    ]
  },

  addCommands() {
    return {
      setToggle:
        () =>
        ({ commands }: CommandProps) => {
          return commands.wrapIn(this.name)
        },
      toggleToggle:
        () =>
        ({ commands }: CommandProps) => {
          return commands.toggleWrap(this.name)
        },
    }
  },
})
