import { useEffect, useCallback } from 'react'
import { Share2, X } from 'lucide-react'
import { useState } from 'react'
import { useSharing } from '../hooks/useSharing'
import { InviteInput } from './InviteInput'
import { PermissionRow } from './PermissionRow'
import { PublishToggle } from './PublishToggle'
import type { PermissionLevel, PageShare } from '../types/sharing.types'

interface ShareMenuProps {
  pageId: string
  pageCreatedBy: string
}

export function ShareMenu({ pageId, pageCreatedBy }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    permissions,
    share,
    isLoading,
    fetchPermissions,
    addPermission,
    updatePermission,
    removePermission,
    fetchShare,
    enableShare,
    disableShare,
    updateShare,
    reset,
  } = useSharing()

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    fetchPermissions(pageId)
    fetchShare(pageId)
  }, [isOpen, pageId, fetchPermissions, fetchShare, reset])

  const handleInvite = useCallback(
    (email: string, level: PermissionLevel) => addPermission(pageId, email, level),
    [pageId, addPermission],
  )

  const handleUpdatePerm = useCallback(
    (permissionId: string, level: PermissionLevel) => updatePermission(permissionId, level),
    [updatePermission],
  )

  const handleRemovePerm = useCallback(
    (permissionId: string) => removePermission(permissionId),
    [removePermission],
  )

  const handleEnableShare = useCallback(() => enableShare(pageId), [pageId, enableShare])
  const handleDisableShare = useCallback(() => disableShare(pageId), [pageId, disableShare])
  const handleUpdateShare = useCallback(
    (updates: Partial<Pick<PageShare, 'allow_editing' | 'allow_comments' | 'allow_duplicate' | 'search_indexing'>>) =>
      updateShare(pageId, updates),
    [pageId, updateShare],
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-50 mt-2 w-[400px] overflow-hidden rounded-xl border border-notion-border bg-notion-bg-secondary shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <span className="font-mono text-sm font-semibold text-notion-text-primary">
                Share
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Invite */}
            <InviteInput onInvite={handleInvite} />

            {/* Divider */}
            <div className="my-2 h-px bg-notion-divider" />

            {/* Permissions list */}
            <div className="max-h-[240px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
                </div>
              ) : permissions.length === 0 ? (
                <p className="px-3 py-4 text-center font-mono text-[11px] text-notion-text-muted">
                  No one has been invited yet
                </p>
              ) : (
                permissions.map((perm) => (
                  <PermissionRow
                    key={perm.id}
                    permission={perm}
                    isOwner={perm.user_id === pageCreatedBy}
                    onUpdate={handleUpdatePerm}
                    onRemove={handleRemovePerm}
                  />
                ))
              )}
            </div>

            {/* Divider */}
            <div className="my-2 h-px bg-notion-divider" />

            {/* Publish to web */}
            <div className="pb-3">
              <PublishToggle
                share={share}
                onEnable={handleEnableShare}
                onDisable={handleDisableShare}
                onUpdate={handleUpdateShare}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
