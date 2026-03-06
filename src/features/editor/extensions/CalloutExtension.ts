import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { emoji?: string; color?: string }) => ReturnType
      toggleCallout: (attrs?: { emoji?: string; color?: string }) => ReturnType
    }
  }
}

export const CalloutExtension = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      emoji: { default: '💡' },
      color: { default: 'default' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        class: 'notion-callout',
      }),
      ['span', { class: 'notion-callout-icon', contenteditable: 'false' }, HTMLAttributes.emoji || '💡'],
      ['div', { class: 'notion-callout-content' }, 0],
    ]
  },

  addCommands() {
    return {
      setCallout:
        (attrs?: { emoji?: string; color?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.wrapIn(this.name, attrs)
        },
      toggleCallout:
        (attrs?: { emoji?: string; color?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.toggleWrap(this.name, attrs)
        },
    }
  },
})
