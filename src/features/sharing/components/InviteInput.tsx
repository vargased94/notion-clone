import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { PermissionSelect } from './PermissionSelect'
import type { PermissionLevel } from '../types/sharing.types'

interface InviteInputProps {
  onInvite: (email: string, level: PermissionLevel) => Promise<{ error?: string }>
}

export function InviteInput({ onInvite }: InviteInputProps) {
  const [email, setEmail] = useState('')
  const [level, setLevel] = useState<PermissionLevel>('can_view')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setError(null)
    setIsSubmitting(true)

    const result = await onInvite(email.trim(), level)

    if (result.error) {
      setError(result.error)
    } else {
      setEmail('')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="px-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <UserPlus className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-notion-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            placeholder="Add people by email..."
            className="w-full rounded-md border border-notion-border bg-notion-bg-primary py-1.5 pr-2 pl-8 font-mono text-xs text-notion-text-primary placeholder-notion-text-muted outline-none transition-colors focus:border-notion-green-primary"
          />
        </div>
        <PermissionSelect value={level} onChange={setLevel} />
        <button
          type="submit"
          disabled={!email.trim() || isSubmitting}
          className="shrink-0 rounded-md bg-notion-green-primary px-3 py-1.5 font-mono text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Invite
        </button>
      </div>
      {error && (
        <p className="mt-1.5 font-mono text-[10px] text-red-400">{error}</p>
      )}
    </form>
  )
}
