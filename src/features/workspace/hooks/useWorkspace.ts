import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface Workspace {
  id: string
  name: string
  icon_url: string | null
  slug: string | null
  plan: string
  created_by: string
  created_at: string
  updated_at: string
}

interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  joined_at: string
}

interface WorkspaceState {
  workspace: Workspace | null
  members: WorkspaceMember[]
  isLoading: boolean
  fetchWorkspace: () => Promise<void>
  fetchMembers: () => Promise<void>
  updateWorkspace: (updates: Partial<Pick<Workspace, 'name' | 'icon_url'>>) => Promise<void>
}

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  workspace: null,
  members: [],
  isLoading: false,

  fetchWorkspace: async () => {
    set({ isLoading: true })

    // Get the first workspace the user is a member of
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .limit(1)
      .single()

    if (!membership) {
      set({ isLoading: false })
      return
    }

    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', membership.workspace_id)
      .single()

    set({ workspace: data, isLoading: false })
  },

  fetchMembers: async () => {
    const { workspace } = get()
    if (!workspace) return

    const { data } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspace.id)

    set({ members: data ?? [] })
  },

  updateWorkspace: async (updates) => {
    const { workspace } = get()
    if (!workspace) return

    const { data } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspace.id)
      .select()
      .single()

    if (data) set({ workspace: data })
  },
}))
