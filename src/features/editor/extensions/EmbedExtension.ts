import { Node, mergeAttributes } from '@tiptap/react'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attrs: { src: string; height?: number }) => ReturnType
    }
  }
}

export const EmbedExtension = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: 400 },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-embed]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-embed': '', class: 'notion-embed' }),
      [
        'iframe',
        {
          src: HTMLAttributes.src,
          width: HTMLAttributes.width,
          height: HTMLAttributes.height,
          frameborder: '0',
          allowfullscreen: 'true',
          class: 'notion-embed-iframe',
        },
      ],
    ]
  },

  addCommands() {
    return {
      setEmbed:
        (attrs: { src: string; height?: number }) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
})
