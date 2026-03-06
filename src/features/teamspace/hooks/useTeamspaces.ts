import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type { Teamspace, TeamspaceMember, TeamspaceType } from '../types/teamspace.types'

interface TeamsJoinedRow {
  id: string
  teamspace_id: string
  user_id: string
  role: string
  joined_at: string
  profile:
    | { id: string; full_name: string | null; avatar_url: string | null; email: string }
    | Array<{ id: string; full_name: string | null; avatar_url: string | null; email: string }>
}

function parseMember(row: TeamsJoinedRow): TeamspaceMember {
  const profile = Array.isArray(row.profile) ? row.profile[0] : row.profile
  return {
    id: row.id,
    teamspace_id: row.teamspace_id,
    user_id: row.user_id,
    role: row.role as TeamspaceMember['role'],
    joined_at: row.joined_at,
    profile: profile ?? undefined,
  }
}

interface TeamspacesState {
  teamspaces: Teamspace[]
  members: TeamspaceMember[]
  isLoading: boolean

  fetchTeamspaces: (workspaceId: string) => Promise<void>
  fetchMembers: (teamspaceId: string) => Promise<void>
  createTeamspace: (workspaceId: string, name: string, type?: TeamspaceType) => Promise<Teamspace | null>
  updateTeamspace: (id: string, updates: Partial<Pick<Teamspace, 'name' | 'description' | 'icon_url' | 'type' | 'is_archived'>>) => Promise<void>
  deleteTeamspace: (id: string) => Promise<void>
  joinTeamspace: (teamspaceId: string) => Promise<void>
  leaveTeamspace: (teamspaceId: string) => Promise<void>
  removeMember: (memberId: string) => Promise<void>
  reset: () => void
}

export const useTeamspaces = create<TeamspacesState>()(
  immer((set) => ({
    teamspaces: [],
    members: [],
    isLoading: false,

    fetchTeamspaces: async (workspaceId) => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('teamspaces')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_archived', false)
        .order('name', { ascending: true })

      set({ teamspaces: (data ?? []) as Teamspace[], isLoading: false })
    },

    fetchMembers: async (teamspaceId) => {
      const { data } = await supabase
        .from('teamspace_members')
        .select(`
          id, teamspace_id, user_id, role, joined_at,
          profile:profiles!teamspace_members_user_id_fkey(id, full_name, avatar_url, email)
        `)
        .eq('teamspace_id', teamspaceId)
        .order('joined_at', { ascending: true })

      if (data) {
        set({ members: (data as unknown as TeamsJoinedRow[]).map(parseMember) })
      }
    },

    createTeamspace: async (workspaceId, name, type = 'open') => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('teamspaces')
        .insert({
          workspace_id: workspaceId,
          name,
          type,
          created_by: user.id,
        })
        .select()
        .single()

      if (error || !data) return null

      const teamspace = data as Teamspace

      // Auto-add creator as owner
      await supabase
        .from('teamspace_members')
        .insert({
          teamspace_id: teamspace.id,
          user_id: user.id,
          role: 'owner',
        })

      set((state) => { state.teamspaces.push(teamspace) })
      return teamspace
    },

    updateTeamspace: async (id, updates) => {
      const { data } = await supabase
        .from('teamspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (data) {
        set((state) => {
          const idx = state.teamspaces.findIndex((t) => t.id === id)
          if (idx !== -1) state.teamspaces[idx] = data as Teamspace
        })
      }
    },

    deleteTeamspace: async (id) => {
      await supabase.from('teamspaces').delete().eq('id', id)
      set((state) => {
        state.teamspaces = state.teamspaces.filter((t) => t.id !== id)
      })
    },

    joinTeamspace: async (teamspaceId) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('teamspace_members')
        .insert({ teamspace_id: teamspaceId, user_id: user.id, role: 'member' })
        .select(`
          id, teamspace_id, user_id, role, joined_at,
          profile:profiles!teamspace_members_user_id_fkey(id, full_name, avatar_url, email)
        `)
        .single()

      if (data) {
        set((state) => {
          state.members.push(parseMember(data as unknown as TeamsJoinedRow))
        })
      }
    },

    leaveTeamspace: async (teamspaceId) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('teamspace_members')
        .delete()
        .eq('teamspace_id', teamspaceId)
        .eq('user_id', user.id)

      set((state) => {
        state.members = state.members.filter(
          (m) => !(m.teamspace_id === teamspaceId && m.user_id === user.id),
        )
      })
    },

    removeMember: async (memberId) => {
      await supabase.from('teamspace_members').delete().eq('id', memberId)
      set((state) => {
        state.members = state.members.filter((m) => m.id !== memberId)
      })
    },

    reset: () => {
      set({ teamspaces: [], members: [], isLoading: false })
    },
  })),
)
