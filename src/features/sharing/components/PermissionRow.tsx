import { PermissionSelect } from './PermissionSelect'
import type { PagePermission, PermissionLevel } from '../types/sharing.types'

interface PermissionRowProps {
  permission: PagePermission
  isOwner: boolean
  onUpdate: (permissionId: string, level: PermissionLevel) => void
  onRemove: (permissionId: string) => void
}

export function PermissionRow({ permission, isOwner, onUpdate, onRemove }: PermissionRowProps) {
  const profile = permission.profile
  const initials = (profile?.full_name ?? profile?.email ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* Avatar */}
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name ?? ''}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-notion-bg-tertiary font-mono text-[10px] font-semibold text-notion-text-muted">
            {initials}
          </div>
        )}

        {/* Name + email */}
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-mono text-xs font-medium text-notion-text-primary">
            {profile?.full_name || profile?.email || 'Unknown'}
          </span>
          {profile?.full_name && (
            <span className="truncate font-mono text-[10px] text-notion-text-muted">
              {profile.email}
            </span>
          )}
        </div>
      </div>

      {/* Permission level */}
      {isOwner ? (
        <span className="shrink-0 font-mono text-xs text-notion-text-muted">Owner</span>
      ) : (
        <PermissionSelect
          value={permission.level}
          onChange={(level) => onUpdate(permission.id, level)}
          showRemove
          onRemove={() => onRemove(permission.id)}
        />
      )}
    </div>
  )
}
