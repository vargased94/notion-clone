import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'

export interface Block {
  id: string
  page_id: string
  parent_block_id: string | null
  type: string
  content: unknown[]
  properties: Record<string, unknown>
  color: string | null
  position: number
  created_at: string
  updated_at: string
}

interface BlocksState {
  blocks: Block[]
  isLoading: boolean
  saveTimeoutId: ReturnType<typeof setTimeout> | null

  fetchBlocks: (pageId: string) => Promise<void>
  addBlock: (pageId: string, type?: string, afterBlockId?: string | null) => Promise<Block | null>
  updateBlock: (blockId: string, updates: Partial<Pick<Block, 'type' | 'content' | 'properties' | 'color'>>) => void
  deleteBlock: (blockId: string) => Promise<void>
  moveBlock: (blockId: string, newPosition: number) => void
  saveBlocks: () => Promise<void>
  getBlocksByPage: (pageId: string) => Block[]
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useBlocks = create<BlocksState>()(
  immer((set, get) => ({
    blocks: [],
    isLoading: false,
    saveTimeoutId: null,

    fetchBlocks: async (pageId) => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', pageId)
        .is('parent_block_id', null)
        .order('position', { ascending: true })

      set({ blocks: data ?? [], isLoading: false })
    },

    addBlock: async (pageId, type = 'paragraph', afterBlockId = null) => {
      const { blocks } = get()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Calculate position
      let position = 0
      if (afterBlockId) {
        const afterIdx = blocks.findIndex((b) => b.id === afterBlockId)
        if (afterIdx !== -1) {
          const afterPos = blocks[afterIdx].position
          const nextPos = blocks[afterIdx + 1]?.position ?? afterPos + 1
          position = (afterPos + nextPos) / 2
        }
      } else {
        position = blocks.length > 0 ? blocks[blocks.length - 1].position + 1 : 0
      }

      const { data, error } = await supabase
        .from('blocks')
        .insert({
          page_id: pageId,
          type,
          content: [],
          properties: {},
          position,
          created_by: user.id,
          last_edited_by: user.id,
        })
        .select()
        .single()

      if (error || !data) return null

      set((state) => {
        state.blocks.push(data)
        state.blocks.sort((a, b) => a.position - b.position)
      })

      return data
    },

    updateBlock: (blockId, updates) => {
      set((state) => {
        const idx = state.blocks.findIndex((b) => b.id === blockId)
        if (idx !== -1) {
          Object.assign(state.blocks[idx], updates)
        }
      })

      // Debounced save
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        get().saveBlocks()
      }, 500)
    },

    deleteBlock: async (blockId) => {
      await supabase.from('blocks').delete().eq('id', blockId)

      set((state) => {
        state.blocks = state.blocks.filter((b) => b.id !== blockId)
      })
    },

    moveBlock: (blockId, newPosition) => {
      set((state) => {
        const idx = state.blocks.findIndex((b) => b.id === blockId)
        if (idx !== -1) {
          state.blocks[idx].position = newPosition
          state.blocks.sort((a, b) => a.position - b.position)
        }
      })

      // Debounced save
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        get().saveBlocks()
      }, 500)
    },

    saveBlocks: async () => {
      const { blocks } = get()
      const { data: { user } } = await supabase.auth.getUser()

      for (const block of blocks) {
        await supabase
          .from('blocks')
          .update({
            type: block.type,
            content: block.content,
            properties: block.properties,
            color: block.color,
            position: block.position,
            last_edited_by: user?.id,
          })
          .eq('id', block.id)
      }
    },

    getBlocksByPage: (pageId) => {
      return get().blocks.filter((b) => b.page_id === pageId)
    },
  }))
)
