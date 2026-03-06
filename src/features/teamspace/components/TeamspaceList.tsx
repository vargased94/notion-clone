import { useEffect, useState, useCallback } from 'react'
import { Users, Plus, Globe, Lock, EyeOff, MoreHorizontal, Trash2, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTeamspaces } from '../hooks/useTeamspaces'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'
import type { TeamspaceType } from '../types/teamspace.types'

const TYPE_ICON = {
  open: Globe,
  closed: Lock,
  private: EyeOff,
} as const

const TYPE_LABEL: Record<TeamspaceType, string> = {
  open: 'Open',
  closed: 'Closed',
  private: 'Private',
}

export function TeamspaceList() {
  const { workspace } = useWorkspace()
  const { teamspaces, isLoading, fetchTeamspaces, createTeamspace, deleteTeamspace, leaveTeamspace } = useTeamspaces()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<TeamspaceType>('open')
  const [menuId, setMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (workspace) fetchTeamspaces(workspace.id)
  }, [workspace, fetchTeamspaces])

  const handleCreate = useCallback(async () => {
    if (!workspace || !newName.trim()) return
    await createTeamspace(workspace.id, newName.trim(), newType)
    setNewName('')
    setNewType('open')
    setShowCreate(false)
  }, [workspace, newName, newType, createTeamspace])

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-notion-text-muted">
          TEAMSPACES
        </span>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded p-0.5 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mx-1 rounded-lg border border-notion-border bg-notion-bg-primary p-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Teamspace name"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowCreate(false) }}
            className="w-full rounded-md border border-notion-border bg-transparent px-2.5 py-1.5 font-mono text-xs text-notion-text-primary placeholder-notion-text-muted outline-none focus:border-notion-green-primary"
          />
          <div className="mt-2 flex gap-1">
            {(['open', 'closed', 'private'] as const).map((t) => {
              const Icon = TYPE_ICON[t]
              return (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] transition-colors',
                    newType === t
                      ? 'bg-notion-green-primary/10 text-notion-green-primary'
                      : 'text-notion-text-muted hover:bg-notion-bg-hover',
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {TYPE_LABEL[t]}
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex justify-end gap-1.5">
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-md px-2.5 py-1 font-mono text-xs text-notion-text-muted hover:bg-notion-bg-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="rounded-md bg-notion-green-primary px-2.5 py-1 font-mono text-xs font-medium text-white disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
        </div>
      ) : teamspaces.length === 0 && !showCreate ? (
        <p className="px-2 py-3 font-mono text-[11px] text-notion-text-muted">
          No teamspaces yet
        </p>
      ) : (
        teamspaces.map((ts) => {
          const TypeIcon = TYPE_ICON[ts.type]
          return (
            <div
              key={ts.id}
              className="group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-notion-bg-hover"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-notion-bg-tertiary">
                  <Users className="h-3.5 w-3.5 text-notion-text-muted" />
                </div>
                <span className="truncate font-mono text-xs font-medium text-notion-text-primary">
                  {ts.name}
                </span>
                <TypeIcon className="h-3 w-3 shrink-0 text-notion-text-muted" />
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuId(menuId === ts.id ? null : ts.id)}
                  className="hidden rounded p-0.5 text-notion-text-muted hover:bg-notion-bg-active group-hover:block"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {menuId === ts.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />
                    <div className="absolute top-full right-0 z-50 mt-1 w-[160px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-xl">
                      <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover">
                        <Settings className="h-3 w-3" />
                        Settings
                      </button>
                      <button
                        onClick={() => { leaveTeamspace(ts.id); setMenuId(null) }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                      >
                        <LogOut className="h-3 w-3" />
                        Leave
                      </button>
                      <div className="my-1 h-px bg-notion-divider" />
                      <button
                        onClick={() => { deleteTeamspace(ts.id); setMenuId(null) }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs text-red-400 hover:bg-notion-bg-hover"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
