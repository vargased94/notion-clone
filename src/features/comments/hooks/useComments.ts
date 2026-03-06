import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type { Comment, CommentContent, CommentStatus } from '../types/comment.types'

interface JoinedCommentRow {
  id: string
  page_id: string
  block_id: string | null
  parent_comment_id: string | null
  content: unknown
  text_range: unknown
  status: string
  resolved_by: string | null
  resolved_at: string | null
  created_by: string
  created_at: string
  updated_at: string
  author:
    | { id: string; full_name: string | null; avatar_url: string | null }
    | Array<{ id: string; full_name: string | null; avatar_url: string | null }>
}

function parseRow(row: JoinedCommentRow): Comment {
  const author = Array.isArray(row.author) ? row.author[0] : row.author
  return {
    id: row.id,
    page_id: row.page_id,
    block_id: row.block_id,
    parent_comment_id: row.parent_comment_id,
    content: row.content as CommentContent[],
    text_range: row.text_range as Comment['text_range'],
    status: row.status as CommentStatus,
    resolved_by: row.resolved_by,
    resolved_at: row.resolved_at,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: author ?? undefined,
  }
}

function buildThreads(flat: Comment[]): Comment[] {
  const map = new Map<string, Comment>()
  const roots: Comment[] = []

  for (const c of flat) {
    map.set(c.id, { ...c, replies: [] })
  }

  for (const c of flat) {
    const node = map.get(c.id)!
    if (c.parent_comment_id) {
      const parent = map.get(c.parent_comment_id)
      if (parent) {
        parent.replies = parent.replies ?? []
        parent.replies.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  return roots
}

interface CommentsState {
  comments: Comment[]
  threads: Comment[]
  isLoading: boolean

  fetchComments: (pageId: string) => Promise<void>
  addComment: (
    pageId: string,
    content: CommentContent[],
    opts?: { blockId?: string; parentCommentId?: string },
  ) => Promise<Comment | null>
  updateComment: (commentId: string, content: CommentContent[]) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  resolveComment: (commentId: string) => Promise<void>
  reopenComment: (commentId: string) => Promise<void>
  reset: () => void
}

export const useComments = create<CommentsState>()(
  immer((set) => ({
    comments: [],
    threads: [],
    isLoading: false,

    fetchComments: async (pageId) => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('comments')
        .select(`
          id, page_id, block_id, parent_comment_id, content, text_range,
          status, resolved_by, resolved_at, created_by, created_at, updated_at,
          author:profiles!comments_created_by_fkey(id, full_name, avatar_url)
        `)
        .eq('page_id', pageId)
        .order('created_at', { ascending: true })

      const flat = (data as unknown as JoinedCommentRow[] | null)?.map(parseRow) ?? []
      const threads = buildThreads(flat)

      set({ comments: flat, threads, isLoading: false })
    },

    addComment: async (pageId, content, opts) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('comments')
        .insert({
          page_id: pageId,
          block_id: opts?.blockId ?? null,
          parent_comment_id: opts?.parentCommentId ?? null,
          content,
          created_by: user.id,
        })
        .select(`
          id, page_id, block_id, parent_comment_id, content, text_range,
          status, resolved_by, resolved_at, created_by, created_at, updated_at,
          author:profiles!comments_created_by_fkey(id, full_name, avatar_url)
        `)
        .single()

      if (error || !data) return null

      const comment = parseRow(data as unknown as JoinedCommentRow)

      set((state) => {
        state.comments.push(comment)
        state.threads = buildThreads([...state.comments])
      })

      return comment
    },

    updateComment: async (commentId, content) => {
      await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)

      set((state) => {
        const c = state.comments.find((x) => x.id === commentId)
        if (c) c.content = content
        state.threads = buildThreads([...state.comments])
      })
    },

    deleteComment: async (commentId) => {
      await supabase.from('comments').delete().eq('id', commentId)

      set((state) => {
        state.comments = state.comments.filter((c) => c.id !== commentId)
        state.threads = buildThreads([...state.comments])
      })
    },

    resolveComment: async (commentId) => {
      const { data: { user } } = await supabase.auth.getUser()

      await supabase
        .from('comments')
        .update({
          status: 'resolved',
          resolved_by: user?.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', commentId)

      set((state) => {
        const c = state.comments.find((x) => x.id === commentId)
        if (c) {
          c.status = 'resolved'
          c.resolved_by = user?.id ?? null
          c.resolved_at = new Date().toISOString()
        }
        state.threads = buildThreads([...state.comments])
      })
    },

    reopenComment: async (commentId) => {
      await supabase
        .from('comments')
        .update({
          status: 'open',
          resolved_by: null,
          resolved_at: null,
        })
        .eq('id', commentId)

      set((state) => {
        const c = state.comments.find((x) => x.id === commentId)
        if (c) {
          c.status = 'open'
          c.resolved_by = null
          c.resolved_at = null
        }
        state.threads = buildThreads([...state.comments])
      })
    },

    reset: () => {
      set({ comments: [], threads: [], isLoading: false })
    },
  })),
)
