import { Extension } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

export interface SlashCommandState {
  active: boolean
  query: string
  position: { top: number; left: number }
  range: { from: number; to: number } | null
}

const slashCommandPluginKey = new PluginKey('slashCommand')

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: slashCommandPluginKey,
        state: {
          init(): SlashCommandState {
            return { active: false, query: '', position: { top: 0, left: 0 }, range: null }
          },
          apply(tr, _prev): SlashCommandState {
            const meta = tr.getMeta(slashCommandPluginKey)
            if (meta) return meta
            if (tr.docChanged || tr.selectionSet) {
              // Check if slash is typed
              const { $from } = tr.selection
              const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)
              const match = textBefore.match(/\/([\w]*)$/)

              if (match) {
                const view = editor.view as EditorView
                const coords = view.coordsAtPos($from.pos)
                return {
                  active: true,
                  query: match[1],
                  position: { top: coords.bottom + 4, left: coords.left },
                  range: { from: $from.pos - match[0].length, to: $from.pos },
                }
              }
            }
            return { active: false, query: '', position: { top: 0, left: 0 }, range: null }
          },
        },
        props: {
          handleKeyDown(_view, event) {
            const state = slashCommandPluginKey.getState(_view.state) as SlashCommandState
            if (state?.active && event.key === 'Escape') {
              _view.dispatch(_view.state.tr.setMeta(slashCommandPluginKey, {
                active: false,
                query: '',
                position: { top: 0, left: 0 },
                range: null,
              }))
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})

export { slashCommandPluginKey }
